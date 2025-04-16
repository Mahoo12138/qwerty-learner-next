package initialize

import (
	"net/http"
	"os"
	"qwerty-learner/middleware"

	"github.com/swaggo/swag/example/basic/docs"

	// "qwerty-learner/docs"
	"qwerty-learner/global"
	//"qwerty-learner/middleware"
	"qwerty-learner/router"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type justFilesFilesystem struct {
	fs http.FileSystem
}

func (fs justFilesFilesystem) Open(name string) (http.File, error) {
	f, err := fs.fs.Open(name)
	if err != nil {
		return nil, err
	}

	stat, err := f.Stat()
	if stat.IsDir() {
		return nil, os.ErrPermission
	}

	return f, nil
}

// 初始化总路由

func Routers() *gin.Engine {
	// 创建 Gin 引擎实例（不包含默认中间件）
	Router := gin.New()
	// 添加全局 Recovery 中间件（捕获 panic ）
	Router.Use(gin.Recovery())
	// 开发模式时添加 Logger 中间件（请求日志）
	if gin.Mode() == gin.DebugMode {
		Router.Use(gin.Logger())
	}

	// 系统路由组初始化
	// 业务路由组初始化
	systemRouter := router.RouterGroupApp.System
	businessRouter := router.RouterGroupApp.Business

	// ---------- 静态资源服务配置 ----------
	// 如果想要不使用nginx代理前端网页，可以修改 web/.env.production 下的
	// VUE_APP_BASE_API = /
	// VUE_APP_BASE_PATH = http://localhost
	// 然后执行打包命令 npm run build。在打开下面3行注释
	// Router.Static("/favicon.ico", "./dist/favicon.ico")
	// Router.Static("/assets", "./dist/assets")   // dist里面的静态资源
	// Router.StaticFile("/", "./dist/index.html") // 前端网页入口页面

	// ---------- 扩展功能配置 ----------
	// 本地存储服务
	// Router.StaticFS(global.QL_CONFIG.Local.StorePath, justFilesFilesystem{http.Dir(global.QL_CONFIG.Local.StorePath)})
	// HTTPS支持
	// 需要 core/server.go 将启动模式变更为 Router.RunTLS("端口","你的cre/pem文件","你的key文件")
	// Router.Use(middleware.LoadTls())
	// 跨域，如需跨域可以打开下面的注释
	// Router.Use(middleware.Cors()) // 直接放行全部跨域请求
	// Router.Use(middleware.CorsByRules()) // 按照配置的规则放行跨域请求
	// global.QL_LOG.Info("use middleware cors")

	// 配置 Swagger 文档基础路径
	docs.SwaggerInfo.BasePath = global.QL_CONFIG.System.RouterPrefix
	// 注册 Swagger 路由（/swagger/*any）
	Router.GET(global.QL_CONFIG.System.RouterPrefix+"/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	global.QL_LOG.Info("register swagger handler")

	// ---------- 方便统一添加路由组前缀 多服务器上线使用 -----------

	// 创建带统一前缀的公共路由组（无需鉴权）
	PublicGroup := Router.Group(global.QL_CONFIG.System.RouterPrefix)
	// 创建带统一前缀的私有路由组（需鉴权）
	PrivateGroup := Router.Group(global.QL_CONFIG.System.RouterPrefix)

	// 为私有路由组添加 JWT 鉴权中间件
	PrivateGroup.Use(middleware.JWTAuth())
	//.Use(middleware.CasbinHandler())

	// ---------- 公共路由注册 ----------
	{
		// 健康检查端点（HTTP 200返回"ok"）
		PublicGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, "ok")
		})
	}
	{
		// 注册基础系统路由（无需鉴权）
		systemRouter.InitBaseRouter(PublicGroup)
		//systemRouter.InitInitRouter(PublicGroup) // 自动初始化相关
	}

	// ---------- 私有路由注册 ----------
	//{
	//	systemRouter.InitApiRouter(PrivateGroup, PublicGroup)               // 注册功能api路由
	//	systemRouter.InitJwtRouter(PrivateGroup)                            // jwt相关路由
	//	systemRouter.InitUserRouter(PrivateGroup)                           // 注册用户路由
	//	systemRouter.InitMenuRouter(PrivateGroup)                           // 注册menu路由
	//	systemRouter.InitSystemRouter(PrivateGroup)                         // system相关路由
	//	systemRouter.InitCasbinRouter(PrivateGroup)                         // 权限相关路由
	//	systemRouter.InitAutoCodeRouter(PrivateGroup, PublicGroup)          // 创建自动化代码
	//	systemRouter.InitAuthorityRouter(PrivateGroup)                      // 注册角色路由
	//	systemRouter.InitSysDictionaryRouter(PrivateGroup)                  // 字典管理
	//	systemRouter.InitAutoCodeHistoryRouter(PrivateGroup)                // 自动化代码历史
	//	systemRouter.InitSysOperationRecordRouter(PrivateGroup)             // 操作记录
	//	systemRouter.InitSysDictionaryDetailRouter(PrivateGroup)            // 字典详情管理
	//	systemRouter.InitAuthorityBtnRouterRouter(PrivateGroup)             // 按钮权限管理
	//	systemRouter.InitSysExportTemplateRouter(PrivateGroup, PublicGroup) // 导出模板
	//	systemRouter.InitSysParamsRouter(PrivateGroup, PublicGroup)         // 参数管理
	//
	//}

	{
		businessRouter.InitDictionaryRouter(PrivateGroup)
	}

	////插件路由安装
	//InstallPlugin(PrivateGroup, PublicGroup, Router)
	//
	//// 注册业务路由
	//initBizRouter(PrivateGroup, PublicGroup)

	global.QL_ROUTERS = Router.Routes()

	global.QL_LOG.Info("router register success")
	return Router
}
