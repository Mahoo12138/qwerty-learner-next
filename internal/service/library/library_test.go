package library

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

func newTestLibraryService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(
		&entity.WordBank{},
		&entity.SentenceBank{},
		&entity.ArticleBank{},
		&entity.LibrarySubscription{},
	); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	if err = db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_library_subscriptions_unique ON library_subscriptions(user_id, library_type, library_id)").Error; err != nil {
		t.Fatalf("create subscription unique index failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background()
}

func TestSubscribeRejectsPrivateForeignLibrary(t *testing.T) {
	svc, db, ctx := newTestLibraryService(t)
	now := time.Now()

	bank := entity.WordBank{
		ID:        "bank-private",
		OwnerID:   "owner-1",
		Name:      "Private bank",
		Language:  "en",
		IsPublic:  0,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed word bank failed: %v", err)
	}

	_, err := svc.Subscribe(ctx, "user-2", SubscribeReq{LibraryType: TypeWordBank, LibraryID: bank.ID})
	if err == nil {
		t.Fatal("expected forbidden error")
	}
	if gerror.Code(err).Code() != 40301 {
		t.Fatalf("expected 40301, got %d", gerror.Code(err).Code())
	}
}

func TestListSubscriptionsReturnsResolvedMetadata(t *testing.T) {
	svc, db, ctx := newTestLibraryService(t)
	now := time.Now()

	wordBank := entity.WordBank{
		ID:        "word-bank-1",
		OwnerID:   "owner-1",
		Name:      "CET4",
		Language:  "en",
		IsPublic:  1,
		CreatedAt: now,
		UpdatedAt: now,
	}
	articleBank := entity.ArticleBank{
		ID:        "article-bank-1",
		OwnerID:   "owner-2",
		Name:      "Reader",
		Language:  "en",
		IsPublic:  1,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := db.Create(&wordBank).Error; err != nil {
		t.Fatalf("seed word bank failed: %v", err)
	}
	if err := db.Create(&articleBank).Error; err != nil {
		t.Fatalf("seed article bank failed: %v", err)
	}

	if _, err := svc.Subscribe(ctx, "user-1", SubscribeReq{LibraryType: TypeWordBank, LibraryID: wordBank.ID}); err != nil {
		t.Fatalf("subscribe word bank failed: %v", err)
	}
	if _, err := svc.Subscribe(ctx, "user-1", SubscribeReq{LibraryType: TypeArticleBank, LibraryID: articleBank.ID}); err != nil {
		t.Fatalf("subscribe article bank failed: %v", err)
	}

	items, err := svc.ListSubscriptions(ctx, "user-1", "")
	if err != nil {
		t.Fatalf("ListSubscriptions failed: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 subscriptions, got %d", len(items))
	}

	resolved := map[string]SubscriptionItem{}
	for _, item := range items {
		resolved[item.LibraryType] = item
	}
	if resolved[TypeWordBank].LibraryName != "CET4" {
		t.Fatalf("expected word bank name CET4, got %q", resolved[TypeWordBank].LibraryName)
	}
	if resolved[TypeWordBank].IsAvailable != 1 {
		t.Fatalf("expected word bank available, got %d", resolved[TypeWordBank].IsAvailable)
	}
	if resolved[TypeArticleBank].LibraryName != "Reader" {
		t.Fatalf("expected article bank name Reader, got %q", resolved[TypeArticleBank].LibraryName)
	}
}

func TestListSubscriptionsKeepsPrivateSourceWithUnavailableState(t *testing.T) {
	svc, db, ctx := newTestLibraryService(t)
	now := time.Now()

	bank := entity.WordBank{
		ID:        "word-bank-1",
		OwnerID:   "owner-1",
		Name:      "CET4",
		Language:  "en",
		IsPublic:  1,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed word bank failed: %v", err)
	}
	if _, err := svc.Subscribe(ctx, "user-2", SubscribeReq{LibraryType: TypeWordBank, LibraryID: bank.ID}); err != nil {
		t.Fatalf("subscribe failed: %v", err)
	}
	if err := db.Model(&entity.WordBank{}).Where("id = ?", bank.ID).Update("is_public", 0).Error; err != nil {
		t.Fatalf("make bank private failed: %v", err)
	}

	items, err := svc.ListSubscriptions(ctx, "user-2", TypeWordBank)
	if err != nil {
		t.Fatalf("ListSubscriptions failed: %v", err)
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 subscription, got %d", len(items))
	}
	if items[0].IsAvailable != 0 {
		t.Fatalf("expected unavailable subscription, got %d", items[0].IsAvailable)
	}
	if items[0].UnavailableReason != "library_private" {
		t.Fatalf("expected library_private, got %q", items[0].UnavailableReason)
	}
	if items[0].LibraryName != "CET4" {
		t.Fatalf("expected preserved library name CET4, got %q", items[0].LibraryName)
	}
}

func TestListSubscriptionsKeepsSoftDeletedSourceWithUnavailableState(t *testing.T) {
	svc, db, ctx := newTestLibraryService(t)
	now := time.Now()

	bank := entity.WordBank{
		ID:        "word-bank-1",
		OwnerID:   "owner-1",
		Name:      "History Book",
		Language:  "en",
		IsPublic:  1,
		CreatedAt: now,
		UpdatedAt: now,
	}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed word bank failed: %v", err)
	}
	if _, err := svc.Subscribe(ctx, "user-2", SubscribeReq{LibraryType: TypeWordBank, LibraryID: bank.ID}); err != nil {
		t.Fatalf("subscribe failed: %v", err)
	}
	if err := db.Delete(&bank).Error; err != nil {
		t.Fatalf("soft delete bank failed: %v", err)
	}

	items, err := svc.ListSubscriptions(ctx, "user-2", TypeWordBank)
	if err != nil {
		t.Fatalf("ListSubscriptions failed: %v", err)
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 subscription, got %d", len(items))
	}
	if items[0].IsAvailable != 0 {
		t.Fatalf("expected unavailable subscription, got %d", items[0].IsAvailable)
	}
	if items[0].UnavailableReason != "library_deleted" {
		t.Fatalf("expected library_deleted, got %q", items[0].UnavailableReason)
	}
	if items[0].LibraryName != "History Book" {
		t.Fatalf("expected preserved library name, got %q", items[0].LibraryName)
	}
}
