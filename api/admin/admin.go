package admin

import (
	"context"

	v1 "taptype/api/admin/v1"
)

type IAdminV1 interface {
	ListUsers(ctx context.Context, req *v1.ListUsersReq) (res *v1.ListUsersRes, err error)
	CreateUser(ctx context.Context, req *v1.CreateUserReq) (res *v1.CreateUserRes, err error)
	UpdateUser(ctx context.Context, req *v1.UpdateUserReq) (res *v1.UpdateUserRes, err error)
	DeleteUser(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error)
	ListPublicWordBanks(ctx context.Context, req *v1.ListPublicWordBanksReq) (res *v1.ListPublicWordBanksRes, err error)
	ListPublicSentenceBanks(ctx context.Context, req *v1.ListPublicSentenceBanksReq) (res *v1.ListPublicSentenceBanksRes, err error)
}
