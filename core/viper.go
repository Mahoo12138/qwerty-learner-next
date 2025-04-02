package core

import (
	"flag"
	"fmt"
	"os"

	"qwerty-learner/core/internal"

	"github.com/gin-gonic/gin"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/viper"

	"qwerty-learner/global"
)

// Viper 函数用于初始化配置文件，并监视配置文件的更改。
// 参数 path 是一个可变参数，用于指定配置文件的路径。
// 返回值是一个指向 viper.Viper 实例的指针，用于后续的配置文件操作。
// 优先级: 命令行 > 环境变量 > 默认值
func Viper(path ...string) *viper.Viper {
	var config string

	// 如果没有提供配置文件路径，则通过命令行参数、环境变量或默认值来获取配置文件路径。
	if len(path) == 0 {
		flag.StringVar(&config, "c", "", "choose config file.")
		flag.Parse()
		if config == "" { // 判断命令行参数是否为空
			if configEnv := os.Getenv(internal.ConfigEnv); configEnv == "" { // 判断 internal.ConfigEnv 常量存储的环境变量是否为空
				switch gin.Mode() {
				case gin.DebugMode:
					config = internal.ConfigDefaultFile
				case gin.ReleaseMode:
					config = internal.ConfigReleaseFile
				case gin.TestMode:
					config = internal.ConfigTestFile
				}
				fmt.Printf("正在使用 gin 模式的 %s 环境名称, config 的路径为 %s\n", gin.Mode(), config)
			} else { // internal.ConfigEnv 常量存储的环境变量不为空 将值赋值于config
				config = configEnv
				fmt.Printf("正在使用 %s 环境变量, config 的路径为 %s\n", internal.ConfigEnv, config)
			}
		} else { // 命令行参数不为空 将值赋值于config
			fmt.Printf("正在使用命令行的 -c 参数传递的值, config 的路径为%s\n", config)
		}
	} else { // 函数传递的可变参数的第一个值赋值于config
		config = path[0]
		fmt.Printf("正在使用 func Viper() 传递的值, config 的路径为%s\n", config)
	}

	v := viper.New()
	v.SetConfigFile(config)
	v.SetConfigType("yaml")
	err := v.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}
	v.WatchConfig()

	v.OnConfigChange(func(e fsnotify.Event) {
		fmt.Println("config file changed:", e.Name)
		if err = v.Unmarshal(&global.QL_CONFIG); err != nil {
			fmt.Println(err)
		}
	})
	if err = v.Unmarshal(&global.QL_CONFIG); err != nil {
		panic(err)
	}

	return v
}
