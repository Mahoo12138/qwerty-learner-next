package adaptive

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"

	v1 "taptype/api/adaptive/v1"
	adaptiveService "taptype/internal/service/adaptive"
)

func (c *ControllerV1) GetProfile(ctx context.Context, req *v1.GetProfileReq) (res *v1.GetProfileRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	profile, err := c.adaptiveSvc.GetProfile(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &v1.GetProfileRes{Profile: profile}, nil
}

func (c *ControllerV1) CreateAdaptiveSession(ctx context.Context, req *v1.CreateAdaptiveSessionReq) (res *v1.CreateAdaptiveSessionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	result, err := c.adaptiveSvc.CreateAdaptiveSession(ctx, adaptiveService.CreateAdaptiveRequest{
		UserID:    userID,
		ItemCount: req.ItemCount,
	})
	if err != nil {
		return nil, err
	}

	return &v1.CreateAdaptiveSessionRes{
		Session:      result.Session,
		Words:        result.Words,
		TargetedKeys: result.TargetedKeys,
	}, nil
}
