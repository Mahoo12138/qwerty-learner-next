package leaderboard

import (
	"context"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"gorm.io/gorm"

	code "taptype/internal/model/code"
)

const (
	leaderboardVisibilityKey = "privacy.leaderboard_visible"
	defaultBoardLimit        = 50
	maxBoardLimit            = 100
	boardCacheTTL            = 5 * time.Minute
	masteredWordThreshold    = 5
)

var metricDefinitions = []MetricDefinition{
	{Key: "best_wpm", Label: "极速冲刺", Description: "单次练习最高 WPM。", Unit: "wpm", SupportsPeriod: true},
	{Key: "avg_wpm", Label: "稳定巡航", Description: "窗口内平均 WPM，至少 5 次会话。", Unit: "wpm", SupportsPeriod: true},
	{Key: "total_chars", Label: "码字里程", Description: "累计输入字符数。", Unit: "chars", SupportsPeriod: true},
	{Key: "total_duration_ms", Label: "训练时长", Description: "累计练习时长。", Unit: "duration", SupportsPeriod: true},
	{Key: "current_streak", Label: "当前连胜", Description: "最新连续练习天数。", Unit: "days", SupportsPeriod: false},
	{Key: "longest_streak", Label: "历史连胜", Description: "历史最高连续练习天数。", Unit: "days", SupportsPeriod: false},
	{Key: "mastered_words", Label: "掌握词数", Description: "已达到掌握阈值的单词数。", Unit: "items", SupportsPeriod: false},
	{Key: "wordbanks_owned", Label: "自建词库", Description: "公开词库数量。", Unit: "items", SupportsPeriod: false},
	{Key: "achievements_unlocked", Label: "成就点亮", Description: "已解锁成就数。", Unit: "items", SupportsPeriod: false},
}

type metricSpec struct {
	definition MetricDefinition
}

var metricSpecs = map[string]metricSpec{
	"best_wpm":              {definition: metricDefinitions[0]},
	"avg_wpm":               {definition: metricDefinitions[1]},
	"total_chars":           {definition: metricDefinitions[2]},
	"total_duration_ms":     {definition: metricDefinitions[3]},
	"current_streak":        {definition: metricDefinitions[4]},
	"longest_streak":        {definition: metricDefinitions[5]},
	"mastered_words":        {definition: metricDefinitions[6]},
	"wordbanks_owned":       {definition: metricDefinitions[7]},
	"achievements_unlocked": {definition: metricDefinitions[8]},
}

type boardCacheKey struct {
	Metric string
	Period string
	Limit  int
}

type boardCacheEntry struct {
	List      []Entry
	Total     int
	ExpiresAt time.Time
}

type rankedRow struct {
	UserID        string  `gorm:"column:user_id"`
	Nickname      string  `gorm:"column:nickname"`
	AvatarMediaID *string `gorm:"column:avatar_media_id"`
	Value         float64 `gorm:"column:value"`
	UpdatedAtRaw  string  `gorm:"column:updated_at"`
	Rank          int     `gorm:"column:rank"`
	Total         int     `gorm:"column:total"`
}

type serviceImpl struct {
	db         *gorm.DB
	cacheMu    sync.RWMutex
	boardCache map[boardCacheKey]boardCacheEntry
}

var _ Service = (*serviceImpl)(nil)

// NewService creates a leaderboard service backed by GORM.
func NewService(db *gorm.DB) Service {
	return &serviceImpl{db: db, boardCache: make(map[boardCacheKey]boardCacheEntry)}
}

// ListMetrics returns supported leaderboard metrics in presentation order.
func (s *serviceImpl) ListMetrics() []MetricDefinition {
	items := make([]MetricDefinition, len(metricDefinitions))
	copy(items, metricDefinitions)
	return items
}

