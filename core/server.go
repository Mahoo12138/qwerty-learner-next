package core

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"qwerty-learner/global"
	"qwerty-learner/initialize"
	"qwerty-learner/service/system"
	"time"

	"go.uber.org/zap"
)

type server interface {
	ListenAndServe() error
}

func RunWindowsServer() {

	// 从 db 加载 jwt 数据
	if global.QL_DB != nil {
		system.LoadAll()
	}

	Router := initialize.Routers()

	address := fmt.Sprintf(":%d", global.QL_CONFIG.System.Addr)
	s := initServer(address, Router)

	global.QL_LOG.Info("server run success on ", zap.String("address", address))

	fmt.Printf(`
	默认文档地址: http://127.0.0.1%s/swagger/index.html
	默认前端地址: http://127.0.0.1%s
`, address, address)
	global.QL_LOG.Error(s.ListenAndServe().Error())
}

func initServer(address string, router *gin.Engine) server {
	return &http.Server{
		Addr:           address,
		Handler:        router,
		ReadTimeout:    10 * time.Minute,
		WriteTimeout:   10 * time.Minute,
		MaxHeaderBytes: 1 << 20,
	}
}
