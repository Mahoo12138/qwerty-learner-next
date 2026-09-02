package adaptive

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

func newTestAdaptiveService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(
		&entity.WordBank{},
		&entity.Word{},
		&entity.PracticeSession{},
		&entity.PracticeSessionItem{},
		&entity.PracticeResult{},
		&entity.KeystrokeStat{},
		&entity.LibrarySubscription{},
	); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background()
}

func seedSessionWithKeyStats(t *testing.T, db *gorm.DB, userID, sessionID string, stats []entity.KeystrokeStat) {
	t.Helper()
	now := time.Now()
	session := entity.PracticeSession{
		ID: sessionID, UserID: userID, Mode: "word", SourceType: "word_bank",
		SourceID: "bank-x", ItemCount: 1, StartedAt: now, CreatedAt: now,
	}
	if err := db.Create(&session).Error; err != nil {
		t.Fatalf("seed session failed: %v", err)
	}
	for i := range stats {
		stats[i].SessionID = sessionID
		stats[i].CreatedAt = now
		if stats[i].ID == "" {
			stats[i].ID = fmt.Sprintf("ks-%s-%d", sessionID, i)
		}
	}
	if err := db.Create(&stats).Error; err != nil {
		t.Fatalf("seed keystroke stats failed: %v", err)
	}
}

func TestGetProfileRanksWeakKeysByScore(t *testing.T) {
	svc, db, ctx := newTestAdaptiveService(t)

	// "r" is slow and error-prone (with an uppercase variant that must merge),
	// "a" is fast and clean, "q" has too few samples to be judged.
	seedSessionWithKeyStats(t, db, "user-1", "session-1", []entity.KeystrokeStat{
		{ID: "ks-1", KeyChar: "r", HitCount: 100, ErrorCount: 30, AvgIntervalMs: 300},
		{ID: "ks-2", KeyChar: "R", HitCount: 50, ErrorCount: 0, AvgIntervalMs: 120},
		{ID: "ks-3", KeyChar: "a", HitCount: 100, ErrorCount: 1, AvgIntervalMs: 100},
		{ID: "ks-4", KeyChar: "q", HitCount: 3, ErrorCount: 2, AvgIntervalMs: 500},
	})

	profile, err := svc.GetProfile(ctx, "user-1")
	if err != nil {
		t.Fatalf("GetProfile failed: %v", err)
	}

	if !profile.HasData {
		t.Fatal("expected profile to have data")
	}
	if profile.KeysAnalyzed != 3 {
		t.Fatalf("expected 3 merged keys, got %d", profile.KeysAnalyzed)
	}

	// merged "r": hits=150, errors=30, interval=(300*100+120*50)/150=240
	var weak *WeakKey
	for i := range profile.WeakKeys {
		if profile.WeakKeys[i].KeyChar == "r" {
			weak = &profile.WeakKeys[i]
		}
	}
	if weak == nil {
		t.Fatal("expected key r to be weak")
	}
	if weak.TotalHits != 150 || weak.TotalErrors != 30 {
		t.Fatalf("expected merged r stats 150/30, got %d/%d", weak.TotalHits, weak.TotalErrors)
	}
	if weak.AvgIntervalMs < 239 || weak.AvgIntervalMs > 241 {
		t.Fatalf("expected weighted interval ~240, got %f", weak.AvgIntervalMs)
	}
	if weak.WeakScore < 0.8 || weak.WeakScore > 1.0 {
		t.Fatalf("expected r weak score in (0.8,1.0], got %f", weak.WeakScore)
	}

	for _, wk := range profile.WeakKeys {
		if wk.KeyChar == "a" {
			t.Fatal("expected key a not to be weak")
		}
		if wk.KeyChar == "q" {
			t.Fatal("expected key q filtered by min hits")
		}
	}
	if profile.WeakKeys[0].KeyChar != "r" {
		t.Fatalf("expected r ranked first, got %q", profile.WeakKeys[0].KeyChar)
	}
}

func TestGetProfileEmptyWithoutData(t *testing.T) {
	svc, _, ctx := newTestAdaptiveService(t)

	profile, err := svc.GetProfile(ctx, "user-1")
	if err != nil {
		t.Fatalf("GetProfile failed: %v", err)
	}
	if profile.HasData {
		t.Fatal("expected empty profile without data")
	}
	if len(profile.WeakKeys) != 0 {
		t.Fatalf("expected no weak keys, got %d", len(profile.WeakKeys))
	}
}

func seedUserBank(t *testing.T, db *gorm.DB, bankID, ownerID string, isPublic int, words []string) {
	t.Helper()
	now := time.Now()
	bank := entity.WordBank{ID: bankID, OwnerID: ownerID, Name: bankID, Language: "en", IsPublic: isPublic, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed bank failed: %v", err)
	}
	for i, content := range words {
		word := entity.Word{ID: fmt.Sprintf("%s-w%d", bankID, i), BankID: bankID, Content: content, Difficulty: 1, CreatedAt: now, UpdatedAt: now}
		if err := db.Create(&word).Error; err != nil {
			t.Fatalf("seed word failed: %v", err)
		}
	}
}

func containsWeakKey(word string, keys []string) bool {
	lower := strings.ToLower(word)
	for _, k := range keys {
		if strings.Contains(lower, k) {
			return true
		}
	}
	return false
}

