package system

import (
	"go.uber.org/zap"

	"qwerty-learner/global"
	"qwerty-learner/model/system"
)

type JwtService struct{}

var JwtServiceApp = new(JwtService)

func (jwtService *JwtService) JsonInBlacklist(jwtList system.JwtBlacklist) (err error) {
	err = global.QL_DB.Create(&jwtList).Error
	if err != nil {
		return
	}
	global.BlackCache.SetDefault(jwtList.Jwt, struct{}{})
	return
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: IsBlacklist
//@description: 判断JWT是否在黑名单内部
//@param: jwt string
//@return: bool

func (jwtService *JwtService) IsBlacklist(jwt string) bool {
	_, ok := global.BlackCache.Get(jwt)
	return ok
	// err := global.QL_DB.Where("jwt = ?", jwt).First(&system.JwtBlacklist{}).Error
	// isNotFound := errors.Is(err, gorm.ErrRecordNotFound)
	// return !isNotFound
}

//@function: GetRedisJWT
//@description: 从redis取jwt
//@param: userName string
//@return: redisJWT string, err error

//func (jwtService *JwtService) GetRedisJWT(userName string) (redisJWT string, err error) {
//	redisJWT, err = global.QL_REDIS.Get(context.Background(), userName).Result()
//	return redisJWT, err
//}

//@function: SetRedisJWT
//@description: jwt存入redis并设置过期时间
//@param: jwt string, userName string
//@return: err error

//func (jwtService *JwtService) SetRedisJWT(jwt string, userName string) (err error) {
//	// 此处过期时间等于jwt过期时间
//	dr, err := utils.ParseDuration(global.QL_CONFIG.JWT.ExpiresTime)
//	if err != nil {
//		return err
//	}
//	timer := dr
//	err = global.QL_REDIS.Set(context.Background(), userName, jwt, timer).Err()
//	return err
//}

func LoadAll() {
	var data []string
	err := global.QL_DB.Model(&system.JwtBlacklist{}).Select("jwt").Find(&data).Error
	if err != nil {
		global.QL_LOG.Error("加载数据库 jwt 黑名单失败!", zap.Error(err))
		return
	}
	for i := 0; i < len(data); i++ {
		global.BlackCache.SetDefault(data[i], struct{}{})
	} // jwt 黑名单 加入 BlackCache 中
}
