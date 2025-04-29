package model

import (
	"time"

	"gorm.io/gorm"
)

type Model struct {
	BaseModel
	CreatedBy uint `json:"createdBy"` // 创建人
	UpdatedBy uint `json:"updatedBy"` // 更新人
	DeletedBy uint `json:"-"`         // 删除人
}

type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"id"` // 主键ID
	CreatedAt time.Time      `json:"createdAt"`            // 创建时间
	UpdatedAt time.Time      `json:"updatedAt"`            // 更新时间
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`       // 删除时间
}
