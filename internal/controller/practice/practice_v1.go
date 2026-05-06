package practice

import (
	"context"
	"encoding/json"

	"github.com/gogf/gf/v2/frame/g"

	v1 "taptype/api/practice/v1"
	practiceService "taptype/internal/service/practice"
)

func (c *ControllerV1) CreateSession(ctx context.Context, req *v1.CreateSessionReq) (res *v1.CreateSessionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	svcReq := practiceService.CreateSessionRequest{
		UserID:     userID,
		Mode:       req.Mode,
		SourceType: req.SourceType,
		SourceID:   req.SourceID,
		ItemCount:  req.ItemCount,
	}

	result, err := c.practiceSvc.CreateSession(ctx, svcReq)
	if err != nil {
		return nil, err
	}

	return &v1.CreateSessionRes{
		Session:   result.Session,
		Words:     result.Words,
		Sentences: result.Sentences,
	}, nil
}

func (c *ControllerV1) ListSessions(ctx context.Context, req *v1.ListSessionsReq) (res *v1.ListSessionsRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	result, err := c.practiceSvc.ListSessions(ctx, userID, req.Page, req.PageSize)
	if err != nil {
		return nil, err
	}

	return &v1.ListSessionsRes{
		List:     result.List,
		Total:    result.Total,
		Page:     result.Page,
		PageSize: result.PageSize,
	}, nil
}

func (c *ControllerV1) ListWordMasteries(ctx context.Context, req *v1.ListWordMasteriesReq) (res *v1.ListWordMasteriesRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	result, err := c.practiceSvc.ListWordMasteries(ctx, userID, practiceService.WordMasteryListRequest{
		Status:   req.Status,
		Search:   req.Search,
		Page:     req.Page,
		PageSize: req.PageSize,
	})
	if err != nil {
		return nil, err
	}

	return &v1.ListWordMasteriesRes{
		Summary:  result.Summary,
		List:     result.List,
		Total:    result.Total,
		Page:     result.Page,
		PageSize: result.PageSize,
	}, nil
}

func (c *ControllerV1) GetSession(ctx context.Context, req *v1.GetSessionReq) (res *v1.GetSessionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	result, err := c.practiceSvc.GetSession(ctx, userID, req.Id)
	if err != nil {
		return nil, err
	}

	return &v1.GetSessionRes{
		Session:        result.Session,
		Result:         result.Result,
		KeystrokeStats: result.KeystrokeStats,
		ErrorItems:     result.ErrorItems,
		Words:          result.Words,
		Sentences:      result.Sentences,
	}, nil
}

func (c *ControllerV1) DiscardSession(ctx context.Context, req *v1.DiscardSessionReq) (res *v1.DiscardSessionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	if err = c.practiceSvc.DiscardSession(ctx, userID, req.Id); err != nil {
		return nil, err
	}

	return &v1.DiscardSessionRes{}, nil
}

func (c *ControllerV1) CompleteSession(ctx context.Context, req *v1.CompleteSessionReq) (res *v1.CompleteSessionRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	// Convert []interface{} keystroke stats to typed structs
	var keystrokeStats []practiceService.KeystrokeInput
	if req.KeystrokeStats != nil {
		raw, _ := json.Marshal(req.KeystrokeStats)
		json.Unmarshal(raw, &keystrokeStats)
	}

	var errorItems []practiceService.ErrorItemInput
	if req.ErrorItems != nil {
		raw, _ := json.Marshal(req.ErrorItems)
		json.Unmarshal(raw, &errorItems)
	}

	svcReq := practiceService.CompleteRequest{
		SessionID:      req.Id,
		UserID:         userID,
		WPM:            req.WPM,
		RawWPM:         req.RawWPM,
		Accuracy:       req.Accuracy,
		ErrorCount:     req.ErrorCount,
		CharCount:      req.CharCount,
		Consistency:    req.Consistency,
		DurationMs:     req.DurationMs,
		KeystrokeStats: keystrokeStats,
		ErrorItems:     errorItems,
	}

	result, err := c.practiceSvc.CompletePractice(ctx, svcReq)
	if err != nil {
		return nil, err
	}

	return &v1.CompleteSessionRes{
		Result:          result.Result,
		NewAchievements: result.NewAchievements,
	}, nil
}

func (c *ControllerV1) UpdateWordMastery(ctx context.Context, req *v1.UpdateWordMasteryReq) (res *v1.UpdateWordMasteryRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	item, err := c.practiceSvc.UpdateWordMasteryState(ctx, userID, req.Id, req.State)
	if err != nil {
		return nil, err
	}

	return &v1.UpdateWordMasteryRes{Item: item}, nil
}

func (c *ControllerV1) MarkWordMastered(ctx context.Context, req *v1.MarkWordMasteredReq) (res *v1.MarkWordMasteredRes, err error) {
	r := g.RequestFromCtx(ctx)
	userID := r.GetCtxVar("user_id").String()

	item, err := c.practiceSvc.MarkWordMastered(ctx, userID, req.WordID)
	if err != nil {
		return nil, err
	}

	return &v1.MarkWordMasteredRes{Item: item}, nil
}
