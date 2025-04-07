package global

import (
	"sync"

	"github.com/gin-gonic/gin"

	"github.com/songzhibin97/gkit/cache/local_cache"

	// "golang.org/x/sync/singleflight"

	"go.uber.org/zap"

	"qwerty-learner/config"

	"github.com/spf13/viper"
	"gorm.io/gorm"
)

var (
	QL_DB     *gorm.DB
	QL_DBList map[string]*gorm.DB

	QL_CONFIG config.Server
	QL_VP     *viper.Viper
	QL_LOG    *zap.Logger
	// QL_Timer               timer.Timer = timer.NewTimerTask()
	// QL_Concurrency_Control             = &singleflight.Group{}
	QL_ROUTERS       gin.RoutesInfo
	QL_ACTIVE_DBNAME *string
	BlackCache       local_cache.Cache
	lock             sync.RWMutex
)
