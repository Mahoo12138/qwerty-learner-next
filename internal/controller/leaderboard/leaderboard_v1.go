package leaderboard

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"

	v1 "taptype/api/leaderboard/v1"
)

// ListMetrics returns the supported leaderboard metrics.
func (c *ControllerV1) ListMetrics(ctx context.Context, req *v1.ListMetricsReq) (res *v1.ListMetricsRes, err error) {
	r := g.RequestFromCtx(ctx)
	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": c.leaderboardSvc.ListMetrics()})
	return nil, nil
}

// GetBoard returns the leaderboard rows for the requested metric.
func (c *ControllerV1) GetBoard(ctx context.Context, req *v1.GetBoardReq) (res *v1.GetBoardRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	board, err := c.leaderboardSvc.GetBoard(ctx, userID, req.Metric, req.Period, req.Limit)
	if err != nil {
		return nil, err
	}

	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": board})
	return nil, nil
}

// GetMyRank returns the current user's leaderboard rank for the requested metric.
func (c *ControllerV1) GetMyRank(ctx context.Context, req *v1.GetMyRankReq) (res *v1.GetMyRankRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	rank, err := c.leaderboardSvc.GetMyRank(ctx, userID, req.Metric, req.Period)
	if err != nil {
		return nil, err
	}

	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": rank})
	return nil, nil
}
