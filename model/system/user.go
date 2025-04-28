package system

import (
	"github.com/google/uuid"
	"qwerty-learner/model"
)

type Login interface {
	GetUsername() string
	GetUserId() uint
	GetUserInfo() any
	GetUserEmail() string
	GetUUID() uuid.UUID
}

var _ Login = new(User)

// Role is the type of role.
type Role string

const (
	// RoleHost is the HOST role.
	RoleHost Role = "HOST"
	// RoleAdmin is the ADMIN role.
	RoleAdmin Role = "ADMIN"
	// RoleUser is the USER role.
	RoleUser Role = "USER"
)

type User struct {
	model.Model
	UUID     uuid.UUID `json:"uuid" gorm:"index;comment:用户UUID"`                // 用户UUID
	Username string    `json:"userName" gorm:"index;comment:用户登录名"`             // 用户登录名
	Password string    `json:"-"  gorm:"comment:用户登录密码"`                        // 用户登录密码
	Avatar   string    `json:"avatar" gorm:"default:un_set;comment:用户头像"`       // 用户头像
	Email    string    `json:"email"  gorm:"comment:用户邮箱"`                      // 用户邮箱
	Role     Role      `json:"role"  gorm:"comment:用户角色"`                       // 用户角色
	Enable   int       `json:"enable" gorm:"default:1;comment:用户是否被冻结 1正常 2冻结"` //用户是否被冻结 1正常 2冻结
}

func (s User) GetUUID() uuid.UUID {
	return s.UUID
}

func (User) TableName() string {
	return "users"
}

func (s *User) GetUsername() string {
	return s.Username
}

func (s *User) GetUserId() uint {
	return s.ID
}

func (s *User) GetUserEmail() string {
	return s.Email
}

func (s *User) GetUserInfo() any {
	return *s
}
