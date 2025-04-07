package main

import (
	"qwerty-learner/core"
	"qwerty-learner/global"
	"qwerty-learner/initialize"

	"go.uber.org/zap"
)

func main() {
	global.QL_VP = core.Viper() // 初始化 Viper
	global.QL_LOG = core.Zap()  // 初始化 zap 日志库
	zap.ReplaceGlobals(global.QL_LOG)
	global.QL_DB = initialize.Gorm() // gorm 连接数据库

	initialize.DBList()

	if global.QL_DB != nil {
		initialize.RegisterTables() // 初始化表
		// 程序结束前关闭数据库链接
		db, _ := global.QL_DB.DB()
		defer db.Close()
	}
	core.RunWindowsServer()
}
