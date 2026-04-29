package admin

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/google/uuid"
	"gorm.io/gorm"

	v1 "taptype/api/admin/v1"
	"taptype/internal/model/code"
	"taptype/internal/model/entity"
	"taptype/utility/crypto"
)

func (c *ControllerV1) ListUsers(ctx context.Context, req *v1.ListUsersReq) (res *v1.ListUsersRes, err error) {
	page := req.Page
	pageSize := req.PageSize
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var total int64
	c.db.WithContext(ctx).Model(&entity.User{}).Count(&total)

	var users []entity.User
	if err = c.db.WithContext(ctx).Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&users).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	return &v1.ListUsersRes{
		List:     users,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

func (c *ControllerV1) CreateUser(ctx context.Context, req *v1.CreateUserReq) (res *v1.CreateUserRes, err error) {
	r := g.RequestFromCtx(ctx)
	callerRole := r.GetCtxVar("role").String()

	// Only owner may create admin accounts
	if req.Role == "admin" && callerRole != "owner" {
		return nil, gerror.NewCode(code.CodeForbidden, "only owner can create admin accounts")
	}
	// Neither admin nor owner can create owner accounts via this endpoint
	if req.Role == "owner" {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot create owner accounts")
	}

	hash, err := crypto.HashPassword(req.Password)
	if err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, "failed to hash password")
	}

	user := &entity.User{
		ID:           uuid.New().String(),
		Username:     req.Username,
		Nickname:     "用户" + req.Username,
		Email:        req.Email,
		PasswordHash: hash,
		Role:         req.Role,
		IsActive:     1,
	}
	if err = c.db.WithContext(ctx).Create(user).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": user})
	return
}

func (c *ControllerV1) UpdateUser(ctx context.Context, req *v1.UpdateUserReq) (res *v1.UpdateUserRes, err error) {
	r := g.RequestFromCtx(ctx)
	callerID := r.GetCtxVar("user_id").String()
	callerRole := r.GetCtxVar("role").String()

	var user entity.User
	if err = c.db.WithContext(ctx).Where("id = ?", req.Id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, gerror.NewCode(code.CodeNotFound, "user not found")
		}
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	// Prevent self-modification of role/active status
	if req.Id == callerID {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot modify your own account via admin panel")
	}
	// Admin cannot modify another admin or owner
	if callerRole == "admin" && (user.Role == "admin" || user.Role == "owner") {
		return nil, gerror.NewCode(code.CodeForbidden, "admin cannot modify admin or owner accounts")
	}
	// Owner cannot modify another owner
	if callerRole == "owner" && user.Role == "owner" {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot modify another owner account")
	}

	updates := map[string]interface{}{}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}
	if req.Role != nil {
		// Admin can only assign 'user' role; owner can assign 'user' or 'admin'
		allowedRoles := map[string]bool{"user": true}
		if callerRole == "owner" {
			allowedRoles["admin"] = true
		}
		if !allowedRoles[*req.Role] {
			return nil, gerror.NewCode(code.CodeForbidden, "insufficient permission to assign this role")
		}
		updates["role"] = *req.Role
	}

	if len(updates) > 0 {
		if err = c.db.WithContext(ctx).Model(&user).Updates(updates).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
	}

	c.db.WithContext(ctx).First(&user, "id = ?", req.Id)
	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": user})
	return
}

func (c *ControllerV1) DeleteUser(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error) {
	r := g.RequestFromCtx(ctx)
	callerID := r.GetCtxVar("user_id").String()
	callerRole := r.GetCtxVar("role").String()

	if req.Id == callerID {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot delete your own account")
	}

	var user entity.User
	if err = c.db.WithContext(ctx).Where("id = ?", req.Id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, gerror.NewCode(code.CodeNotFound, "user not found")
		}
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	// Admin cannot delete admin or owner accounts
	if callerRole == "admin" && (user.Role == "admin" || user.Role == "owner") {
		return nil, gerror.NewCode(code.CodeForbidden, "admin cannot delete admin or owner accounts")
	}
	// Owner cannot delete another owner
	if callerRole == "owner" && user.Role == "owner" {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot delete another owner account")
	}

	if err = c.db.WithContext(ctx).Delete(&user).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	r.Response.WriteJsonExit(g.Map{"code": 0, "message": "success", "data": nil})
	return
}



func (c *ControllerV1) ListPublicWordBanks(ctx context.Context, req *v1.ListPublicWordBanksReq) (res *v1.ListPublicWordBanksRes, err error) {
	page := req.Page
	pageSize := req.PageSize
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var total int64
	c.db.WithContext(ctx).Model(&entity.WordBank{}).Where("is_public = 1").Count(&total)

	var banks []entity.WordBank
	if err = c.db.WithContext(ctx).Where("is_public = 1").
		Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&banks).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	return &v1.ListPublicWordBanksRes{
		List:     banks,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

func (c *ControllerV1) ListPublicSentenceBanks(ctx context.Context, req *v1.ListPublicSentenceBanksReq) (res *v1.ListPublicSentenceBanksRes, err error) {
	page := req.Page
	pageSize := req.PageSize
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var total int64
	c.db.WithContext(ctx).Model(&entity.SentenceBank{}).Where("is_public = 1").Count(&total)

	var banks []entity.SentenceBank
	if err = c.db.WithContext(ctx).Where("is_public = 1").
		Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&banks).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	return &v1.ListPublicSentenceBanksRes{
		List:     banks,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}
