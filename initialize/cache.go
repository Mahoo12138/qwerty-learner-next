package initialize

import (
	"github.com/songzhibin97/gkit/cache/local_cache"
	"qwerty-learner/global"
	"qwerty-learner/utils"
)

func OtherInit() {
	dr, err := utils.ParseDuration(global.QL_CONFIG.JWT.ExpiresTime)
	if err != nil {
		panic(err)
	}
	_, err = utils.ParseDuration(global.QL_CONFIG.JWT.BufferTime)
	if err != nil {
		panic(err)
	}

	global.BlackCache = local_cache.NewCache(
		local_cache.SetDefaultExpire(dr),
	)
	//file, err := os.Open("go.mod")
	//if err == nil && global.QL_CONFIG.AutoCode.Module == "" {
	//	scanner := bufio.NewScanner(file)
	//	scanner.Scan()
	//	global.QL_CONFIG.AutoCode.Module = strings.TrimPrefix(scanner.Text(), "module ")
	//}
}
