package system

import (
	"errors"
	"fmt"
	"qwerty-learner/model/common"
	systemReq "qwerty-learner/model/system/request"
	"time"

	"qwerty-learner/global"
	"qwerty-learner/model/system"
	"qwerty-learner/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct{}

var UserServiceApp = new(UserService)

// Register
// @function: Register
// @description: 用户注册
// @param: u model.User
// @return: userInter system.User, err error
func (userService *UserService) Register(u system.User) (userInter system.User, err error) {
	var user system.User
	// 判断用户名是否注册
	if !errors.Is(global.QL_DB.Where("username = ?", u.Username).First(&user).Error, gorm.ErrRecordNotFound) {
		return userInter, errors.New("用户名已注册")
	}
	// 否则 密码 hash 加密 注册
	u.Password = utils.BcryptHash(u.Password)
	// 附加 uuid
	//u.UUID = uuid.New()
	err = global.QL_DB.Create(&u).Error
	return u, err
}

// Login
// @function: Login
// @description: 用户登录
// @param: u *model.User
// @return: err error, userInter *model.User
func (userService *UserService) Login(u *system.User) (userInter *system.User, err error) {
	if nil == global.QL_DB {
		return nil, fmt.Errorf("db not init")
	}

	var user system.User
	err = global.QL_DB.Where("username = ?", u.Username).First(&user).Error
	if err == nil {
		if ok := utils.BcryptCheck(u.Password, user.Password); !ok {
			return nil, errors.New("密码错误")
		}
		//MenuServiceApp.UserAuthorityDefaultRouter(&user)
	}
	return &user, err
}

// ChangePassword
// @function: ChangePassword
// @description: 修改用户密码
// @param: u *model.User, newPassword string
// @return: userInter *model.User,err error
func (userService *UserService) ChangePassword(u *system.User, newPassword string) (userInter *system.User, err error) {
	var user system.User
	if err = global.QL_DB.Where("id = ?", u.ID).First(&user).Error; err != nil {
		return nil, err
	}
	if ok := utils.BcryptCheck(u.Password, user.Password); !ok {
		return nil, errors.New("原密码错误")
	}
	user.Password = utils.BcryptHash(newPassword)
	err = global.QL_DB.Save(&user).Error
	return &user, err

}

// GetUserInfoList
// @function: GetUserInfoList
// @description: 分页获取数据
// @param: info request.PageInfo
// @return: err error, list interface{}, total int64
func (userService *UserService) GetUserInfoList(info systemReq.GetUserList) (list interface{}, total int64, err error) {
	limit := info.PageSize
	offset := info.PageSize * (info.Page - 1)
	db := global.QL_DB.Model(&system.User{})
	var userList []system.User

	if info.Phone != "" {
		db = db.Where("phone LIKE ?", "%"+info.Phone+"%")
	}
	if info.Username != "" {
		db = db.Where("username LIKE ?", "%"+info.Username+"%")
	}
	if info.Email != "" {
		db = db.Where("email LIKE ?", "%"+info.Email+"%")
	}

	err = db.Count(&total).Error
	if err != nil {
		return
	}
	err = db.Limit(limit).Offset(offset).Find(&userList).Error
	return userList, total, err
}

// SetUserRole
// @function: SetUserRole
// @description: 设置用户角色
// @param: id unit, role string
// @return: err error
func (userService *UserService) SetUserRole(id uint, role string) (err error) {
	return global.QL_DB.Model(&system.User{}).
		Select("updated_at", "username", "header_img", "role", "email", "enable").
		Where("id=?", id).
		Updates(map[string]interface{}{
			"updated_at": time.Now(),
			"role":       role,
		}).Error
}

// DeleteUser
// @function: DeleteUser
// @description: 删除用户
// @param: id float64
// @return: err error
func (userService *UserService) DeleteUser(id int) (err error) {
	return global.QL_DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", id).Delete(&system.User{}).Error; err != nil {
			return err
		}
		//if err := tx.Delete(&[]system.UserAuthority{}, "sys_user_id = ?", id).Error; err != nil {
		//	return err
		//}
		return nil
	})
}

// SetUserInfo
// @function: SetUserInfo
// @description: 设置用户信息
// @param: reqUser model.User
// @return: err error, user model.User
func (userService *UserService) SetUserInfo(req system.User) error {
	return global.QL_DB.Model(&system.User{}).
		Select("updated_at", "avatar", "role", "email", "enable").
		Where("id=?", req.ID).
		Updates(map[string]interface{}{
			"updated_at": time.Now(),
			"avatar":     req.Avatar,
			"role":       req.Role,
			"email":      req.Email,
			"enable":     req.Enable,
		}).Error
}

//@author: [piexlmax](https://github.com/piexlmax)
//@function: SetSelfInfo
//@description: 设置用户信息
//@param: reqUser model.User
//@return: err error, user model.User

func (userService *UserService) SetSelfInfo(req system.User) error {
	return global.QL_DB.Model(&system.User{}).
		Where("id=?", req.ID).
		Updates(req).Error
}

//@function: SetSelfSetting
//@description: 设置用户配置
//@param: req datatypes.JSON, uid uint
//@return: err error

func (userService *UserService) SetSelfSetting(req common.JSONMap, uid uint) error {
	return global.QL_DB.Model(&system.User{}).Where("id = ?", uid).Update("origin_setting", req).Error
}

//@function: GetUserInfo
//@description: 获取用户信息
//@param: uuid uuid.UUID
//@return: err error, user system.User

func (userService *UserService) GetUserInfo(uuid uuid.UUID) (user system.User, err error) {
	var reqUser system.User
	err = global.QL_DB.First(&reqUser, "uuid = ?", uuid).Error
	if err != nil {
		return reqUser, err
	}
	return reqUser, err
}

//@author: [SliverHorn](https://github.com/SliverHorn)
//@function: FindUserById
//@description: 通过id获取用户信息
//@param: id int
//@return: err error, user *model.User

func (userService *UserService) FindUserById(id int) (user *system.User, err error) {
	var u system.User
	err = global.QL_DB.Where("id = ?", id).First(&u).Error
	return &u, err
}

// FindUserByUuid
// @function: FindUserByUuid
// @description: 通过uuid获取用户信息
// @param: uuid string
// @return: err error, user *model.User
func (userService *UserService) FindUserByUuid(uuid string) (user *system.User, err error) {
	var u system.User
	if err = global.QL_DB.Where("uuid = ?", uuid).First(&u).Error; err != nil {
		return &u, errors.New("用户不存在")
	}
	return &u, nil
}

// ResetPassword
// @function: ResetPassword
// @description: 修改用户密码
// @param: ID uint
// @return: err error
func (userService *UserService) ResetPassword(ID uint) (err error) {
	err = global.QL_DB.Model(&system.User{}).Where("id = ?", ID).Update("password", utils.BcryptHash("123456")).Error
	return err
}
