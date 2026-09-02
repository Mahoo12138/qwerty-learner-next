package adaptive

import (
	"context"
	"math/rand"
	"sort"
	"strings"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"taptype/internal/model/code"
	"taptype/internal/model/entity"
)

const (
	// Scoring weights (PLAN.md §3.3). Phase 1 only uses ErrorRate and
	// IntervalPenalty, re-normalised from 0.45/0.30 so the score stays in [0,1].
	// Regression and Forgetting components can be added on top later.
	weightErrorRate = 0.60
	weightInterval  = 0.40
	// maxErrorRate is the error rate considered "fully weak" (20% wrong presses).
	maxErrorRate = 0.20
	// maxIntervalDelta is how much slower than the user's average (relative)
	// counts as "fully weak" (50% slower).
	maxIntervalDelta = 0.50
	// minKeyHits filters out keys without enough samples to judge.
	minKeyHits = 10
	// weakKeyThreshold is the minimum weak score for a key to be targeted.
	weakKeyThreshold = 0.15
	maxWeakKeys      = 8

	defaultItemCount  = 20
	maxItemCount      = 200
	candidatePoolSize = 800
)

type serviceImpl struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) Service {
	return &serviceImpl{db: db}
}

// keyStatRow is one grouped row of aggregated keystroke statistics.
type keyStatRow struct {
	KeyChar       string  `json:"key_char"`
	TotalHits     int     `json:"total_hits"`
	TotalErrors   int     `json:"total_errors"`
	ErrorRate     float64 `json:"error_rate"`
	AvgIntervalMs float64 `json:"avg_interval_ms"`
}

func (s *serviceImpl) GetProfile(ctx context.Context, userID string) (*Profile, error) {
	var rows []keyStatRow
	query := `
		SELECT
			ks.key_char,
			SUM(ks.hit_count) as total_hits,
			SUM(ks.error_count) as total_errors,
			CASE WHEN SUM(ks.hit_count) > 0
				THEN CAST(SUM(ks.error_count) AS REAL) / SUM(ks.hit_count)
				ELSE 0
			END as error_rate,
			AVG(ks.avg_interval_ms) as avg_interval_ms
		FROM keystroke_stats ks
		JOIN practice_sessions ps ON ps.id = ks.session_id
		WHERE ps.user_id = ?
		GROUP BY ks.key_char
	`
	if err := s.db.WithContext(ctx).Raw(query, userID).Scan(&rows).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	profile := &Profile{
		WeakKeys:     []WeakKey{},
		KeysAnalyzed: 0,
		GeneratedAt:  time.Now(),
	}
	if len(rows) == 0 {
		return profile, nil
	}

	// Merge case variants of the same physical key ("R" and "r").
	merged := map[string]*WeakKey{}
	for _, row := range rows {
		key := strings.ToLower(row.KeyChar)
		entry, ok := merged[key]
		if !ok {
			entry = &WeakKey{KeyChar: key}
			merged[key] = entry
		}
		entry.TotalHits += row.TotalHits
		entry.TotalErrors += row.TotalErrors
		entry.AvgIntervalMs += row.AvgIntervalMs * float64(row.TotalHits)
	}

	keys := make([]*WeakKey, 0, len(merged))
	var totalWeightedInterval float64
	var totalHits int
	for _, entry := range merged {
		if entry.TotalHits > 0 {
			entry.AvgIntervalMs /= float64(entry.TotalHits)
		}
		if entry.TotalHits > 0 {
			entry.ErrorRate = float64(entry.TotalErrors) / float64(entry.TotalHits)
		}
		totalWeightedInterval += entry.AvgIntervalMs * float64(entry.TotalHits)
		totalHits += entry.TotalHits
		keys = append(keys, entry)
	}
	if totalHits == 0 {
		return profile, nil
	}
	overallAvgInterval := totalWeightedInterval / float64(totalHits)

	profile.OverallAvgIntervalMs = overallAvgInterval
	profile.KeysAnalyzed = len(keys)
	profile.HasData = true

	for _, entry := range keys {
		if entry.TotalHits < minKeyHits {
			continue
		}
		entry.IntervalDelta = (entry.AvgIntervalMs - overallAvgInterval) / overallAvgInterval
		entry.WeakScore = weakScore(entry.ErrorRate, entry.IntervalDelta)
		if entry.WeakScore >= weakKeyThreshold {
			profile.WeakKeys = append(profile.WeakKeys, *entry)
		}
	}
	sort.Slice(profile.WeakKeys, func(i, j int) bool {
		return profile.WeakKeys[i].WeakScore > profile.WeakKeys[j].WeakScore
	})
	if len(profile.WeakKeys) > maxWeakKeys {
		profile.WeakKeys = profile.WeakKeys[:maxWeakKeys]
	}

	return profile, nil
}

