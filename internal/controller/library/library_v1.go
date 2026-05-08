package library

import (
	"context"

	"github.com/gogf/gf/v2/frame/g"

	v1 "taptype/api/library/v1"
	libraryService "taptype/internal/service/library"
)

func (c *ControllerV1) GetLibraryDiscovery(ctx context.Context, req *v1.GetLibraryDiscoveryReq) (res *v1.GetLibraryDiscoveryRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	result, err := c.librarySvc.ListDiscovery(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &v1.GetLibraryDiscoveryRes{
		SystemLibraries:    result.SystemLibraries,
		CommunityLibraries: result.CommunityLibraries,
		Subscriptions:      result.Subscriptions,
	}, nil
}

func (c *ControllerV1) ListLibrarySubscriptions(ctx context.Context, req *v1.ListLibrarySubscriptionsReq) (res *v1.ListLibrarySubscriptionsRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	items, err := c.librarySvc.ListSubscriptions(ctx, userID, req.LibraryType)
	if err != nil {
		return nil, err
	}

	return &v1.ListLibrarySubscriptionsRes{List: items}, nil
}

func (c *ControllerV1) CreateLibrarySubscription(ctx context.Context, req *v1.CreateLibrarySubscriptionReq) (res *v1.CreateLibrarySubscriptionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	item, err := c.librarySvc.Subscribe(ctx, userID, libraryService.SubscribeReq{
		LibraryType: req.LibraryType,
		LibraryID:   req.LibraryID,
	})
	if err != nil {
		return nil, err
	}

	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": item})
	return
}

func (c *ControllerV1) DeleteLibrarySubscription(ctx context.Context, req *v1.DeleteLibrarySubscriptionReq) (res *v1.DeleteLibrarySubscriptionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	if err = c.librarySvc.Unsubscribe(ctx, userID, req.LibraryType, req.LibraryID); err != nil {
		return nil, err
	}

	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": nil})
	return
}
