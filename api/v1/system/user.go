package system

import (
	"errors"
	"io"
	"time"

	"qwerty-learner/global"
	"qwerty-learner/model/common/response"
	"qwerty-learner/model/system"
	systemReq "qwerty-learner/model/system/request"
	systemRes "qwerty-learner/model/system/response"
	"qwerty-learner/utils"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func (api *BaseApi) Login(c *gin.Context) {
	var l systemReq.Login
	err := c.ShouldBindJSON(&l)
	key := c.ClientIP()

	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = utils.Verify(l, utils.LoginVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	// 判断验证码是否开启
	openCaptcha := global.QL_CONFIG.Captcha.OpenCaptcha               // 是否开启防爆次数
	openCaptchaTimeOut := global.QL_CONFIG.Captcha.OpenCaptchaTimeOut // 缓存超时时间
	v, ok := global.BlackCache.Get(key)
	if !ok {
		global.BlackCache.Set(key, 1, time.Second*time.Duration(openCaptchaTimeOut))
	}

	var oc bool = openCaptcha == 0 || openCaptcha < interfaceToInt(v)

	if !oc || (l.CaptchaId != "" && l.Captcha != "" && store.Verify(l.CaptchaId, l.Captcha, true)) {
		u := &system.User{Username: l.Username, Password: l.Password}
		user, err := userService.Login(u)
		if err != nil {
			global.QL_LOG.Error("登陆失败! 用户名不存在或者密码错误!", zap.Error(err))
			// 验证码次数+1
			global.BlackCache.Increment(key, 1)
			response.FailWithMessage("用户名不存在或者密码错误", c)
			return
		}
		if user.Enable != 1 {
			global.QL_LOG.Error("登陆失败! 用户被禁止登录!")
			// 验证码次数+1
			global.BlackCache.Increment(key, 1)
			response.FailWithMessage("用户被禁止登录", c)
			return
		}
		api.TokenNext(c, *user)
		return
	}
	// 验证码次数+1
	global.BlackCache.Increment(key, 1)
	response.FailWithMessage("验证码错误", c)
}

func (api *BaseApi) SignUp(c *gin.Context) {
	var r systemReq.SignUp
	err := c.ShouldBindJSON(&r)
	if err != nil {
		if errors.Is(err, io.EOF) {
			// 新增空请求体判断
			response.FailWithMessage("请求体不能为空", c)
			return
		}
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = utils.Verify(r, utils.SignupVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}

	user := &system.User{Username: r.Username, Password: r.Password, Role: "host", Email: r.Email, Enable: 1}
	userReturn, err := userService.Register(*user)
	if err != nil {
		global.QL_LOG.Error("注册失败!", zap.Error(err))
		response.FailWithDetailed(systemRes.UserResponse{User: userReturn}, "注册失败", c)
		return
	}
	response.OkWithDetailed(systemRes.UserResponse{User: userReturn}, "注册成功", c)
}

func (api *BaseApi) TokenNext(c *gin.Context, user system.User) {
	token, claims, err := utils.LoginToken(&user)
	if err != nil {
		global.QL_LOG.Error("获取 token 失败!", zap.Error(err))
		response.FailWithMessage("获取 token 失败", c)
		return
	}
	utils.SetToken(c, token, int(claims.RegisteredClaims.ExpiresAt.Unix()-time.Now().Unix()))
	response.OkWithDetailed(systemRes.LoginResponse{
		User:      user,
		Token:     token,
		ExpiresAt: claims.RegisteredClaims.ExpiresAt.Unix() * 1000,
	}, "登录成功", c)
}

// GetUserList
// @Tags      SysUser
// @Summary   分页获取用户列表
// @Security  ApiKeyAuth
// @accept    application/json
// @Produce   application/json
// @Param     data  body      systemReq.GetUserList                                        true  "页码, 每页大小"
// @Success   200   {object}  response.Response{data=response.PageResult,msg=string}  "分页获取用户列表,返回包括列表,总数,页码,每页数量"
// @Router    /user/getUserList [post]
func (api *BaseApi) GetUserList(c *gin.Context) {
	var pageInfo systemReq.GetUserList
	err := c.ShouldBindJSON(&pageInfo)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	err = utils.Verify(pageInfo, utils.PageInfoVerify)
	if err != nil {
		response.FailWithMessage(err.Error(), c)
		return
	}
	list, total, err := userService.GetUserInfoList(pageInfo)
	if err != nil {
		global.QL_LOG.Error("获取失败!", zap.Error(err))
		response.FailWithMessage("获取失败", c)
		return
	}
	response.OkWithDetailed(response.PageResult{
		List:     list,
		Total:    total,
		Page:     pageInfo.Page,
		PageSize: pageInfo.PageSize,
	}, "获取成功", c)
}
