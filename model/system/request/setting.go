package request

type UpsertSystemSettingRequest struct {
	Name        string `json:"name"`
	Value       string `json:"value"`
	Description string `json:"description"`
}

type UpsertUserSettingRequest struct {
	UserID uint   `json:"-"`
	Key    string `json:"key"`
	Value  string `json:"value"`
}
