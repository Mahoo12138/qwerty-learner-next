package daily

import (
	"context"
	"fmt"
	"math"
	"strings"
	"testing"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"

	"taptype/internal/model/entity"
)

func newTestDailyService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context, string) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(&entity.DailyRecord{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background(), "user-daily-1"
}

func TestGetToday_ReturnsPlaceholderWhenMissing(t *testing.T) {
	svc, _, ctx, userID := newTestDailyService(t)

	record, err := svc.GetToday(ctx, userID)
	if err != nil {
		t.Fatalf("GetToday failed: %v", err)
	}
	if record.UserID != userID {
		t.Fatalf("expected user_id %q, got %q", userID, record.UserID)
	}
	if record.StreakDay != 0 {
		t.Fatalf("expected placeholder streak 0, got %d", record.StreakDay)
	}
	if record.RecordDate != time.Now().Format("2006-01-02") {
		t.Fatalf("expected today's date, got %q", record.RecordDate)
	}
}

func TestUpdateAfterPractice_CreatesNewRecordWithStreak(t *testing.T) {
	svc, db, ctx, userID := newTestDailyService(t)
	now := time.Now()
	yesterday := now.AddDate(0, 0, -1).Format("2006-01-02")

	seed := entity.DailyRecord{
		ID:              "yesterday-record",
		UserID:          userID,
		RecordDate:      yesterday,
		PracticeCount:   2,
		TotalDurationMs: 60000,
		AvgWpm:          50,
		AvgAccuracy:     0.9,
		StreakDay:       7,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if err := db.Create(&seed).Error; err != nil {
		t.Fatalf("seed yesterday record failed: %v", err)
	}

	if err := svc.UpdateAfterPractice(ctx, userID, 120000, 80, 0.95); err != nil {
		t.Fatalf("UpdateAfterPractice failed: %v", err)
	}

	var today entity.DailyRecord
	if err := db.First(&today, "user_id = ? AND record_date = ?", userID, now.Format("2006-01-02")).Error; err != nil {
		t.Fatalf("load today record failed: %v", err)
	}
	if today.PracticeCount != 1 {
		t.Fatalf("expected practice_count 1, got %d", today.PracticeCount)
	}
	if today.StreakDay != 8 {
		t.Fatalf("expected streak 8, got %d", today.StreakDay)
	}
	if today.TotalDurationMs != 120000 {
		t.Fatalf("expected total_duration_ms 120000, got %d", today.TotalDurationMs)
	}
}

func TestUpdateAfterPractice_UpdatesRunningAverage(t *testing.T) {
	svc, db, ctx, userID := newTestDailyService(t)
	now := time.Now()
	today := now.Format("2006-01-02")

	seed := entity.DailyRecord{
		ID:              "today-record",
		UserID:          userID,
		RecordDate:      today,
		PracticeCount:   1,
		TotalDurationMs: 60000,
		AvgWpm:          60,
		AvgAccuracy:     0.9,
		StreakDay:       3,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if err := db.Create(&seed).Error; err != nil {
		t.Fatalf("seed today record failed: %v", err)
	}

	if err := svc.UpdateAfterPractice(ctx, userID, 30000, 90, 1.0); err != nil {
		t.Fatalf("UpdateAfterPractice failed: %v", err)
	}

	var updated entity.DailyRecord
	if err := db.First(&updated, "id = ?", seed.ID).Error; err != nil {
		t.Fatalf("load updated record failed: %v", err)
	}
	if updated.PracticeCount != 2 {
		t.Fatalf("expected practice_count 2, got %d", updated.PracticeCount)
	}
	if updated.TotalDurationMs != 90000 {
		t.Fatalf("expected total_duration_ms 90000, got %d", updated.TotalDurationMs)
	}
	if math.Abs(updated.AvgWpm-75) > 0.0001 {
		t.Fatalf("expected avg_wpm 75, got %v", updated.AvgWpm)
	}
	if math.Abs(updated.AvgAccuracy-0.95) > 0.0001 {
		t.Fatalf("expected avg_accuracy 0.95, got %v", updated.AvgAccuracy)
	}
	if updated.StreakDay != 3 {
		t.Fatalf("expected streak to stay 3, got %d", updated.StreakDay)
	}
}
