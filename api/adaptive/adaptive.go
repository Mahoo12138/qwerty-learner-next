package adaptive

import (
	"context"

	v1 "taptype/api/adaptive/v1"
)

type IAdaptiveV1 interface {
	GetProfile(ctx context.Context, req *v1.GetProfileReq) (res *v1.GetProfileRes, err error)
	CreateAdaptiveSession(ctx context.Context, req *v1.CreateAdaptiveSessionReq) (res *v1.CreateAdaptiveSessionRes, err error)
}
