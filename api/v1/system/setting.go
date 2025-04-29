package system

import (
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"qwerty-learner/global"
	"qwerty-learner/model/common/response"
	"qwerty-learner/model/system"
	"qwerty-learner/model/system/request"
	"qwerty-learner/utils"
	"qwerty-learner/utils/validate"
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

func (a *SettingApi) UpsertSystemSetting(c *gin.Context) {
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
	var s request.UpsertSystemSettingRequest

	err = c.ShouldBindJSON(&s)

	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	err = validate.Verify(s)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	setting := &system.SystemSetting{Name: s.Name, Value: s.Value, Description: s.Description}

	settingReturn, err := settingService.UpsertSystemSetting(*setting)
	if err != nil {
		global.QL_LOG.Error("添加失败!", zap.Error(err))
		response.FailWithDetailed(settingReturn, "添加失败", c)
		return
	}
	response.OkWithDetailed(settingReturn, "添加成功", c)
}

func (a *SettingApi) GetUserSettingList(c *gin.Context) {
	userID := utils.GetUserID(c)
	user, err := userService.FindUserById(userID)
	if err != nil {
		response.FailWithMessage("Failed to find user", c)
		return
	}
	if user == nil {
		response.FailWithMessage("Unauthorized", c)
		return
	}
	list, err := settingService.GetUserSettingList(userID)
	if err != nil {
		response.FailWithMessage("Failed to find user setting list", c)
		return
	}
	response.OkWithDetailed(list, "获取成功", c)
}

func (a *SettingApi) UpsertUserSetting(c *gin.Context) {
	userID := utils.GetUserID(c)
	user, err := userService.FindUserById(userID)
	if err != nil {
		response.FailWithMessage("Failed to find user", c)
		return
	}
	if user == nil {
		response.FailWithMessage("Unauthorized", c)
		return
	}
	var s request.UpsertUserSettingRequest
	err = c.ShouldBindJSON(&s)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = validate.Verify(s)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	setting := &system.UserSetting{UserID: userID, Name: s.Name, Value: s.Value, Description: s.Description}
	settingReturn, err := settingService.UpsertUserSetting(*setting)
	if err != nil {
		global.QL_LOG.Error("添加失败!", zap.Error(err))
		response.FailWithDetailed(settingReturn, "添加失败", c)
		return
	}
	response.OkWithDetailed(settingReturn, "添加成功", c)
}
