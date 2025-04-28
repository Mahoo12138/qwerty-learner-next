package system

import "qwerty-learner/model"

type SystemSetting struct {
	model.BaseModel
	Name string `json:"name"`
	// Value is a JSON string with basic value.
	Value       string `json:"value"`
	Description string `json:"description"`
}

type UserSetting struct {
	model.BaseModel
	UserID uint   `json:"userId"`
	Key    string `json:"key"`
	Value  string `json:"value"`
}
