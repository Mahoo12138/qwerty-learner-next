// Package leaderboard wires leaderboard controllers onto GoFrame routes.
package leaderboard

import (
	api "taptype/api/leaderboard"
	leaderboardService "taptype/internal/service/leaderboard"
)

// ControllerV1 is the HTTP controller for leaderboard APIs.
type ControllerV1 struct {
	leaderboardSvc leaderboardService.Service
}

// NewV1 creates a versioned leaderboard controller.
func NewV1(leaderboardSvc leaderboardService.Service) api.ILeaderboardV1 {
	return &ControllerV1{leaderboardSvc: leaderboardSvc}
}
