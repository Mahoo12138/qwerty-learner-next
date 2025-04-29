package main

import (
	"qwerty-learner/core"
	"qwerty-learner/global"
	"qwerty-learner/initialize"

	"go.uber.org/zap"
)

func main() {
	// 初始化 Viper
	global.QL_VP = core.Viper()
	// 初始化 zap 日志库
	global.QL_LOG = core.Zap()

	zap.ReplaceGlobals(global.QL_LOG)
	// gorm 连接数据库
	global.QL_DB = initialize.Gorm()

	initialize.OtherInit()
	initialize.DBList()

	if global.QL_DB != nil {
		// 初始化表
		initialize.RegisterTables()
		// 程序结束前关闭数据库链接
		db, _ := global.QL_DB.DB()
		defer db.Close()
	}
	core.RunWindowsServer()
}
