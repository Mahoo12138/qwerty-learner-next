package system

import (
	"github.com/gin-gonic/gin"
	"qwerty-learner/model/common/response"
	"qwerty-learner/model/system"
	"qwerty-learner/utils"
)

type SettingApi struct{}

func (a *SettingApi) GetSystemSettingList(c *gin.Context) {
	userID := utils.GetUserID(c)
	user, err := userService.FindUserById(userID)
	if err != nil {
		response.FailWithMessage("Failed to find user", c)
		return
	}
	if user == nil || user.Role != system.RoleHost {
		response.FailWithMessage("Unauthorized", c)
		return
	}
	list, err := settingService.GetSystemSettingList()
	if err != nil {
		response.FailWithMessage("Failed to find system setting list", c)
		return
	}

	response.OkWithDetailed(list, "获取成功", c)
}

func (a *SettingApi) CreateSystemSetting(c *gin.Context) {

}

func (a *SettingApi) GetUserSettingList(c *gin.Context) {

}

func (a *SettingApi) CreateUserSetting(c *gin.Context) {

}
