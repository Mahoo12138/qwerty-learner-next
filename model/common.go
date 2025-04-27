package model

import (
	"time"

	"gorm.io/gorm"
)

type Model struct {
	BaseModel
	ID        uint `gorm:"primarykey" json:"ID"` // 主键ID
	CreatedBy uint // 创建人
	UpdatedBy uint // 更新人
	DeletedBy uint `json:"-"` // 删除人
}

type BaseModel struct {
	ID        uint           `gorm:"primarykey" json:"ID"` // 主键ID
	CreatedAt time.Time      // 创建时间
	UpdatedAt time.Time      // 更新时间
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // 删除时间
}
