package internal

import (
	"qwerty-learner/config"
	"qwerty-learner/global"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var Gorm = new(_gorm)

type _gorm struct{}

// Config gorm 自定义配置
// Author [SliverHorn](https://github.com/SliverHorn)
func (g *_gorm) Config(prefix string, singular bool) *gorm.Config {
	var general config.GeneralDB
	switch global.QL_CONFIG.System.DbType {
	case "mysql":
		general = global.QL_CONFIG.Mysql.GeneralDB
	case "pgsql":
		general = global.QL_CONFIG.Pgsql.GeneralDB
	case "sqlite":
		general = global.QL_CONFIG.Sqlite.GeneralDB
	default:
		general = global.QL_CONFIG.Mysql.GeneralDB
	}
	return &gorm.Config{
		Logger: logger.New(NewWriter(general), logger.Config{
			SlowThreshold: 200 * time.Millisecond,
			LogLevel:      general.LogLevel(),
			Colorful:      true,
		}),
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   prefix,
			SingularTable: singular,
		},
		DisableForeignKeyConstraintWhenMigrating: true,
	}
}
