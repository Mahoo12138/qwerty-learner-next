package system

import (
	"errors"
	"gorm.io/gorm"
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

func (settingService *SettingService) UpsertSystemSetting(s system.SystemSetting) (result system.SystemSetting, err error) {
	var existing system.SystemSetting
	// 使用 Name 字段作为唯一标识进行查询
	db := global.QL_DB.Where("name = ?", s.Name).First(&existing)

	// 处理存在性检查错误（非"记录不存在"类型的错误）
	if err := db.Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return result, err
	}

	// 记录存在则更新，不存在则创建
	if errors.Is(db.Error, gorm.ErrRecordNotFound) {
		err = global.QL_DB.Create(&s).Error
		return s, err
	} else {
		updates := map[string]interface{}{
			"Value": s.Value,
		}
		// 只有当新描述不为空时更新该字段
		if s.Description != "" {
			updates["Description"] = s.Description
		}
		// 更新核心字段并记录更新时间
		err = global.QL_DB.Model(&existing).
			Select("UpdatedAt", "Value", "Description").
			Updates(updates).Error
		return existing, err
	}
}

func (settingService *SettingService) GetUserSettingList(userID uint) (list []system.UserSetting, err error) {
	db := global.QL_DB.Model(&system.UserSetting{}).Where("user_id =?", userID)
	var userSettings []system.UserSetting
	// 不需要分页参数，直接查询所有记录
	err = db.Find(&userSettings).Error
	if err != nil {
		return nil, err
	}
	return userSettings, nil
}

func (settingService *SettingService) UpsertUserSetting(s system.UserSetting) (result system.UserSetting, err error) {
	var existing system.UserSetting
	// 使用 UserID 和 Name 字段作为唯一标识进行查询
	db := global.QL_DB.Where("user_id =? AND name =?", s.UserID, s.Name).First(&existing)
	// 处理存在性检查错误（非"记录不存在"类型的错误）
	if err := db.Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return result, err
	}
	// 记录存在则更新，不存在则创建
	if errors.Is(db.Error, gorm.ErrRecordNotFound) {
		err = global.QL_DB.Create(&s).Error
		return s, err
	} else {
		updates := map[string]interface{}{
			"Value": s.Value,
		}
		// 只有当新描述不为空时更新该字段
		if s.Description != "" {
			updates["Description"] = s.Description
		}
		// 更新核心字段并记录更新时间
		err = global.QL_DB.Model(&existing).
			Select("UpdatedAt", "Value", "Description").
			Updates(updates).Error
		return existing, err
	}
}
