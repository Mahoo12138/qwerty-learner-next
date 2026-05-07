// Package leaderboard defines the public leaderboard controller contract.
package leaderboard

import (
	"context"

	v1 "taptype/api/leaderboard/v1"
)

// ILeaderboardV1 exposes leaderboard read APIs for the current user.
type ILeaderboardV1 interface {
	// ListMetrics returns all supported leaderboard metrics.
	ListMetrics(ctx context.Context, req *v1.ListMetricsReq) (res *v1.ListMetricsRes, err error)
	// GetBoard returns the leaderboard for the requested metric.
	GetBoard(ctx context.Context, req *v1.GetBoardReq) (res *v1.GetBoardRes, err error)
	// GetMyRank returns the current user's ranking for the requested metric.
	GetMyRank(ctx context.Context, req *v1.GetMyRankReq) (res *v1.GetMyRankRes, err error)
}
