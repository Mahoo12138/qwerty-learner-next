package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type ListUsersReq struct {
	g.Meta   `path:"/admin/users" method:"get" tags:"Admin" summary:"List all users"`
	Page     int `json:"page"      in:"query" d:"1"`
	PageSize int `json:"page_size" in:"query" d:"20"`
}
type ListUsersRes struct {
	List     interface{} `json:"list"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
}

type CreateUserReq struct {
	g.Meta   `path:"/admin/users" method:"post" tags:"Admin" summary:"Create a new user"`
	Username string `json:"username" v:"required|length:3,32"`
	Email    string `json:"email"    v:"required|email"`
	Password string `json:"password" v:"required|length:8,64"`
	Role     string `json:"role"     v:"required|in:user,admin" d:"user"`
}
type CreateUserRes struct{}

type UpdateUserReq struct {
	g.Meta   `path:"/admin/users/{id}" method:"put" tags:"Admin" summary:"Update user"`
	Id       string  `json:"id" in:"path"`
	IsActive *int    `json:"is_active"`
	Role     *string `json:"role"`
}
type UpdateUserRes struct{}

type DeleteUserReq struct {
	g.Meta `path:"/admin/users/{id}" method:"delete" tags:"Admin" summary:"Delete user"`
	Id     string `json:"id" in:"path"`
}
type DeleteUserRes struct{}

type ListPublicWordBanksReq struct {
	g.Meta   `path:"/admin/word-banks" method:"get" tags:"Admin" summary:"List public word banks"`
	Page     int `json:"page"      in:"query" d:"1"`
	PageSize int `json:"page_size" in:"query" d:"20"`
}
type ListPublicWordBanksRes struct {
	List     interface{} `json:"list"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
}

type ListPublicSentenceBanksReq struct {
	g.Meta   `path:"/admin/sentence-banks" method:"get" tags:"Admin" summary:"List public sentence banks"`
	Page     int `json:"page"      in:"query" d:"1"`
	PageSize int `json:"page_size" in:"query" d:"20"`
}
type ListPublicSentenceBanksRes struct {
	List     interface{} `json:"list"`
	Total    int64       `json:"total"`
	Page     int         `json:"page"`
	PageSize int         `json:"page_size"`
}
