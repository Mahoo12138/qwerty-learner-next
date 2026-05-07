// Package v1 defines version 1 leaderboard API request and response contracts.
package v1

import "github.com/gogf/gf/v2/frame/g"

// ListMetricsReq requests the static list of supported leaderboard metrics.
type ListMetricsReq struct {
	g.Meta `path:"/leaderboard/metrics" method:"get" tags:"Leaderboard" summary:"List supported leaderboard metrics"`
}

// ListMetricsRes is an empty marker because responses are written directly.
type ListMetricsRes struct{}

// GetBoardReq requests a leaderboard board for a metric and optional period.
type GetBoardReq struct {
	g.Meta `path:"/leaderboard/{metric}" method:"get" tags:"Leaderboard" summary:"Get leaderboard board for a metric"`
	Metric string `json:"metric" in:"path" v:"required#metric is required"`
	Period string `json:"period" in:"query" d:"all"`
	Limit  int    `json:"limit" in:"query" d:"50"`
}

// GetBoardRes is an empty marker because responses are written directly.
type GetBoardRes struct{}

// GetMyRankReq requests the current user's leaderboard rank.
type GetMyRankReq struct {
	g.Meta `path:"/leaderboard/me" method:"get" tags:"Leaderboard" summary:"Get my leaderboard rank for a metric"`
	Metric string `json:"metric" in:"query" v:"required#metric is required"`
	Period string `json:"period" in:"query" d:"all"`
}

// GetMyRankRes is an empty marker because responses are written directly.
type GetMyRankRes struct{}