func TestCreateAdaptiveSessionTargetsWeakKeyWords(t *testing.T) {
	svc, db, ctx := newTestAdaptiveService(t)

	seedUserBank(t, db, "bank-1", "user-1", 0, []string{
		"river", "target", "tortoise", "trail", "repair", // contain r/t
		"moon", "sun", "echo", // no r/t
	})
	seedSessionWithKeyStats(t, db, "user-1", "session-1", []entity.KeystrokeStat{
		{KeyChar: "r", HitCount: 100, ErrorCount: 30, AvgIntervalMs: 300},
		{KeyChar: "t", HitCount: 100, ErrorCount: 25, AvgIntervalMs: 280},
		{KeyChar: "a", HitCount: 100, ErrorCount: 1, AvgIntervalMs: 100},
	})

	result, err := svc.CreateAdaptiveSession(ctx, CreateAdaptiveRequest{UserID: "user-1", ItemCount: 4})
	if err != nil {
		t.Fatalf("CreateAdaptiveSession failed: %v", err)
	}

	if result.Session.SourceType != "adaptive" {
		t.Fatalf("expected source_type adaptive, got %q", result.Session.SourceType)
	}
	if result.Session.Mode != "word" {
		t.Fatalf("expected mode word, got %q", result.Session.Mode)
	}
	if len(result.Words) != 4 {
		t.Fatalf("expected 4 words, got %d", len(result.Words))
	}
	if len(result.TargetedKeys) == 0 {
		t.Fatal("expected targeted keys to be reported")
	}

	targeted := 0
	for _, word := range result.Words {
		if containsWeakKey(word.Content, result.TargetedKeys) {
			targeted++
		}
	}
	if targeted < 3 {
		t.Fatalf("expected at least 3 of 4 words to contain weak keys, got %d (%v)", targeted, result.Words)
	}

	// Session items must be persisted so the session can be resumed.
	var itemCount int64
	if err := db.Model(&entity.PracticeSessionItem{}).Where("session_id = ?", result.Session.ID).Count(&itemCount).Error; err != nil {
		t.Fatalf("count session items failed: %v", err)
	}
	if itemCount != 4 {
		t.Fatalf("expected 4 persisted session items, got %d", itemCount)
	}
}

func TestCreateAdaptiveSessionFallsBackWithoutData(t *testing.T) {
	svc, db, ctx := newTestAdaptiveService(t)

	seedUserBank(t, db, "bank-1", "user-1", 0, []string{"moon", "sun", "echo", "ember", "halo"})

	result, err := svc.CreateAdaptiveSession(ctx, CreateAdaptiveRequest{UserID: "user-1", ItemCount: 3})
	if err != nil {
		t.Fatalf("CreateAdaptiveSession failed: %v", err)
	}
	if len(result.Words) != 3 {
		t.Fatalf("expected 3 random words, got %d", len(result.Words))
	}
	if len(result.TargetedKeys) != 0 {
		t.Fatalf("expected no targeted keys without data, got %v", result.TargetedKeys)
	}
}

func TestCreateAdaptiveSessionExcludesOtherUsersPrivateBanks(t *testing.T) {
	svc, db, ctx := newTestAdaptiveService(t)

	seedUserBank(t, db, "bank-private", "user-2", 0, []string{"secret", "private", "vault"})
	seedUserBank(t, db, "bank-public", "user-2", 1, []string{"public", "open", "shared"})

	// Subscribed bank of another user (private) becomes accessible.
	sub := entity.LibrarySubscription{ID: "sub-1", UserID: "user-1", LibraryType: "word_bank", LibraryID: "bank-sub", CreatedAt: time.Now()}
	if err := db.Create(&sub).Error; err != nil {
		t.Fatalf("seed subscription failed: %v", err)
	}
	seedUserBank(t, db, "bank-sub", "user-2", 0, []string{"subbed", "channel", "feed"})

	result, err := svc.CreateAdaptiveSession(ctx, CreateAdaptiveRequest{UserID: "user-1", ItemCount: 9})
	if err != nil {
		t.Fatalf("CreateAdaptiveSession failed: %v", err)
	}

	for _, word := range result.Words {
		content := strings.ToLower(word.Content)
		if content == "secret" || content == "private" || content == "vault" {
			t.Fatalf("private bank word %q must not be included", content)
		}
	}
	if len(result.Words) != 6 {
		t.Fatalf("expected 6 words from public + subscribed banks, got %d", len(result.Words))
	}
}

func TestCreateAdaptiveSessionFillsShortfallWithRandomWords(t *testing.T) {
	svc, db, ctx := newTestAdaptiveService(t)

	// Only one word contains the weak key; the rest must be filled randomly.
	seedUserBank(t, db, "bank-1", "user-1", 0, []string{"river", "moon", "sun", "echo", "halo"})
	seedSessionWithKeyStats(t, db, "user-1", "session-1", []entity.KeystrokeStat{
		{KeyChar: "r", HitCount: 100, ErrorCount: 40, AvgIntervalMs: 300},
		{KeyChar: "a", HitCount: 100, ErrorCount: 1, AvgIntervalMs: 100},
	})

	result, err := svc.CreateAdaptiveSession(ctx, CreateAdaptiveRequest{UserID: "user-1", ItemCount: 5})
	if err != nil {
		t.Fatalf("CreateAdaptiveSession failed: %v", err)
	}
	if len(result.Words) != 5 {
		t.Fatalf("expected full 5-word session, got %d", len(result.Words))
	}
	if result.Words[0].Content != "river" {
		t.Fatalf("expected the weak-key word ranked first, got %q", result.Words[0].Content)
	}
}
