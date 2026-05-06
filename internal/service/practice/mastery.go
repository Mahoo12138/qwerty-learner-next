package practice

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"taptype/internal/model/entity"
)

type wordMasterySummary struct {
	Lang       string
	WordNorm   string
	SeenCount  int
	ErrorCount int
}

func (s *serviceImpl) syncWordMastery(ctx context.Context, tx *gorm.DB, session entity.PracticeSession, req CompleteRequest, now time.Time) error {
	if session.SourceType != "word_bank" {
		return nil
	}

	language := "en"
	var bank entity.WordBank
	err := tx.WithContext(ctx).Unscoped().First(&bank, "id = ?", session.SourceID).Error
	if err == nil && bank.Language != "" {
		language = bank.Language
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	var sessionItems []entity.PracticeSessionItem
	if err := tx.WithContext(ctx).
		Where("session_id = ? AND content_type = ?", session.ID, "word").
		Order("item_order ASC").
		Find(&sessionItems).Error; err != nil {
		return err
	}
	if len(sessionItems) == 0 {
		return nil
	}

	wordIDs := make([]string, 0, len(sessionItems))
	for _, item := range sessionItems {
		wordIDs = append(wordIDs, item.ContentID)
	}

	var words []entity.Word
	if err := tx.WithContext(ctx).Unscoped().Where("id IN ?", wordIDs).Find(&words).Error; err != nil {
		return err
	}
	wordByID := make(map[string]entity.Word, len(words))
	for _, word := range words {
		wordByID[word.ID] = word
	}

	errorCounts := make(map[string]int, len(req.ErrorItems))
	for _, item := range req.ErrorItems {
		if item.ContentType == "word" {
			errorCounts[item.ContentID] += item.ErrorCount
		}
	}

	summaries := make(map[string]*wordMasterySummary, len(sessionItems))
	for _, item := range sessionItems {
		word, ok := wordByID[item.ContentID]
		if !ok {
			continue
		}
		wordNorm := normalizeWord(word.Content)
		if wordNorm == "" {
			continue
		}
		key := language + ":" + wordNorm
		summary, ok := summaries[key]
		if !ok {
			summary = &wordMasterySummary{Lang: language, WordNorm: wordNorm}
			summaries[key] = summary
		}
		summary.SeenCount++
		summary.ErrorCount += errorCounts[item.ContentID]
	}

	for _, summary := range summaries {
		if err := upsertWordMastery(ctx, tx, session.UserID, *summary, now); err != nil {
			return err
		}
	}

	return nil
}

func upsertWordMastery(ctx context.Context, tx *gorm.DB, userID string, summary wordMasterySummary, now time.Time) error {
	var mastery entity.UserWordMastery
	err := tx.WithContext(ctx).
		Where("user_id = ? AND lang = ? AND word_norm = ?", userID, summary.Lang, summary.WordNorm).
		First(&mastery).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		level := 0
		if summary.ErrorCount == 0 {
			level = 1
		}
		mastery = entity.UserWordMastery{
			ID:              uuid.New().String(),
			UserID:          userID,
			Lang:            summary.Lang,
			WordNorm:        summary.WordNorm,
			MasteryLevel:    level,
			EaseFactor:      2.5,
			NextReviewAt:    nextWordReviewAt(now, summary.ErrorCount > 0, level),
			LastPracticedAt: &now,
			TimesSeen:       summary.SeenCount,
			CreatedAt:       now,
			UpdatedAt:       now,
		}
		return tx.WithContext(ctx).Create(&mastery).Error
	}
	if err != nil {
		return err
	}

	mastery.TimesSeen += summary.SeenCount
	mastery.LastPracticedAt = &now
	if summary.ErrorCount > 0 {
		if mastery.MasteryLevel > 0 {
			mastery.MasteryLevel--
		}
	} else if mastery.MasteryLevel < 10 {
		mastery.MasteryLevel++
	}
	mastery.NextReviewAt = nextWordReviewAt(now, summary.ErrorCount > 0, mastery.MasteryLevel)
	mastery.UpdatedAt = now

	return tx.WithContext(ctx).Save(&mastery).Error
}

func normalizeWord(content string) string {
	return strings.ToLower(strings.Join(strings.Fields(content), " "))
}

func nextWordReviewAt(now time.Time, hadErrors bool, masteryLevel int) *time.Time {
	reviewAt := now
	if hadErrors {
		reviewAt = reviewAt.Add(12 * time.Hour)
		return &reviewAt
	}

	switch {
	case masteryLevel >= 5:
		reviewAt = reviewAt.Add(14 * 24 * time.Hour)
	case masteryLevel >= 3:
		reviewAt = reviewAt.Add(7 * 24 * time.Hour)
	case masteryLevel >= 2:
		reviewAt = reviewAt.Add(3 * 24 * time.Hour)
	default:
		reviewAt = reviewAt.Add(24 * time.Hour)
	}
	return &reviewAt
}
