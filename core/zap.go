package core

import (
	"fmt"
	"os"

	"qwerty-learner/core/internal"
	"qwerty-learner/global"
	"qwerty-learner/utils"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Zap 函数用于初始化并返回一个 *zap.Logger 实例
// 该函数会根据 global.QL_CONFIG.Zap 的配置创建日志目录、设置日志级别以及组合多个日志核心（Core）
// 如果配置中启用了显示调用行号的功能，还会为 Logger 添加调用者信息选项
func Zap() (logger *zap.Logger) {
	// 检查 global.QL_CONFIG.Zap.Director 指定的日志目录是否存在，如果不存在则创建该目录
	if ok, _ := utils.PathExists(global.QL_CONFIG.Zap.Director); !ok {
		fmt.Printf("create %v directory\n", global.QL_CONFIG.Zap.Director)
		_ = os.Mkdir(global.QL_CONFIG.Zap.Director, os.ModePerm)
	}
	// 获取所有需要输出的日志级别
	levels := global.QL_CONFIG.Zap.Levels()
	length := len(levels)
	cores := make([]zapcore.Core, 0, length)

	// 遍历每个日志级别，为每个级别创建一个对应的 zapcore.Core 实例，并将其添加到 cores 切片中
	for i := range length {
		core := internal.NewZapCore(levels[i])
		cores = append(cores, core)
	}
	// 使用 zapcore.NewTee 将所有 Core 实例组合在一起，生成最终的 Logger 实例
	logger = zap.New(zapcore.NewTee(cores...))

	// 如果配置中启用了 ShowLine（显示调用行号），则为 Logger 添加调用者信息选项
	if global.QL_CONFIG.Zap.ShowLine {
		logger = logger.WithOptions(zap.AddCaller())
	}

	// 返回配置完成的 Logger 实例
	return logger
}
