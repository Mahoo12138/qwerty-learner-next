package system

import (
	"qwerty-learner/global"
	"qwerty-learner/model/common/request"
	"qwerty-learner/model/system"
	systemReq "qwerty-learner/model/system/request"
)

// OperationRecordService
// @description: 创建记录
// @param: OperationRecord model.OperationRecord
// @return: err error

type OperationRecordService struct{}

var OperationRecordServiceApp = new(OperationRecordService)

func (operationRecordService *OperationRecordService) CreateOperationRecord(OperationRecord system.OperationRecord) (err error) {
	err = global.QL_DB.Create(&OperationRecord).Error
	return err
}

// DeleteOperationRecordByIds
// @description: 批量删除记录
// @param: ids request.IdsReq
// @return: err error
func (operationRecordService *OperationRecordService) DeleteOperationRecordByIds(ids request.IdsReq) (err error) {
	err = global.QL_DB.Delete(&[]system.OperationRecord{}, "id in (?)", ids.Ids).Error
	return err
}

// DeleteOperationRecord
// @description: 删除操作记录
// @param: OperationRecord model.OperationRecord
// @return: err error
func (operationRecordService *OperationRecordService) DeleteOperationRecord(OperationRecord system.OperationRecord) (err error) {
	err = global.QL_DB.Delete(&OperationRecord).Error
	return err
}

// GetOperationRecord
// @description: 根据id获取单条操作记录
// @param: id uint
// @return: OperationRecord system.OperationRecord, err error
func (operationRecordService *OperationRecordService) GetOperationRecord(id uint) (OperationRecord system.OperationRecord, err error) {
	err = global.QL_DB.Where("id = ?", id).First(&OperationRecord).Error
	return
}

// GetOperationRecordInfoList
// @description: 分页获取操作记录列表
// @param: info systemReq.OperationRecordSearch
// @return: list interface{}, total int64, err error
func (operationRecordService *OperationRecordService) GetOperationRecordInfoList(info systemReq.OperationRecordSearch) (list interface{}, total int64, err error) {
	limit := info.PageSize
	offset := info.PageSize * (info.Page - 1)
	// 创建db
	db := global.QL_DB.Model(&system.OperationRecord{})
	var OperationRecords []system.OperationRecord
	// 如果有条件搜索 下方会自动创建搜索语句
	if info.Method != "" {
		db = db.Where("method = ?", info.Method)
	}
	if info.Path != "" {
		db = db.Where("path LIKE ?", "%"+info.Path+"%")
	}
	if info.Status != 0 {
		db = db.Where("status = ?", info.Status)
	}
	err = db.Count(&total).Error
	if err != nil {
		return
	}
	err = db.Order("id desc").Limit(limit).Offset(offset).Preload("User").Find(&OperationRecords).Error
	return OperationRecords, total, err
}
