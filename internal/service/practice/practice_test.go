package practice

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
	achievementService "taptype/internal/service/achievement"
	errorsService "taptype/internal/service/errors"
)

type stubErrorsService struct{}

func (stubErrorsService) ListErrors(context.Context, string, string, int, int) ([]entity.ErrorRecord, int64, error) {
	return nil, 0, nil
}

func (stubErrorsService) GetReviewQueue(context.Context, string, int) ([]entity.ErrorRecord, error) {
	return nil, nil
}

func (stubErrorsService) CreateReviewSession(context.Context, string, int) (*entity.PracticeSession, []errorsService.ReviewItem, error) {
	return nil, nil, nil
}

func (stubErrorsService) UpsertErrorRecord(context.Context, string, string, string, string, int, int64) error {
	return nil
}

type stubDailyService struct{}

func (stubDailyService) GetToday(context.Context, string) (*entity.DailyRecord, error) {
	return nil, nil
}

func (stubDailyService) UpdateAfterPractice(context.Context, string, int64, float64, float64) error {
	return nil
}

type stubAchievementService struct{}

func (stubAchievementService) ListAll(context.Context, string) ([]achievementService.UnlockedAchievement, error) {
	return nil, nil
}

func (stubAchievementService) DetectAndUnlock(context.Context, string) ([]entity.Achievement, error) {
	return nil, nil
}

type stubGoalService struct{}

func (stubGoalService) ListGoals(context.Context, string) ([]entity.UserGoal, error) {
	return nil, nil
}

func (stubGoalService) CreateGoal(context.Context, string, string, float64, string) (*entity.UserGoal, error) {
	return nil, nil
}

func (stubGoalService) UpdateGoal(context.Context, string, string, *float64, *int) (*entity.UserGoal, error) {
	return nil, nil
}

func (stubGoalService) DeleteGoal(context.Context, string, string) error {
	return nil
}

func (stubGoalService) RefreshDailyProgress(context.Context, string) error {
	return nil
}

func newTestPracticeService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(
		&entity.WordBank{},
		&entity.Word{},
		&entity.SentenceBank{},
		&entity.Sentence{},
		&entity.PracticeSession{},
		&entity.PracticeSessionItem{},
		&entity.PracticeResult{},
		&entity.KeystrokeStat{},
		&entity.UserWordMastery{},
	); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	if err = db.Exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_user_word_mastery_unique ON user_word_mastery(user_id, lang, word_norm)").Error; err != nil {
		t.Fatalf("create mastery unique index failed: %v", err)
	}

	svc := &serviceImpl{
		db:             db,
		errorsSvc:      stubErrorsService{},
		dailySvc:       stubDailyService{},
		achievementSvc: stubAchievementService{},
		goalSvc:        stubGoalService{},
	}

	return svc, db, context.Background()
}

func TestCreateSessionRejectsPrivateWordBankAccess(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	bank := entity.WordBank{ID: "bank-1", OwnerID: "owner-1", Name: "Private", Language: "en", IsPublic: 0, CreatedAt: now, UpdatedAt: now}
	word := entity.Word{ID: "word-1", BankID: bank.ID, Content: "hello", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed bank failed: %v", err)
	}
	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}

	_, err := svc.CreateSession(ctx, CreateSessionRequest{UserID: "user-2", Mode: "word", SourceType: "word_bank", SourceID: bank.ID, ItemCount: 1})
	if err == nil {
		t.Fatal("expected forbidden error")
	}
	if gerror.Code(err).Code() != 40301 {
		t.Fatalf("expected 40301, got %d", gerror.Code(err).Code())
	}
}

