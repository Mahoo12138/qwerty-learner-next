package request

import "qwerty-learner/utils/validate"

type UpsertSystemSettingRequest struct {
	Name        string `json:"name"`
	Value       string `json:"value"`
	Description string `json:"description"`
}

func (r UpsertSystemSettingRequest) ValidationRules() validate.Rules {
	return validate.Rules{
		"Name":  {validate.NotEmpty()},
		"Value": {validate.NotEmpty()},
	}
}

type UpsertUserSettingRequest struct {
	UserID      uint   `json:"-"`
	Name        string `json:"name"`
	Value       string `json:"value"`
	Description string `json:"description"`
}

func (r UpsertUserSettingRequest) ValidationRules() validate.Rules {
	return validate.Rules{
		//"UserID": {validate.NotEmpty()},
		"Name":  {validate.NotEmpty()},
		"Value": {validate.NotEmpty()},
	}
}
