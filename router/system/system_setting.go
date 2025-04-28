package system

import (
	"github.com/gin-gonic/gin"
)

type SettingRouter struct{}

func (s *SettingRouter) InitSettingRouter(Router *gin.RouterGroup) {
	systemSettingRouter := Router.Group("system")

	systemSettingRouter.GET("/setting", settingApi.GetSystemSettingList)
	systemSettingRouter.POST("/setting", settingApi.CreateSystemSetting)

	userSettingRouter := Router.Group("user")

	userSettingRouter.GET("/setting", settingApi.GetUserSettingList)
	userSettingRouter.POST("/setting", settingApi.CreateUserSetting)
}