func TestCompletePracticeMergesMasteryByNormalizedWord(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	bank := entity.WordBank{ID: "bank-1", OwnerID: "user-1", Name: "Words", Language: "en", IsPublic: 0, CreatedAt: now, UpdatedAt: now}
	wordA := entity.Word{ID: "word-a", BankID: bank.ID, Content: " Hello ", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	wordB := entity.Word{ID: "word-b", BankID: bank.ID, Content: "hello", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	session := entity.PracticeSession{ID: "session-1", UserID: "user-1", Mode: "word", SourceType: "word_bank", SourceID: bank.ID, ItemCount: 2, StartedAt: now, CreatedAt: now}
	items := []entity.PracticeSessionItem{
		{ID: "item-1", SessionID: session.ID, ItemOrder: 0, ContentType: "word", ContentID: wordA.ID, CreatedAt: now},
		{ID: "item-2", SessionID: session.ID, ItemOrder: 1, ContentType: "word", ContentID: wordB.ID, CreatedAt: now},
	}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed bank failed: %v", err)
	}
	if err := db.Create(&wordA).Error; err != nil {
		t.Fatalf("seed wordA failed: %v", err)
	}
	if err := db.Create(&wordB).Error; err != nil {
		t.Fatalf("seed wordB failed: %v", err)
	}
	if err := db.Create(&session).Error; err != nil {
		t.Fatalf("seed session failed: %v", err)
	}
	if err := db.Create(&items).Error; err != nil {
		t.Fatalf("seed session items failed: %v", err)
	}
	if err := db.Delete(&wordA).Error; err != nil {
		t.Fatalf("soft delete wordA failed: %v", err)
	}

	_, err := svc.CompletePractice(ctx, CompleteRequest{SessionID: session.ID, UserID: "user-1", WPM: 80, RawWPM: 82, Accuracy: 0.99, CharCount: 10, DurationMs: 1000})
	if err != nil {
		t.Fatalf("CompletePractice failed: %v", err)
	}

	var masteries []entity.UserWordMastery
	if err := db.Find(&masteries).Error; err != nil {
		t.Fatalf("load mastery failed: %v", err)
	}
	if len(masteries) != 1 {
		t.Fatalf("expected 1 mastery row, got %d", len(masteries))
	}
	if masteries[0].Lang != "en" {
		t.Fatalf("expected lang en, got %q", masteries[0].Lang)
	}
	if masteries[0].WordNorm != "hello" {
		t.Fatalf("expected normalized word hello, got %q", masteries[0].WordNorm)
	}
	if masteries[0].TimesSeen != 2 {
		t.Fatalf("expected times_seen 2, got %d", masteries[0].TimesSeen)
	}
}

func TestListWordMasteriesReturnsSummaryAndFilteredRows(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	seed := []entity.UserWordMastery{
		{ID: "m-1", UserID: "user-1", Lang: "en", WordNorm: "alpha", MasteryLevel: 2, TimesSeen: 2, CreatedAt: now, UpdatedAt: now},
		{ID: "m-2", UserID: "user-1", Lang: "en", WordNorm: "bravo", MasteryLevel: 3, TimesSeen: 4, CreatedAt: now, UpdatedAt: now},
		{ID: "m-3", UserID: "user-1", Lang: "en", WordNorm: "charlie", MasteryLevel: 5, TimesSeen: 6, CreatedAt: now, UpdatedAt: now},
		{ID: "m-4", UserID: "user-2", Lang: "en", WordNorm: "delta", MasteryLevel: 5, TimesSeen: 8, CreatedAt: now, UpdatedAt: now},
	}
	if err := db.Create(&seed).Error; err != nil {
		t.Fatalf("seed masteries failed: %v", err)
	}

	result, err := svc.ListWordMasteries(ctx, "user-1", WordMasteryListRequest{Status: "pre_mastered", Page: 1, PageSize: 10})
	if err != nil {
		t.Fatalf("ListWordMasteries failed: %v", err)
	}

	if result.Summary.TrackedCount != 3 {
		t.Fatalf("expected tracked_count 3, got %d", result.Summary.TrackedCount)
	}
	if result.Summary.PreMasteredCount != 1 {
		t.Fatalf("expected pre_mastered_count 1, got %d", result.Summary.PreMasteredCount)
	}
	if result.Summary.MasteredCount != 1 {
		t.Fatalf("expected mastered_count 1, got %d", result.Summary.MasteredCount)
	}
	if result.Total != 1 {
		t.Fatalf("expected total 1, got %d", result.Total)
	}
	if len(result.List) != 1 {
		t.Fatalf("expected 1 filtered item, got %d", len(result.List))
	}
	if result.List[0].WordNorm != "bravo" {
		t.Fatalf("expected filtered word bravo, got %q", result.List[0].WordNorm)
	}
	if result.List[0].Status != wordMasteryStatusPreMastered {
		t.Fatalf("expected pre_mastered status, got %q", result.List[0].Status)
	}
}

func TestUpdateWordMasteryStatePromotesToMastered(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	mastery := entity.UserWordMastery{ID: "m-1", UserID: "user-1", Lang: "en", WordNorm: "focus", MasteryLevel: 3, TimesSeen: 4, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&mastery).Error; err != nil {
		t.Fatalf("seed mastery failed: %v", err)
	}

	item, err := svc.UpdateWordMasteryState(ctx, "user-1", mastery.ID, "mastered")
	if err != nil {
		t.Fatalf("UpdateWordMasteryState failed: %v", err)
	}
	if item.Status != wordMasteryStatusMastered {
		t.Fatalf("expected mastered status, got %q", item.Status)
	}
	if item.MasteryLevel != masteredThreshold {
		t.Fatalf("expected mastery level %d, got %d", masteredThreshold, item.MasteryLevel)
	}

	var saved entity.UserWordMastery
	if err := db.First(&saved, "id = ?", mastery.ID).Error; err != nil {
		t.Fatalf("reload mastery failed: %v", err)
	}
	if saved.MasteryLevel != masteredThreshold {
		t.Fatalf("expected saved mastery level %d, got %d", masteredThreshold, saved.MasteryLevel)
	}
}

func TestMarkWordMasteredCreatesRowForAccessibleWord(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	bank := entity.WordBank{ID: "bank-1", OwnerID: "user-1", Name: "Words", Language: "en", IsPublic: 0, CreatedAt: now, UpdatedAt: now}
	word := entity.Word{ID: "word-1", BankID: bank.ID, Content: "  Memory  ", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed bank failed: %v", err)
	}
	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}

	item, err := svc.MarkWordMastered(ctx, "user-1", word.ID)
	if err != nil {
		t.Fatalf("MarkWordMastered failed: %v", err)
	}
	if item.WordNorm != "memory" {
		t.Fatalf("expected normalized word memory, got %q", item.WordNorm)
	}
	if item.Status != wordMasteryStatusMastered {
		t.Fatalf("expected mastered status, got %q", item.Status)
	}
	if item.MasteryLevel != masteredThreshold {
		t.Fatalf("expected mastery level %d, got %d", masteredThreshold, item.MasteryLevel)
	}

	var saved []entity.UserWordMastery
	if err := db.Find(&saved, "user_id = ?", "user-1").Error; err != nil {
		t.Fatalf("load saved masteries failed: %v", err)
	}
	if len(saved) != 1 {
		t.Fatalf("expected 1 mastery row, got %d", len(saved))
	}
	if saved[0].TimesSeen != 1 {
		t.Fatalf("expected times_seen 1, got %d", saved[0].TimesSeen)
	}
}

