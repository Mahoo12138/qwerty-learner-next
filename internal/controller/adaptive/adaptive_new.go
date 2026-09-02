package adaptive

import (
	adaptiveService "taptype/internal/service/adaptive"
)

type ControllerV1 struct {
	adaptiveSvc adaptiveService.Service
}

func NewV1(adaptiveSvc adaptiveService.Service) *ControllerV1 {
	return &ControllerV1{adaptiveSvc: adaptiveSvc}
}
