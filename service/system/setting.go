package system

import (
	"qwerty-learner/global"
	"qwerty-learner/model/system"
)

type SettingService struct{}

func (settingService *SettingService) GetSystemSettingList() (list []system.SystemSetting, err error) {
	db := global.QL_DB.Model(&system.SystemSetting{})
	var systemSettings []system.SystemSetting

	// 不需要分页参数，直接查询所有记录
	err = db.Find(&systemSettings).Error
	if err != nil {
		return nil, err
	}
	return systemSettings, nil
}