func TestGetSessionIncludesSoftDeletedWordContent(t *testing.T) {
	svc, db, ctx := newTestPracticeService(t)
	now := time.Now()

	bank := entity.WordBank{ID: "bank-1", OwnerID: "user-1", Name: "Words", Language: "en", IsPublic: 0, CreatedAt: now, UpdatedAt: now}
	word := entity.Word{ID: "word-1", BankID: bank.ID, Content: "archive", Difficulty: 1, CreatedAt: now, UpdatedAt: now}
	session := entity.PracticeSession{ID: "session-1", UserID: "user-1", Mode: "word", SourceType: "word_bank", SourceID: bank.ID, ItemCount: 1, StartedAt: now, CreatedAt: now}
	item := entity.PracticeSessionItem{ID: "item-1", SessionID: session.ID, ItemOrder: 0, ContentType: "word", ContentID: word.ID, CreatedAt: now}

	if err := db.Create(&bank).Error; err != nil {
		t.Fatalf("seed bank failed: %v", err)
	}
	if err := db.Create(&word).Error; err != nil {
		t.Fatalf("seed word failed: %v", err)
	}
	if err := db.Create(&session).Error; err != nil {
		t.Fatalf("seed session failed: %v", err)
	}
	if err := db.Create(&item).Error; err != nil {
		t.Fatalf("seed item failed: %v", err)
	}
	if err := db.Delete(&word).Error; err != nil {
		t.Fatalf("soft delete word failed: %v", err)
	}

	detail, err := svc.GetSession(ctx, "user-1", session.ID)
	if err != nil {
		t.Fatalf("GetSession failed: %v", err)
	}
	if len(detail.Words) != 1 {
		t.Fatalf("expected 1 word in session detail, got %d", len(detail.Words))
	}
	if detail.Words[0].Content != "archive" {
		t.Fatalf("expected archived word content, got %q", detail.Words[0].Content)
	}
}