// GetBoard returns leaderboard rows for the requested metric and period.
func (s *serviceImpl) GetBoard(ctx context.Context, userID, metric, period string, limit int) (*BoardResponse, error) {
	normalizedMetric, spec, err := normalizeMetric(metric)
	if err != nil {
		return nil, err
	}

	normalizedPeriod, _, err := normalizePeriod(spec, period)
	if err != nil {
		return nil, err
	}

	normalizedLimit := normalizeLimit(limit)
	board, err := s.loadBoard(ctx, normalizedMetric, normalizedPeriod, normalizedLimit)
	if err != nil {
		return nil, err
	}

	rankEntry, _, err := s.lookupRank(ctx, userID, normalizedMetric, normalizedPeriod)
	if err != nil {
		return nil, err
	}

	return &BoardResponse{
		Metric: normalizedMetric,
		Period: normalizedPeriod,
		List:   cloneEntries(board.List),
		MyRank: rankEntry,
		Total:  board.Total,
	}, nil
}

// GetMyRank returns the current user's leaderboard rank for a metric.
func (s *serviceImpl) GetMyRank(ctx context.Context, userID, metric, period string) (*MyRankResponse, error) {
	normalizedMetric, spec, err := normalizeMetric(metric)
	if err != nil {
		return nil, err
	}

	normalizedPeriod, _, err := normalizePeriod(spec, period)
	if err != nil {
		return nil, err
	}

	board, err := s.loadBoard(ctx, normalizedMetric, normalizedPeriod, 1)
	if err != nil {
		return nil, err
	}

	entry, rank, err := s.lookupRank(ctx, userID, normalizedMetric, normalizedPeriod)
	if err != nil {
		return nil, err
	}

	return &MyRankResponse{
		Metric: normalizedMetric,
		Period: normalizedPeriod,
		Rank:   rank,
		Total:  board.Total,
		Entry:  entry,
	}, nil
}

func (s *serviceImpl) loadBoard(ctx context.Context, metric, period string, limit int) (boardCacheEntry, error) {
	cacheKey := boardCacheKey{Metric: metric, Period: period, Limit: limit}
	if cached, ok := s.getCachedBoard(cacheKey); ok {
		return cached, nil
	}

	query, args, err := buildRankedQuery(metric, period)
	if err != nil {
		return boardCacheEntry{}, err
	}

	query += `
SELECT user_id, nickname, avatar_media_id, value, updated_at, rank, total
FROM ranked
ORDER BY rank
LIMIT ?`
	args = append(args, limit)

	var rows []rankedRow
	if err := s.db.WithContext(ctx).Raw(query, args...).Scan(&rows).Error; err != nil {
		return boardCacheEntry{}, fmt.Errorf("load leaderboard board: %w", err)
	}

	result := boardCacheEntry{List: make([]Entry, 0, len(rows))}
	for _, row := range rows {
		result.List = append(result.List, rowToEntry(row))
		result.Total = row.Total
	}
	result.ExpiresAt = time.Now().Add(boardCacheTTL)
	s.setCachedBoard(cacheKey, result)
	return result, nil
}

func (s *serviceImpl) lookupRank(ctx context.Context, userID, metric, period string) (*Entry, *int, error) {
	if strings.TrimSpace(userID) == "" {
		return nil, nil, nil
	}

	query, args, err := buildRankedQuery(metric, period)
	if err != nil {
		return nil, nil, err
	}

	query += `
SELECT user_id, nickname, avatar_media_id, value, updated_at, rank, total
FROM ranked
WHERE user_id = ?
LIMIT 1`
	args = append(args, userID)

	var row rankedRow
	if err := s.db.WithContext(ctx).Raw(query, args...).Scan(&row).Error; err != nil {
		return nil, nil, fmt.Errorf("lookup leaderboard rank: %w", err)
	}
	if strings.TrimSpace(row.UserID) == "" {
		return nil, nil, nil
	}

	entry := rowToEntry(row)
	rank := row.Rank
	return &entry, &rank, nil
}

func (s *serviceImpl) getCachedBoard(key boardCacheKey) (boardCacheEntry, bool) {
	s.cacheMu.RLock()
	cached, ok := s.boardCache[key]
	s.cacheMu.RUnlock()
	if !ok || time.Now().After(cached.ExpiresAt) {
		return boardCacheEntry{}, false
	}
	cached.List = cloneEntries(cached.List)
	return cached, true
}

func (s *serviceImpl) setCachedBoard(key boardCacheKey, value boardCacheEntry) {
	s.cacheMu.Lock()
	defer s.cacheMu.Unlock()
	value.List = cloneEntries(value.List)
	s.boardCache[key] = value
}

