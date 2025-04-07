package service

import (
	"qwerty-learner/service/business"
	"qwerty-learner/service/system"
)

var ServiceGroupApp = new(ServiceGroup)

type ServiceGroup struct {
	SystemServiceGroup  system.ServiceGroup
	ExampleServiceGroup business.ServiceGroup
}
