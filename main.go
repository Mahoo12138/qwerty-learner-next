package main

import (
	"qwerty-learner/core"
	"qwerty-learner/global"

	"go.uber.org/zap"
)

func main() {
	global.QL_VP = core.Viper() // 初始化Viper
	global.QL_LOG = core.Zap()  // 初始化zap日志库
	zap.ReplaceGlobals(global.QL_LOG)
}
