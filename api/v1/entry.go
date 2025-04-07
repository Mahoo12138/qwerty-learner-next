package v1

import (
	//"qwerty-learner/api/v1/business"
	"qwerty-learner/api/v1/system"
)

var ApiGroupApp = new(ApiGroup)

type ApiGroup struct {
	SystemApiGroup system.ApiGroup
	//ExampleApiGroup business.ApiGroup
}
