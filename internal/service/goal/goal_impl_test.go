package goal

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

func newTestGoalService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context, string) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(&entity.UserGoal{}, &entity.DailyRecord{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background(), "user-goal-1"
}

func TestCreateGoal_DefaultPeriodAndValidation(t *testing.T) {
	svc, db, ctx, userID := newTestGoalService(t)

	goal, err := svc.CreateGoal(ctx, userID, "wpm", 80, "")
	if err != nil {
		t.Fatalf("CreateGoal failed: %v", err)
	}
	if goal.Period != "daily" {
		t.Fatalf("expected default period daily, got %q", goal.Period)
	}
	if goal.IsActive != 1 {
		t.Fatalf("expected active goal, got %d", goal.IsActive)
	}

	var saved entity.UserGoal
	if err := db.First(&saved, "id = ?", goal.ID).Error; err != nil {
		t.Fatalf("load saved goal failed: %v", err)
	}
	if saved.TargetValue != 80 {
		t.Fatalf("expected saved target 80, got %v", saved.TargetValue)
	}

	_, err = svc.CreateGoal(ctx, userID, "unknown", 10, "daily")
	if err == nil {
		t.Fatal("expected invalid goal_type error")
	}
	if gerror.Code(err).Code() != 40001 {
		t.Fatalf("expected error code 40001, got %d", gerror.Code(err).Code())
	}

	_, err = svc.CreateGoal(ctx, userID, "wpm", 0, "daily")
	if err == nil {
		t.Fatal("expected invalid target_value error")
	}
	if gerror.Code(err).Code() != 40001 {
		t.Fatalf("expected error code 40001, got %d", gerror.Code(err).Code())
	}
}

func TestRefreshDailyProgress_UsesTodayDailyRecord(t *testing.T) {
	svc, db, ctx, userID := newTestGoalService(t)
	now := time.Now()
	today := now.Format("2006-01-02")

	goals := []entity.UserGoal{
		{ID: "goal-duration", UserID: userID, GoalType: "duration", TargetValue: 20, Period: "daily", StartDate: today, IsActive: 1, CreatedAt: now, UpdatedAt: now},
		{ID: "goal-accuracy", UserID: userID, GoalType: "accuracy", TargetValue: 95, Period: "daily", StartDate: today, IsActive: 1, CreatedAt: now, UpdatedAt: now},
		{ID: "goal-count", UserID: userID, GoalType: "practice_count", TargetValue: 3, Period: "daily", StartDate: today, IsActive: 1, CreatedAt: now, UpdatedAt: now},
	}
	if err := db.Create(&goals).Error; err != nil {
		t.Fatalf("seed goals failed: %v", err)
	}

	daily := entity.DailyRecord{
		ID:              "daily-1",
		UserID:          userID,
		RecordDate:      today,
		PracticeCount:   4,
		TotalDurationMs: 180000,
		AvgWpm:          72.5,
		AvgAccuracy:     0.96,
		StreakDay:       2,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if err := db.Create(&daily).Error; err != nil {
		t.Fatalf("seed daily record failed: %v", err)
	}

	if err := svc.RefreshDailyProgress(ctx, userID); err != nil {
		t.Fatalf("RefreshDailyProgress failed: %v", err)
	}

	var durationGoal entity.UserGoal
	if err := db.First(&durationGoal, "id = ?", "goal-duration").Error; err != nil {
		t.Fatalf("load duration goal failed: %v", err)
	}
	if durationGoal.CurrentValue != 3 {
		t.Fatalf("expected duration minutes 3, got %v", durationGoal.CurrentValue)
	}

	var accuracyGoal entity.UserGoal
	if err := db.First(&accuracyGoal, "id = ?", "goal-accuracy").Error; err != nil {
		t.Fatalf("load accuracy goal failed: %v", err)
	}
	if accuracyGoal.CurrentValue != 96 {
		t.Fatalf("expected accuracy percentage 96, got %v", accuracyGoal.CurrentValue)
	}

	var countGoal entity.UserGoal
	if err := db.First(&countGoal, "id = ?", "goal-count").Error; err != nil {
		t.Fatalf("load count goal failed: %v", err)
	}
	if countGoal.CurrentValue != 4 {
		t.Fatalf("expected practice count 4, got %v", countGoal.CurrentValue)
	}
}
