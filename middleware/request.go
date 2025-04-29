package middleware

import (
	"net/http"
	"qwerty-learner/model/common/response"

	"github.com/gin-gonic/gin"
)

func RequestBodyChecker() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 只处理需要请求体的方法
		if hasRequestBody(c.Request.Method) {
			// 基于Content-Length快速失败
			if c.Request.ContentLength == 0 {
				response.FailWithMessage("请求体不能为空2", c)
				c.Abort()
				return
			}
		}
		c.Next()
	}
}

// 判断是否需要校验请求体
func hasRequestBody(method string) bool {
	switch method {
	case http.MethodPost, http.MethodPut, http.MethodPatch:
		return true
	default:
		return false
	}
}
