// Package leaderboard implements the station-wide leaderboard read model.
package leaderboard

import (
	"context"
	"time"
)

// Service defines leaderboard read operations.
type Service interface {
	// ListMetrics returns supported leaderboard metrics in presentation order.
	ListMetrics() []MetricDefinition
	// GetBoard returns the leaderboard list and the current user's optional rank.
	GetBoard(ctx context.Context, userID, metric, period string, limit int) (*BoardResponse, error)
	// GetMyRank returns the current user's leaderboard position for a metric.
	GetMyRank(ctx context.Context, userID, metric, period string) (*MyRankResponse, error)
}

// MetricDefinition describes a supported leaderboard metric.
type MetricDefinition struct {
	Key            string `json:"key"`
	Label          string `json:"label"`
	Description    string `json:"description,omitempty"`
	Unit           string `json:"unit,omitempty"`
	SupportsPeriod bool   `json:"supports_period"`
}

// Entry represents a single leaderboard row.
type Entry struct {
	Rank          int        `json:"rank"`
	UserID        string     `json:"user_id"`
	Nickname      string     `json:"nickname"`
	AvatarMediaID *string    `json:"avatar_media_id"`
	Value         float64    `json:"value"`
	UpdatedAt     *time.Time `json:"updated_at"`
}

// BoardResponse is the payload returned by GetBoard.
type BoardResponse struct {
	Metric string  `json:"metric"`
	Period string  `json:"period"`
	List   []Entry `json:"list"`
	MyRank *Entry  `json:"my_rank"`
	Total  int     `json:"total"`
}

// MyRankResponse is the payload returned by GetMyRank.
type MyRankResponse struct {
	Metric string `json:"metric"`
	Period string `json:"period"`
	Rank   *int   `json:"rank"`
	Total  int    `json:"total"`
	Entry  *Entry `json:"entry"`
}
