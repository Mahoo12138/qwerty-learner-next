package request

import (
	common "qwerty-learner/model/common/request"
)

// SignUp User register structure
type SignUp struct {
	Username string `json:"userName" example:"用户名"`
	Password string `json:"passWord" example:"密码"`
	Avatar   string `json:"avatar" example:"头像"`
	Role     string `json:"role" example:"用户角色"`
	Email    string `json:"email" example:"电子邮箱"`
}

// Login User login structure
type Login struct {
	Username  string `json:"username"`  // 用户名
	Password  string `json:"password"`  // 密码
	Captcha   string `json:"captcha"`   // 验证码
	CaptchaId string `json:"captchaId"` // 验证码ID
}

// ChangePasswordReq Modify password structure
type ChangePasswordReq struct {
	ID          uint   `json:"-"`           // 从 JWT 中提取 user id，避免越权
	Password    string `json:"password"`    // 密码
	NewPassword string `json:"newPassword"` // 新密码
}

// SetUserAuth Modify user's auth structure
type SetUserAuth struct {
	AuthorityId uint `json:"authorityId"` // 角色ID
}

// SetUserAuthorities Modify user's auth structure
type SetUserAuthorities struct {
	ID           uint
	AuthorityIds []uint `json:"authorityIds"` // 角色ID
}

type ChangeUserInfo struct {
	ID       uint   `gorm:"primarykey"`                                                                            // 主键ID
	Phone    string `json:"phone"  gorm:"comment:用户手机号"`                                                      // 用户手机号
	Role     string `json:"role" gorm:"-"`                                                                         // 角色
	Email    string `json:"email"  gorm:"comment:用户邮箱"`                                                        // 用户邮箱
	Avatar   string `json:"avatar" gorm:"default:https://qmplusimg.henrongyi.top/gva_header.jpg;comment:用户头像"` // 用户头像
	SideMode string `json:"sideMode"  gorm:"comment:用户侧边主题"`                                                 // 用户侧边主题
	Enable   int    `json:"enable" gorm:"comment:冻结用户"`                                                        //冻结用户
}

type GetUserList struct {
	common.PageInfo
	Username string `json:"username" form:"username"`
	Phone    string `json:"phone" form:"phone"`
	Email    string `json:"email" form:"email"`
}
