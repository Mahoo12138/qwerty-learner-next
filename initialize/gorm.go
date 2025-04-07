package initialize

import (
	"os"
	"qwerty-learner/model/business"

	"qwerty-learner/global"
	"qwerty-learner/model/system"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

func Gorm() *gorm.DB {
	switch global.QL_CONFIG.System.DbType {
	case "mysql":
		global.QL_ACTIVE_DBNAME = &global.QL_CONFIG.Mysql.Dbname
		return GormMysql()
	case "pgsql":
		global.QL_ACTIVE_DBNAME = &global.QL_CONFIG.Pgsql.Dbname
		return GormPgSql()
	case "sqlite":
		global.QL_ACTIVE_DBNAME = &global.QL_CONFIG.Sqlite.Dbname
		return GormSqlite()
	default:
		global.QL_ACTIVE_DBNAME = &global.QL_CONFIG.Sqlite.Dbname
		return GormSqlite()
	}
}

func RegisterTables() {
	db := global.QL_DB
	err := db.AutoMigrate(

		system.User{},
		business.Dictionary{},
		// system.SysApi{},
		// system.SysIgnoreApi{},
		// system.SysBaseMenu{},
		// system.JwtBlacklist{},
		// system.SysAuthority{},
		// system.SysDictionary{},
		// system.SysOperationRecord{},
		// system.SysAutoCodeHistory{},
		// system.SysDictionaryDetail{},
		// system.SysBaseMenuParameter{},
		// system.SysBaseMenuBtn{},
		// system.SysAuthorityBtn{},
		// system.SysAutoCodePackage{},
		// system.SysExportTemplate{},
		// system.Condition{},
		// system.JoinTemplate{},
		// system.SysParams{},
	)
	if err != nil {
		global.QL_LOG.Error("register table failed", zap.Error(err))
		os.Exit(0)
	}

	err = bizModel()

	if err != nil {
		global.QL_LOG.Error("register biz_table failed", zap.Error(err))
		os.Exit(0)
	}
	global.QL_LOG.Info("register table success")
}

func bizModel() error {
	db := global.QL_DB
	err := db.AutoMigrate()
	if err != nil {
		return err
	}
	return nil
}