func buildRankedQuery(metric, period string) (string, []any, error) {
	_, spec, err := normalizeMetric(metric)
	if err != nil {
		return "", nil, err
	}

	normalizedPeriod, since, err := normalizePeriod(spec, period)
	if err != nil {
		return "", nil, err
	}

	scoredSQL, scoredArgs, err := buildScoredQuery(metric, normalizedPeriod, since)
	if err != nil {
		return "", nil, err
	}

	query := `
WITH visible_users AS (
	SELECT u.id, u.nickname, u.avatar_media_id
	FROM users u
	LEFT JOIN user_settings us
		ON us.user_id = u.id AND us.definition_key = ?
	WHERE u.deleted_at IS NULL
		AND u.is_active = 1
		AND COALESCE(us.value, 'true') = 'true'
),
scored AS (
` + scoredSQL + `
),
ranked AS (
	SELECT
		scored.user_id,
		scored.nickname,
		scored.avatar_media_id,
		scored.value,
		scored.updated_at,
		ROW_NUMBER() OVER (ORDER BY scored.value DESC, scored.user_id ASC) AS rank,
		COUNT(*) OVER () AS total
	FROM scored
)
`

	args := []any{leaderboardVisibilityKey}
	args = append(args, scoredArgs...)
	return query, args, nil
}

func buildScoredQuery(metric, period string, since *time.Time) (string, []any, error) {
	_ = period
	periodClause := ""
	var periodArgs []any
	if since != nil {
		periodClause = " AND ps.started_at >= ?"
		periodArgs = append(periodArgs, *since)
	}

	switch metric {
	case "best_wpm":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		MAX(pr.wpm) AS value,
		MAX(pr.created_at) AS updated_at
	FROM visible_users vu
	JOIN practice_sessions ps ON ps.user_id = vu.id
	JOIN practice_results pr ON pr.session_id = ps.id
	WHERE ps.ended_at IS NOT NULL` + periodClause + `
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id`, periodArgs, nil
	case "avg_wpm":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		AVG(pr.wpm) AS value,
		MAX(pr.created_at) AS updated_at
	FROM visible_users vu
	JOIN practice_sessions ps ON ps.user_id = vu.id
	JOIN practice_results pr ON pr.session_id = ps.id
	WHERE ps.ended_at IS NOT NULL` + periodClause + `
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id
	HAVING COUNT(*) >= 5`, periodArgs, nil
	case "total_chars":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(SUM(pr.char_count) AS REAL) AS value,
		MAX(pr.created_at) AS updated_at
	FROM visible_users vu
	JOIN practice_sessions ps ON ps.user_id = vu.id
	JOIN practice_results pr ON pr.session_id = ps.id
	WHERE ps.ended_at IS NOT NULL` + periodClause + `
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id`, periodArgs, nil
	case "total_duration_ms":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(SUM(COALESCE(ps.duration_ms, 0)) AS REAL) AS value,
		MAX(ps.started_at) AS updated_at
	FROM visible_users vu
	JOIN practice_sessions ps ON ps.user_id = vu.id
	WHERE ps.ended_at IS NOT NULL` + periodClause + `
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id`, periodArgs, nil
	case "current_streak":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(dr.streak_day AS REAL) AS value,
		dr.updated_at AS updated_at
	FROM visible_users vu
	JOIN daily_records dr ON dr.user_id = vu.id
	JOIN (
		SELECT user_id, MAX(record_date) AS record_date
		FROM daily_records
		GROUP BY user_id
	) latest ON latest.user_id = dr.user_id AND latest.record_date = dr.record_date
	WHERE dr.streak_day > 0`, nil, nil
	case "longest_streak":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(MAX(dr.streak_day) AS REAL) AS value,
		MAX(dr.updated_at) AS updated_at
	FROM visible_users vu
	JOIN daily_records dr ON dr.user_id = vu.id
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id
	HAVING MAX(dr.streak_day) > 0`, nil, nil
	case "mastered_words":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(COUNT(*) AS REAL) AS value,
		MAX(uwm.updated_at) AS updated_at
	FROM visible_users vu
	JOIN user_word_mastery uwm ON uwm.user_id = vu.id
	WHERE uwm.mastery_level >= ?
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id
	HAVING COUNT(*) > 0`, []any{masteredWordThreshold}, nil
	case "wordbanks_owned":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(COUNT(*) AS REAL) AS value,
		MAX(wb.updated_at) AS updated_at
	FROM visible_users vu
	JOIN word_banks wb ON wb.owner_id = vu.id
	WHERE wb.is_public = 1 AND wb.deleted_at IS NULL
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id
	HAVING COUNT(*) > 0`, nil, nil
	case "achievements_unlocked":
		return `
	SELECT
		vu.id AS user_id,
		vu.nickname AS nickname,
		vu.avatar_media_id AS avatar_media_id,
		CAST(COUNT(*) AS REAL) AS value,
		MAX(ua.unlocked_at) AS updated_at
	FROM visible_users vu
	JOIN user_achievements ua ON ua.user_id = vu.id
	GROUP BY vu.id, vu.nickname, vu.avatar_media_id
	HAVING COUNT(*) > 0`, nil, nil
	default:
		return "", nil, gerror.NewCode(code.CodeBadRequest, "unsupported leaderboard metric")
	}
}

