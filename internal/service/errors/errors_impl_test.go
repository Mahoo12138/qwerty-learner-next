package errors

import (
	"context"
	"fmt"
	"strings"
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"taptype/internal/model/entity"
)

func newTestErrorsService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(&entity.Word{}, &entity.ErrorRecord{}, &entity.PracticeSession{}, &entity.PracticeSessionItem{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background()
}

func TestListErrorsIncludesSoftDeletedWordContent(t *testing.T) {
	svc, db, ctx := newTestErrorsService(t)
	now := time.Now()

	word := entity.Word{ID: "word-1", BankID: "bank-1", Content: "retained", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	record := entity.ErrorRecord{
		ID:             "err-1",
		UserID:         "user-1",
		SessionID:      "session-1",
		ContentType:    "word",
		ContentID:      word.ID,
		ErrorCount:     1,
		AvgTimeMs:      200,
		LastSeenAt:     now,
		NextReviewAt:   now,
		ReviewInterval: 1,
		EasinessFactor: 2.5,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}
	if err := db.Create(&record).Error; err != nil {
		t.Fatalf("seed error record failed: %v", err)
	}
	if err := db.Delete(&word).Error; err != nil {
		t.Fatalf("soft delete word failed: %v", err)
	}

	records, total, err := svc.ListErrors(ctx, "user-1", "word", 1, 10)
	if err != nil {
		t.Fatalf("ListErrors failed: %v", err)
	}
	if total != 1 {
		t.Fatalf("expected total 1, got %d", total)
	}
	if len(records) != 1 {
		t.Fatalf("expected 1 record, got %d", len(records))
	}
	if records[0].Content != "retained" {
		t.Fatalf("expected retained content, got %q", records[0].Content)
	}
}

func TestCreateReviewSessionPersistsSessionItems(t *testing.T) {
	svc, db, ctx := newTestErrorsService(t)
	now := time.Now()

	dueWord := entity.Word{ID: "word-due", BankID: "bank-1", Content: "review", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	records := []entity.ErrorRecord{
		{ID: "err-1", UserID: "user-1", SessionID: "old-session", ContentType: "word", ContentID: dueWord.ID,
			ErrorCount: 2, AvgTimeMs: 300, LastSeenAt: now, NextReviewAt: now.Add(-time.Hour), ReviewInterval: 1, EasinessFactor: 2.5, CreatedAt: now, UpdatedAt: now},
		{ID: "err-2", UserID: "user-1", SessionID: "old-session", ContentType: "word", ContentID: "word-future",
			ErrorCount: 1, AvgTimeMs: 300, LastSeenAt: now, NextReviewAt: now.Add(48 * time.Hour), ReviewInterval: 1, EasinessFactor: 2.5, CreatedAt: now, UpdatedAt: now},
	}
	if err := db.Create(&dueWord).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}
	if err := db.Create(&records).Error; err != nil {
		t.Fatalf("seed error records failed: %v", err)
	}

	session, items, err := svc.CreateReviewSession(ctx, "user-1", 20)
	if err != nil {
		t.Fatalf("CreateReviewSession failed: %v", err)
	}
	if session == nil {
		t.Fatal("expected a review session for due items")
	}
	if len(items) != 1 {
		t.Fatalf("expected 1 due review item, got %d", len(items))
	}

	var persisted []entity.PracticeSessionItem
	if err := db.Where("session_id = ?", session.ID).Order("item_order ASC").Find(&persisted).Error; err != nil {
		t.Fatalf("load session items failed: %v", err)
	}
	if len(persisted) != 1 {
		t.Fatalf("expected 1 persisted session item, got %d", len(persisted))
	}
	if persisted[0].ContentType != "word" || persisted[0].ContentID != dueWord.ID {
		t.Fatalf("unexpected persisted item %+v", persisted[0])
	}

	// Simulate the SM-2 reschedule after practicing, then a second call with
	// nothing due must not create a session.
	if err := db.Model(&entity.ErrorRecord{}).Where("id = ?", "err-1").Update("next_review_at", now.Add(72*time.Hour)).Error; err != nil {
		t.Fatalf("reschedule error record failed: %v", err)
	}
	session2, _, err := svc.CreateReviewSession(ctx, "user-1", 20)
	if err != nil {
		t.Fatalf("second CreateReviewSession failed: %v", err)
	}
	if session2 != nil {
		t.Fatal("expected nil session when no items are due")
	}
}
