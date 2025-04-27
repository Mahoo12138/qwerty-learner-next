package router

import (
	"qwerty-learner/router/business"
	"qwerty-learner/router/system"
)

var RouterGroupApp = new(RouterGroup)

type RouterGroup struct {
	System   system.RouterGroup
	Business business.RouterGroup
}