// weakScore combines the error-rate and interval-penalty components into a
// single weakness score in [0,1].
func weakScore(errorRate, intervalDelta float64) float64 {
	errorComponent := clamp(errorRate/maxErrorRate, 0, 1)
	intervalPenalty := 0.0
	if intervalDelta > 0 {
		intervalPenalty = clamp(intervalDelta/maxIntervalDelta, 0, 1)
	}
	return weightErrorRate*errorComponent + weightInterval*intervalPenalty
}

func clamp(v, lo, hi float64) float64 {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func (s *serviceImpl) CreateAdaptiveSession(ctx context.Context, req CreateAdaptiveRequest) (*AdaptiveSessionResult, error) {
	itemCount := req.ItemCount
	if itemCount < 1 {
		itemCount = defaultItemCount
	}
	if itemCount > maxItemCount {
		itemCount = maxItemCount
	}

	profile, err := s.GetProfile(ctx, req.UserID)
	if err != nil {
		return nil, err
	}

	candidates, err := s.loadCandidateWords(ctx, req.UserID)
	if err != nil {
		return nil, err
	}
	if len(candidates) == 0 {
		return nil, gerror.NewCode(code.CodeNotFound, "no accessible word banks with words")
	}

	// Shuffle first so that stable sorting below breaks score ties randomly.
	rand.Shuffle(len(candidates), func(i, j int) {
		candidates[i], candidates[j] = candidates[j], candidates[i]
	})

	weakScores := make(map[string]float64, len(profile.WeakKeys))
	targetedKeys := make([]string, 0, len(profile.WeakKeys))
	for _, wk := range profile.WeakKeys {
		weakScores[wk.KeyChar] = wk.WeakScore
		targetedKeys = append(targetedKeys, wk.KeyChar)
	}

	type scored struct {
		word  entity.Word
		score float64
	}
	scoredWords := make([]scored, len(candidates))
	for i, word := range candidates {
		scoredWords[i] = scored{word: word, score: scoreWordContent(word.Content, weakScores)}
	}
	sort.SliceStable(scoredWords, func(i, j int) bool {
		return scoredWords[i].score > scoredWords[j].score
	})

	selected := make([]entity.Word, 0, itemCount)
	for _, sw := range scoredWords {
		if len(selected) >= itemCount {
			break
		}
		if sw.score > 0 {
			selected = append(selected, sw.word)
		}
	}
	// Fill up with random (already shuffled) non-matching words so the session
	// always has full length even when weak-key content is scarce.
	for _, sw := range scoredWords {
		if len(selected) >= itemCount {
			break
		}
		if sw.score == 0 {
			selected = append(selected, sw.word)
		}
	}

	now := time.Now()
	session := entity.PracticeSession{
		ID:         uuid.New().String(),
		UserID:     req.UserID,
		Mode:       "word",
		SourceType: "adaptive",
		ItemCount:  len(selected),
		StartedAt:  now,
		CreatedAt:  now,
	}
	sessionItems := make([]entity.PracticeSessionItem, len(selected))
	for i, word := range selected {
		sessionItems[i] = entity.PracticeSessionItem{
			ID:          uuid.New().String(),
			SessionID:   session.ID,
			ItemOrder:   i,
			ContentType: "word",
			ContentID:   word.ID,
			CreatedAt:   now,
		}
	}

	if err := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&session).Error; err != nil {
			return err
		}
		return tx.Create(&sessionItems).Error
	}); err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	return &AdaptiveSessionResult{
		Session:      session,
		Words:        selected,
		TargetedKeys: targetedKeys,
	}, nil
}

// scoreWordContent counts weak-key occurrences in a word and weights them by
// the key's weak score.
func scoreWordContent(content string, weakScores map[string]float64) float64 {
	if len(weakScores) == 0 {
		return 0
	}
	var score float64
	for _, r := range strings.ToLower(strings.TrimSpace(content)) {
		if ws, ok := weakScores[string(r)]; ok {
			score += ws
		}
	}
	return score
}

// loadCandidateWords gathers words from banks the user can practice: owned,
// public, or subscribed word banks.
func (s *serviceImpl) loadCandidateWords(ctx context.Context, userID string) ([]entity.Word, error) {
	var words []entity.Word
	query := s.db.WithContext(ctx).
		Model(&entity.Word{}).
		Joins("JOIN word_banks ON word_banks.id = words.bank_id AND word_banks.deleted_at IS NULL").
		Where(
			"word_banks.owner_id = ? OR word_banks.is_public = 1 OR word_banks.id IN (?)",
			userID,
			s.db.Model(&entity.LibrarySubscription{}).
				Select("library_id").
				Where("user_id = ? AND library_type = ?", userID, "word_bank"),
		).
		Order("RANDOM()").
		Limit(candidatePoolSize)
	if err := query.Find(&words).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	return words, nil
}
