package adaptive

import (
	"context"
	"time"

	"taptype/internal/model/entity"
)

// Service implements the Adaptive Practice Engine: it analyses the user's
// historical keystroke data to build a weakness profile, and turns that profile
// into targeted practice sessions.
type Service interface {
	// GetProfile computes the user's current typing weakness profile from
	// aggregated keystroke statistics.
	GetProfile(ctx context.Context, userID string) (*Profile, error)
	// CreateAdaptiveSession generates a word practice session whose content is
	// biased towards the user's weak keys. When no keystroke data exists yet it
	// falls back to random selection across accessible word banks.
	CreateAdaptiveSession(ctx context.Context, req CreateAdaptiveRequest) (*AdaptiveSessionResult, error)
}

// WeakKey is a single key with its computed weakness score.
type WeakKey struct {
	KeyChar       string  `json:"key_char"`
	WeakScore     float64 `json:"weak_score"`
	ErrorRate     float64 `json:"error_rate"`
	AvgIntervalMs float64 `json:"avg_interval_ms"`
	IntervalDelta float64 `json:"interval_delta"` // positive when slower than the user's overall average
	TotalHits     int     `json:"total_hits"`
	TotalErrors   int     `json:"total_errors"`
}

// Profile is the user's adaptive typing profile.
type Profile struct {
	WeakKeys             []WeakKey `json:"weak_keys"`
	OverallAvgIntervalMs float64   `json:"overall_avg_interval_ms"`
	KeysAnalyzed         int       `json:"keys_analyzed"`
	HasData              bool      `json:"has_data"`
	GeneratedAt          time.Time `json:"generated_at"`
}

type CreateAdaptiveRequest struct {
	UserID    string `json:"-"`
	ItemCount int    `json:"item_count"`
}

// AdaptiveSessionResult mirrors the practice session creation response and adds
// the keys this session was generated for.
type AdaptiveSessionResult struct {
	Session      entity.PracticeSession `json:"session"`
	Words        []entity.Word          `json:"words"`
	TargetedKeys []string               `json:"targeted_keys"`
}
