package business

import (
	api "qwerty-learner/api/v1"
)

type RouterGroup struct {
	DictionaryRouter
}

var (
	dictionaryApi = api.ApiGroupApp.BusinessApiGroup.DictionaryApi
)