func normalizeMetric(metric string) (string, metricSpec, error) {
	normalized := strings.ToLower(strings.TrimSpace(metric))
	spec, ok := metricSpecs[normalized]
	if !ok {
		return "", metricSpec{}, gerror.NewCode(code.CodeBadRequest, fmt.Sprintf("unsupported leaderboard metric: %s", metric))
	}
	return normalized, spec, nil
}

func normalizePeriod(spec metricSpec, period string) (string, *time.Time, error) {
	normalized := strings.ToLower(strings.TrimSpace(period))
	if normalized == "" {
		normalized = "all"
	}
	if !spec.definition.SupportsPeriod {
		return "all", nil, nil
	}

	now := time.Now()
	switch normalized {
	case "all":
		return normalized, nil, nil
	case "month":
		since := now.AddDate(0, 0, -30)
		return normalized, &since, nil
	case "week":
		since := now.AddDate(0, 0, -7)
		return normalized, &since, nil
	case "day":
		since := now.Add(-24 * time.Hour)
		return normalized, &since, nil
	default:
		return "", nil, gerror.NewCode(code.CodeBadRequest, fmt.Sprintf("unsupported leaderboard period: %s", period))
	}
}

func normalizeLimit(limit int) int {
	if limit <= 0 {
		return defaultBoardLimit
	}
	if limit > maxBoardLimit {
		return maxBoardLimit
	}
	return limit
}

func rowToEntry(row rankedRow) Entry {
	return Entry{
		Rank:          row.Rank,
		UserID:        row.UserID,
		Nickname:      normalizeNickname(row.UserID, row.Nickname),
		AvatarMediaID: row.AvatarMediaID,
		Value:         row.Value,
		UpdatedAt:     parseNullableTime(row.UpdatedAtRaw),
	}
}

func normalizeNickname(userID, nickname string) string {
	trimmed := strings.TrimSpace(nickname)
	if trimmed != "" {
		return trimmed
	}
	compactID := strings.ReplaceAll(strings.TrimSpace(userID), "-", "")
	if len(compactID) > 6 {
		compactID = compactID[len(compactID)-6:]
	}
	if compactID == "" {
		compactID = "member"
	}
	return "User-" + compactID
}

func cloneEntries(entries []Entry) []Entry {
	cloned := make([]Entry, len(entries))
	copy(cloned, entries)
	return cloned
}

func parseNullableTime(raw string) *time.Time {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return nil
	}

	layouts := []string{
		time.RFC3339Nano,
		time.RFC3339,
		"2006-01-02 15:04:05.999999999-07:00",
		"2006-01-02 15:04:05.999999999",
		"2006-01-02 15:04:05.999999",
		"2006-01-02 15:04:05.999",
		"2006-01-02 15:04:05",
	}

	for _, layout := range layouts {
		parsed, err := time.Parse(layout, trimmed)
		if err == nil {
			return &parsed
		}
	}

	return nil
}
