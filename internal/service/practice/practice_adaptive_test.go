package practice

import (
	"testing"
	"time"

	"taptype/internal/model/entity"
)

func TestGetSessionLoadsAdaptiveSessionContent(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	word := entity.Word{ID: "word-1", BankID: "bank-1", Content: "river", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}
	session := entity.PracticeSession{ID: "session-1", UserID: "user-1", Mode: "word", SourceType: "adaptive", ItemCount: 1, StartedAt: now, CreatedAt: now}
	item := entity.PracticeSessionItem{ID: "item-1", SessionID: session.ID, ItemOrder: 0, ContentType: "word", ContentID: word.ID, CreatedAt: now}
	if err := db.Create(&session).Error; err != nil {
		t.Fatalf("seed session failed: %v", err)
	}
	if err := db.Create(&item).Error; err != nil {
		t.Fatalf("seed session item failed: %v", err)
	}

	detail, err := svc.GetSession(ctx, "user-1", session.ID)
	if err != nil {
		t.Fatalf("GetSession failed: %v", err)
	}
	if len(detail.Words) != 1 {
		t.Fatalf("expected 1 word in adaptive session detail, got %d", len(detail.Words))
	}
	if detail.Words[0].Content != "river" {
		t.Fatalf("expected river, got %q", detail.Words[0].Content)
	}
}

func TestGetSessionLoadsReviewSessionMixedContent(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	word := entity.Word{ID: "word-1", BankID: "bank-1", Content: "river", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	bank := entity.SentenceBank{ID: "sbank-1", OwnerID: "user-1", Name: "Sentences", IsPublic: 0, CreatedAt: now, UpdatedAt: now}
	sentence := entity.Sentence{ID: "sent-1", BankID: bank.ID, Content: "if err != nil", WordCount: 3, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed sentence bank failed: %v", err)
	}
	if err := db.Create(&sentence).Error; err != nil {
		t.Fatalf("seed sentence failed: %v", err)
	}

	session := entity.PracticeSession{ID: "session-r", UserID: "user-1", Mode: "review", SourceType: "error_list", ItemCount: 2, StartedAt: now, CreatedAt: now}
	items := []entity.PracticeSessionItem{
		{ID: "item-1", SessionID: session.ID, ItemOrder: 0, ContentType: "word", ContentID: word.ID, CreatedAt: now},
		{ID: "item-2", SessionID: session.ID, ItemOrder: 1, ContentType: "sentence", ContentID: sentence.ID, CreatedAt: now},
	}
	if err := db.Create(&session).Error; err != nil {
		t.Fatalf("seed session failed: %v", err)
	}
	if err := db.Create(&items).Error; err != nil {
		t.Fatalf("seed session items failed: %v", err)
	}

	detail, err := svc.GetSession(ctx, "user-1", session.ID)
	if err != nil {
		t.Fatalf("GetSession failed: %v", err)
	}
	if len(detail.Words) != 1 || detail.Words[0].Content != "river" {
		t.Fatalf("expected word river in detail, got %+v", detail.Words)
	}
	if len(detail.Sentences) != 1 || detail.Sentences[0].Content != "if err != nil" {
		t.Fatalf("expected review sentence in detail, got %+v", detail.Sentences)
	}
}
