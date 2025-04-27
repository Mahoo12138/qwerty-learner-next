package system

import (
	"qwerty-learner/model"
)

type JwtBlacklist struct {
	model.BaseModel
	Jwt string `gorm:"type:text;comment:jwt"`
}
