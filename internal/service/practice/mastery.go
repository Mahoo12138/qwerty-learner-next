package practice

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"taptype/internal/model/code"
	"taptype/internal/model/entity"
)

type wordMasterySummary struct {
	Lang       string
	WordNorm   string
	SeenCount  int
	ErrorCount int
}

const (
	wordMasteryStatusAll         = "all"
	wordMasteryStatusLearning    = "learning"
	wordMasteryStatusPreMastered = "pre_mastered"
	wordMasteryStatusMastered    = "mastered"

	preMasteredThreshold = 3
	masteredThreshold    = 5
)

func (s *serviceImpl) ListWordMasteries(ctx context.Context, userID string, req WordMasteryListRequest) (*WordMasteryListResult, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 {
		req.PageSize = 20
	}
	if req.PageSize > 100 {
		req.PageSize = 100
	}

	status, err := normalizeWordMasteryStatus(req.Status)
	if err != nil {
		return nil, err
	}

	summary, err := s.wordMasterySummary(ctx, userID)
	if err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	search := strings.ToLower(strings.TrimSpace(req.Search))
	query := s.db.WithContext(ctx).Model(&entity.UserWordMastery{}).Where("user_id = ?", userID)
	if search != "" {
		query = query.Where("LOWER(word_norm) LIKE ?", "%"+search+"%")
	}
	query = applyWordMasteryStatusFilter(query, status)

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	var masteries []entity.UserWordMastery
	if err := query.
		Order("mastery_level DESC").
		Order("updated_at DESC").
		Offset((req.Page - 1) * req.PageSize).
		Limit(req.PageSize).
		Find(&masteries).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	items := make([]WordMasteryItem, len(masteries))
	for index, mastery := range masteries {
		items[index] = buildWordMasteryItem(mastery)
	}

	return &WordMasteryListResult{
		Summary:  summary,
		List:     items,
		Total:    total,
		Page:     req.Page,
		PageSize: req.PageSize,
	}, nil
}

func (s *serviceImpl) UpdateWordMasteryState(ctx context.Context, userID, masteryID, state string) (*WordMasteryItem, error) {
	state = strings.ToLower(strings.TrimSpace(state))
	if state != wordMasteryStatusMastered {
		return nil, gerror.NewCode(code.CodeBadRequest, "unsupported mastery state")
	}

	var mastery entity.UserWordMastery
	if err := s.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", masteryID, userID).
		First(&mastery).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gerror.NewCode(code.CodeNotFound, "word mastery not found")
		}
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	now := time.Now()
	if mastery.MasteryLevel < masteredThreshold {
		mastery.MasteryLevel = masteredThreshold
	}
	mastery.LastPracticedAt = &now
	mastery.NextReviewAt = nextWordReviewAt(now, false, mastery.MasteryLevel)
	mastery.UpdatedAt = now

	if err := s.db.WithContext(ctx).Save(&mastery).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	item := buildWordMasteryItem(mastery)
	return &item, nil
}

