package system

import "qwerty-learner/service"

type ApiGroup struct {
	//DBApi
	//JwtApi
	BaseApi
	SettingApi
	//CasbinApi
	//AutoCodeApi
	//SystemApiApi
	//AuthorityApi
	//DictionaryApi
	//AuthorityMenuApi
	//OperationRecordApi
	//DictionaryDetailApi
	//AuthorityBtnApi
	//SysExportTemplateApi
	//AutoCodePluginApi
	//AutoCodePackageApi
	//AutoCodeHistoryApi
	//AutoCodeTemplateApi
	//SysParamsApi
}

var (
	// apiService              = service.ServiceGroupApp.SystemServiceGroup.ApiService
	jwtService = service.ServiceGroupApp.SystemServiceGroup.JwtService

	// menuService             = service.ServiceGroupApp.SystemServiceGroup.MenuService
	// initDBService           = service.ServiceGroupApp.SystemServiceGroup.InitDBService
	userService    = service.ServiceGroupApp.SystemServiceGroup.UserService
	settingService = service.ServiceGroupApp.SystemServiceGroup.SettingService
	// casbinService           = service.ServiceGroupApp.SystemServiceGroup.CasbinService
	// baseMenuService         = service.ServiceGroupApp.SystemServiceGroup.BaseMenuService
	// authorityService        = service.ServiceGroupApp.SystemServiceGroup.AuthorityService
	// dictionaryService       = service.ServiceGroupApp.SystemServiceGroup.DictionaryService
	// authorityBtnService     = service.ServiceGroupApp.SystemServiceGroup.AuthorityBtnService
	// systemConfigService     = service.ServiceGroupApp.SystemServiceGroup.SystemConfigService
	// sysParamsService        = service.ServiceGroupApp.SystemServiceGroup.SysParamsService
	operationRecordService = service.ServiceGroupApp.SystemServiceGroup.OperationRecordService
	// dictionaryDetailService = service.ServiceGroupApp.SystemServiceGroup.DictionaryDetailService
	// autoCodeService         = service.ServiceGroupApp.SystemServiceGroup.AutoCodeService
	// autoCodePluginService   = service.ServiceGroupApp.SystemServiceGroup.AutoCodePlugin
	// autoCodePackageService  = service.ServiceGroupApp.SystemServiceGroup.AutoCodePackage
	// autoCodeHistoryService  = service.ServiceGroupApp.SystemServiceGroup.AutoCodeHistory
	// autoCodeTemplateService = service.ServiceGroupApp.SystemServiceGroup.AutoCodeTemplate
)
