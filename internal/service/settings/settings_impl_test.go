package settings

import (
	"context"
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"github.com/gogf/gf/v2/errors/gerror"
	"gorm.io/gorm"

	"taptype/internal/model/entity"
)

func newTestSettingsService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(
		&entity.SettingDefinition{},
		&entity.SystemSetting{},
		&entity.UserSetting{},
		&entity.SettingControl{},
	); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	if err = db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_user_definition ON user_settings(user_id, definition_key)").Error; err != nil {
		t.Fatalf("create unique index failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background()
}

func seedSettingDefinitions(t *testing.T, db *gorm.DB) {
	t.Helper()

	now := time.Now()
	defs := []entity.SettingDefinition{
		{
			Key:          "system.max_word_banks_per_user",
			Scope:        "system",
			Type:         "int",
			GroupKey:     "limits",
			Label:        "Max words",
			DefaultValue: "20",
			ValidationRule: `{"min":0,"max":100}`,
			CreatedAt:    now,
			UpdatedAt:    now,
		},
		{
			Key:          "user.theme",
			Scope:        "user",
			Type:         "enum",
			GroupKey:     "display",
			Label:        "Theme",
			DefaultValue: "system",
			EnumOptions:  `["light","dark","system"]`,
			CreatedAt:    now,
			UpdatedAt:    now,
		},
	}

	if err := db.Create(&defs).Error; err != nil {
		t.Fatalf("seed setting definitions failed: %v", err)
	}
}

func TestGetSystemSetting_ReturnsDefaultWhenUnset(t *testing.T) {
	svc, db, ctx := newTestSettingsService(t)
	seedSettingDefinitions(t, db)

	value, err := svc.GetSystemSetting(ctx, "system.max_word_banks_per_user")
	if err != nil {
		t.Fatalf("GetSystemSetting failed: %v", err)
	}
	if value != "20" {
		t.Fatalf("expected default value 20, got %q", value)
	}
}

func TestSetSystemSetting_ValidatesRangeAndPersists(t *testing.T) {
	svc, db, ctx := newTestSettingsService(t)
	seedSettingDefinitions(t, db)

	err := svc.SetSystemSetting(ctx, "system.max_word_banks_per_user", "101", "admin-1")
	if err == nil {
		t.Fatal("expected validation error")
	}
	if gerror.Code(err).Code() != 40001 {
		t.Fatalf("expected error code 40001, got %d", gerror.Code(err).Code())
	}

	err = svc.SetSystemSetting(ctx, "system.max_word_banks_per_user", "30", "admin-1")
	if err != nil {
		t.Fatalf("SetSystemSetting failed: %v", err)
	}

	var saved entity.SystemSetting
	if err := db.First(&saved, "definition_key = ?", "system.max_word_banks_per_user").Error; err != nil {
		t.Fatalf("load saved system setting failed: %v", err)
	}
	if saved.Value != "30" {
		t.Fatalf("expected value 30, got %q", saved.Value)
	}
	if saved.UpdatedBy != "admin-1" {
		t.Fatalf("expected updated_by admin-1, got %q", saved.UpdatedBy)
	}
}

func TestSetUserSetting_RespectsControlAndUpserts(t *testing.T) {
	svc, db, ctx := newTestSettingsService(t)
	seedSettingDefinitions(t, db)

	if err := svc.SetSettingControl(ctx, "user.theme", true, false, "admin-1"); err != nil {
		t.Fatalf("SetSettingControl failed: %v", err)
	}

	var control entity.SettingControl
	if err := db.First(&control, "definition_key = ?", "user.theme").Error; err != nil {
		t.Fatalf("load saved setting control failed: %v", err)
	}
	if control.IsEditable != 0 {
		t.Fatalf("expected is_editable 0, got %d", control.IsEditable)
	}

	err := svc.SetUserSetting(ctx, "user-1", "user.theme", "dark")
	if err == nil {
		t.Fatal("expected forbidden error for non-editable setting")
	}
	if gerror.Code(err).Code() != 40301 {
		t.Fatalf("expected error code 40301, got %d", gerror.Code(err).Code())
	}

	if err := db.Model(&entity.SettingControl{}).Where("definition_key = ?", "user.theme").Update("is_editable", 1).Error; err != nil {
		t.Fatalf("update setting control failed: %v", err)
	}

	err = svc.SetUserSetting(ctx, "user-1", "user.theme", "dark")
	if err != nil {
		t.Fatalf("SetUserSetting failed: %v", err)
	}
	err = svc.SetUserSetting(ctx, "user-1", "user.theme", "light")
	if err != nil {
		t.Fatalf("SetUserSetting upsert failed: %v", err)
	}

	var saved entity.UserSetting
	if err := db.First(&saved, "user_id = ? AND definition_key = ?", "user-1", "user.theme").Error; err != nil {
		t.Fatalf("load saved user setting failed: %v", err)
	}
	if saved.Value != "light" {
		t.Fatalf("expected final value light, got %q", saved.Value)
	}
}
