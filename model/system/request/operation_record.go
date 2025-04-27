package request

import (
	"qwerty-learner/model/common/request"
	"qwerty-learner/model/system"
)

type OperationRecordSearch struct {
	system.OperationRecord
	request.PageInfo
}
