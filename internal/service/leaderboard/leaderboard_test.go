package leaderboard

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

func TestListMetrics(t *testing.T) {
	t.Parallel()

	db := setupLeaderboardTestDB(t)
	svc := NewService(db)
	metrics := svc.ListMetrics()
	if len(metrics) != 9 {
		t.Fatalf("expected 9 metrics, got %d", len(metrics))
	}
	if !metrics[0].SupportsPeriod {
		t.Fatalf("expected best_wpm to support period")
	}
	if metrics[4].SupportsPeriod {
		t.Fatalf("expected current_streak to ignore period")
	}
}

func TestGetBoard(t *testing.T) {
	db := setupLeaderboardTestDB(t)
	seedLeaderboardTestData(t, db)
	svc := NewService(db)
	ctx := context.Background()

	tests := []struct {
		name         string
		userID       string
		metric       string
		period       string
		wantUsers    []string
		wantTotal    int
		wantMyRank   int
		wantFallback bool
	}{
		{
			name:         "best_wpm_all_time_excludes_hidden_users",
			userID:       "user-1",
			metric:       "best_wpm",
			period:       "all",
			wantUsers:    []string{"user-3", "user-1"},
			wantTotal:    2,
			wantMyRank:   2,
			wantFallback: true,
		},
		{
			name:       "best_wpm_day_uses_recent_window",
			userID:     "user-1",
			metric:     "best_wpm",
			period:     "day",
			wantUsers:  []string{"user-1", "user-3"},
			wantTotal:  2,
			wantMyRank: 1,
		},
		{
			name:       "mastered_words_uses_mastered_threshold",
			userID:     "user-1",
			metric:     "mastered_words",
			period:     "month",
			wantUsers:  []string{"user-3", "user-1"},
			wantTotal:  2,
			wantMyRank: 2,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			board, err := svc.GetBoard(ctx, tt.userID, tt.metric, tt.period, 10)
			if err != nil {
				t.Fatalf("GetBoard failed: %v", err)
			}
			if board.Total != tt.wantTotal {
				t.Fatalf("expected total %d, got %d", tt.wantTotal, board.Total)
			}
			if len(board.List) != len(tt.wantUsers) {
				t.Fatalf("expected %d rows, got %d", len(tt.wantUsers), len(board.List))
			}
			for index, wantUserID := range tt.wantUsers {
				if board.List[index].UserID != wantUserID {
					t.Fatalf("row %d expected user %s, got %s", index, wantUserID, board.List[index].UserID)
				}
			}
			if board.MyRank == nil || board.MyRank.Rank != tt.wantMyRank {
				t.Fatalf("expected my rank %d, got %#v", tt.wantMyRank, board.MyRank)
			}
			if tt.wantFallback && !strings.HasPrefix(board.List[0].Nickname, "User-") {
				t.Fatalf("expected fallback nickname, got %q", board.List[0].Nickname)
			}
		})
	}
}

func TestGetMyRank_HiddenUserReturnsNilRank(t *testing.T) {
	db := setupLeaderboardTestDB(t)
	seedLeaderboardTestData(t, db)
	svc := NewService(db)

	rank, err := svc.GetMyRank(context.Background(), "user-2", "best_wpm", "all")
	if err != nil {
		t.Fatalf("GetMyRank failed: %v", err)
	}
	if rank.Total != 2 {
		t.Fatalf("expected total 2, got %d", rank.Total)
	}
	if rank.Rank != nil {
		t.Fatalf("expected nil rank for opted-out user, got %d", *rank.Rank)
	}
	if rank.Entry != nil {
		t.Fatalf("expected nil entry for opted-out user, got %#v", rank.Entry)
	}
}

func setupLeaderboardTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	dsn := fmt.Sprintf("file:leaderboard_%d?mode=memory&cache=shared", time.Now().UnixNano())
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open sqlite db: %v", err)
	}

	if err := db.AutoMigrate(
		&entity.User{},
		&entity.UserSetting{},
		&entity.PracticeSession{},
		&entity.PracticeResult{},
		&entity.UserWordMastery{},
	); err != nil {
		t.Fatalf("migrate test schema: %v", err)
	}

	return db
}

