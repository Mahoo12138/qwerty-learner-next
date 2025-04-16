package business

import "qwerty-learner/service"

type ApiGroup struct {
	DictionaryApi
}

var (
	dictionaryApi = service.ServiceGroupApp.BusinessServiceGroup.DictionaryService
)