func (s *serviceImpl) MarkWordMastered(ctx context.Context, userID, wordID string) (*WordMasteryItem, error) {
	if strings.TrimSpace(wordID) == "" {
		return nil, gerror.NewCode(code.CodeBadRequest, "word_id is required")
	}

	var word entity.Word
	if err := s.db.WithContext(ctx).Unscoped().First(&word, "id = ?", wordID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, gerror.NewCode(code.CodeNotFound, "word not found")
		}
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	if err := s.ensureSourceAccessible(ctx, userID, "word_bank", word.BankID); err != nil {
		return nil, err
	}

	language := "en"
	var bank entity.WordBank
	err := s.db.WithContext(ctx).Unscoped().First(&bank, "id = ?", word.BankID).Error
	if err == nil && bank.Language != "" {
		language = bank.Language
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	wordNorm := normalizeWord(word.Content)
	if wordNorm == "" {
		return nil, gerror.NewCode(code.CodeBadRequest, "word content is empty")
	}

	now := time.Now()
	var mastery entity.UserWordMastery
	err = s.db.WithContext(ctx).
		Where("user_id = ? AND lang = ? AND word_norm = ?", userID, language, wordNorm).
		First(&mastery).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		mastery = entity.UserWordMastery{
			ID:              uuid.New().String(),
			UserID:          userID,
			Lang:            language,
			WordNorm:        wordNorm,
			MasteryLevel:    masteredThreshold,
			EaseFactor:      2.5,
			NextReviewAt:    nextWordReviewAt(now, false, masteredThreshold),
			LastPracticedAt: &now,
			TimesSeen:       1,
			CreatedAt:       now,
			UpdatedAt:       now,
		}
		if err := s.db.WithContext(ctx).Create(&mastery).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		item := buildWordMasteryItem(mastery)
		return &item, nil
	}
	if err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	if mastery.MasteryLevel < masteredThreshold {
		mastery.MasteryLevel = masteredThreshold
	}
	if mastery.TimesSeen == 0 {
		mastery.TimesSeen = 1
	}
	mastery.LastPracticedAt = &now
	mastery.NextReviewAt = nextWordReviewAt(now, false, mastery.MasteryLevel)
	mastery.UpdatedAt = now

	if err := s.db.WithContext(ctx).Save(&mastery).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	item := buildWordMasteryItem(mastery)
	return &item, nil
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

func normalizeWordMasteryStatus(status string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "", wordMasteryStatusAll:
		return wordMasteryStatusAll, nil
	case wordMasteryStatusLearning, wordMasteryStatusPreMastered, wordMasteryStatusMastered:
		return strings.ToLower(strings.TrimSpace(status)), nil
	default:
		return "", gerror.NewCode(code.CodeBadRequest, "invalid mastery status")
	}
}

func (s *serviceImpl) wordMasterySummary(ctx context.Context, userID string) (WordMasterySummary, error) {
	trackedCount, err := countWordMasteries(ctx, s.db, userID, nil)
	if err != nil {
		return WordMasterySummary{}, err
	}
	preMasteredCount, err := countWordMasteries(ctx, s.db, userID, func(query *gorm.DB) *gorm.DB {
		return applyWordMasteryStatusFilter(query, wordMasteryStatusPreMastered)
	})
	if err != nil {
		return WordMasterySummary{}, err
	}
	masteredCount, err := countWordMasteries(ctx, s.db, userID, func(query *gorm.DB) *gorm.DB {
		return applyWordMasteryStatusFilter(query, wordMasteryStatusMastered)
	})
	if err != nil {
		return WordMasterySummary{}, err
	}

	return WordMasterySummary{
		TrackedCount:     trackedCount,
		PreMasteredCount: preMasteredCount,
		MasteredCount:    masteredCount,
	}, nil
}

func countWordMasteries(ctx context.Context, db *gorm.DB, userID string, apply func(query *gorm.DB) *gorm.DB) (int64, error) {
	query := db.WithContext(ctx).Model(&entity.UserWordMastery{}).Where("user_id = ?", userID)
	if apply != nil {
		query = apply(query)
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

func applyWordMasteryStatusFilter(query *gorm.DB, status string) *gorm.DB {
	switch status {
	case wordMasteryStatusLearning:
		return query.Where("mastery_level < ?", preMasteredThreshold)
	case wordMasteryStatusPreMastered:
		return query.Where("mastery_level >= ? AND mastery_level < ?", preMasteredThreshold, masteredThreshold)
	case wordMasteryStatusMastered:
		return query.Where("mastery_level >= ?", masteredThreshold)
	default:
		return query
	}
}

func buildWordMasteryItem(mastery entity.UserWordMastery) WordMasteryItem {
	return WordMasteryItem{
		ID:              mastery.ID,
		Lang:            mastery.Lang,
		WordNorm:        mastery.WordNorm,
		Status:          classifyWordMasteryLevel(mastery.MasteryLevel),
		MasteryLevel:    mastery.MasteryLevel,
		TimesSeen:       mastery.TimesSeen,
		NextReviewAt:    mastery.NextReviewAt,
		LastPracticedAt: mastery.LastPracticedAt,
		CreatedAt:       mastery.CreatedAt,
		UpdatedAt:       mastery.UpdatedAt,
	}
}

func classifyWordMasteryLevel(level int) string {
	switch {
	case level >= masteredThreshold:
		return wordMasteryStatusMastered
	case level >= preMasteredThreshold:
		return wordMasteryStatusPreMastered
	default:
		return wordMasteryStatusLearning
	}
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