func seedLeaderboardTestData(t *testing.T, db *gorm.DB) {
	t.Helper()

	// Anchor on the real clock: period windows ("day"/"week"/"month") are
	// rolling windows computed against time.Now(), so seeded sessions must stay
	// relative to the current time instead of a fixed date.
	now := time.Now().UTC()
	avatarID := "avatar-1"
	users := []entity.User{
		{ID: "user-1", Username: "ace", Nickname: "Ace", Email: "ace@example.com", PasswordHash: "x", AvatarMediaID: &avatarID, Role: "user", IsActive: 1, CreatedAt: now, UpdatedAt: now},
		{ID: "user-2", Username: "hidden", Nickname: "Hidden", Email: "hidden@example.com", PasswordHash: "x", Role: "user", IsActive: 1, CreatedAt: now, UpdatedAt: now},
		{ID: "user-3", Username: "blank", Nickname: "", Email: "blank@example.com", PasswordHash: "x", Role: "user", IsActive: 1, CreatedAt: now, UpdatedAt: now},
	}
	if err := db.Create(&users).Error; err != nil {
		t.Fatalf("create users: %v", err)
	}

	hiddenSetting := entity.UserSetting{
		ID:            "setting-1",
		UserID:        "user-2",
		DefinitionKey: leaderboardVisibilityKey,
		Value:         "false",
		UpdatedAt:     now,
	}
	if err := db.Create(&hiddenSetting).Error; err != nil {
		t.Fatalf("create hidden setting: %v", err)
	}

	endedRecent1 := now.Add(-1 * time.Hour)
	endedRecent3 := now.Add(-2 * time.Hour)
	endedOld3 := now.AddDate(0, 0, -10)
	endedHidden := now.Add(-30 * time.Minute)
	duration := int64(120000)
	sessions := []entity.PracticeSession{
		{ID: "session-1", UserID: "user-1", Mode: "word", SourceType: "word_bank", StartedAt: endedRecent1.Add(-2 * time.Minute), EndedAt: &endedRecent1, DurationMs: &duration, CreatedAt: endedRecent1.Add(-2 * time.Minute)},
		{ID: "session-2", UserID: "user-2", Mode: "word", SourceType: "word_bank", StartedAt: endedHidden.Add(-2 * time.Minute), EndedAt: &endedHidden, DurationMs: &duration, CreatedAt: endedHidden.Add(-2 * time.Minute)},
		{ID: "session-3", UserID: "user-3", Mode: "word", SourceType: "word_bank", StartedAt: endedRecent3.Add(-2 * time.Minute), EndedAt: &endedRecent3, DurationMs: &duration, CreatedAt: endedRecent3.Add(-2 * time.Minute)},
		{ID: "session-4", UserID: "user-3", Mode: "word", SourceType: "word_bank", StartedAt: endedOld3.Add(-2 * time.Minute), EndedAt: &endedOld3, DurationMs: &duration, CreatedAt: endedOld3.Add(-2 * time.Minute)},
	}
	if err := db.Create(&sessions).Error; err != nil {
		t.Fatalf("create sessions: %v", err)
	}

	results := []entity.PracticeResult{
		{ID: "result-1", SessionID: "session-1", Wpm: 90, RawWpm: 92, Accuracy: 0.98, CharCount: 300, Consistency: 0.9, CreatedAt: endedRecent1},
		{ID: "result-2", SessionID: "session-2", Wpm: 300, RawWpm: 302, Accuracy: 0.99, CharCount: 420, Consistency: 0.95, CreatedAt: endedHidden},
		{ID: "result-3", SessionID: "session-3", Wpm: 80, RawWpm: 82, Accuracy: 0.97, CharCount: 280, Consistency: 0.88, CreatedAt: endedRecent3},
		{ID: "result-4", SessionID: "session-4", Wpm: 200, RawWpm: 204, Accuracy: 0.96, CharCount: 360, Consistency: 0.86, CreatedAt: endedOld3},
	}
	if err := db.Create(&results).Error; err != nil {
		t.Fatalf("create results: %v", err)
	}

	masteries := []entity.UserWordMastery{
		{ID: "mastery-1", UserID: "user-1", Lang: "en", WordNorm: "focus", MasteryLevel: 5, TimesSeen: 6, CreatedAt: now, UpdatedAt: now},
		{ID: "mastery-2", UserID: "user-1", Lang: "en", WordNorm: "steady", MasteryLevel: 4, TimesSeen: 4, CreatedAt: now, UpdatedAt: now},
		{ID: "mastery-3", UserID: "user-2", Lang: "en", WordNorm: "hidden", MasteryLevel: 10, TimesSeen: 10, CreatedAt: now, UpdatedAt: now},
		{ID: "mastery-4", UserID: "user-3", Lang: "en", WordNorm: "tempo", MasteryLevel: 5, TimesSeen: 7, CreatedAt: now, UpdatedAt: now},
		{ID: "mastery-5", UserID: "user-3", Lang: "en", WordNorm: "cadence", MasteryLevel: 6, TimesSeen: 8, CreatedAt: now, UpdatedAt: now},
	}
	if err := db.Create(&masteries).Error; err != nil {
		t.Fatalf("create masteries: %v", err)
	}
}
