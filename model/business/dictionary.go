package business

import (
	"qwerty-learner/model"
)

type Dictionary struct {
	model.Model
	Name     string `json:"name" gorm:"index;comment:用户登录名"` // 词典名称
	Language string `json:"language"  gorm:"comment:用户登录密码"` // 词典语言
	Public   bool   `json:"public" gorm:"comment:是否公开"`      // 是否公开
}
