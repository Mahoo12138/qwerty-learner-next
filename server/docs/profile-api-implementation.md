# Profile API 实现文档

## 概述

在现有的 `system/user` 模块中添加了用户 Profile 管理相关的 API 接口，包括获取用户信息、更新用户信息和修改密码功能。

## 实现位置

选择在 `system/user` 模块中添加 Profile 功能，原因如下：

1. **功能分类**: 用户信息管理属于系统级功能，不是业务逻辑
2. **代码复用**: 利用现有的用户实体和服务
3. **架构一致性**: 保持 API 结构的统一性
4. **维护便利**: 避免创建新的模块，减少复杂性

## 新增的 DTO

### 1. UpdateProfileReqDto
```typescript
export class UpdateProfileReqDto {
  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @StringFieldOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;
}
```

### 2. ChangePasswordReqDto
```typescript
export class ChangePasswordReqDto {
  @StringField()
  @IsString()
  currentPassword: string;

  @StringField()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
```

## 新增的 Service 方法

### 1. getProfile(userId: Uuid)
- 获取当前用户的完整信息
- 返回 UserResDto 格式的数据

### 2. updateProfile(userId: Uuid, updateProfileDto: UpdateProfileReqDto)
- 更新用户信息
- 包含用户名和邮箱唯一性验证
- 返回更新后的用户信息

### 3. changePassword(userId: Uuid, changePasswordDto: ChangePasswordReqDto)
- 修改用户密码
- 验证当前密码的正确性
- 使用 argon2 进行密码哈希

## 新增的 Controller 端点

### 1. GET /api/v1/users/profile
```typescript
@Get('profile')
async getProfile(@CurrentUser('id') userId: Uuid): Promise<UserResDto>
```
- 获取当前用户的 Profile 信息
- 需要用户认证

### 2. PUT /api/v1/users/profile
```typescript
@Put('profile')
async updateProfile(
  @CurrentUser('id') userId: Uuid,
  @Body() updateProfileDto: UpdateProfileReqDto,
): Promise<UserResDto>
```
- 更新用户 Profile 信息
- 支持部分字段更新
- 需要用户认证

### 3. POST /api/v1/users/change-password
```typescript
@Post('change-password')
async changePassword(
  @CurrentUser('id') userId: Uuid,
  @Body() changePasswordDto: ChangePasswordReqDto,
): Promise<void>
```
- 修改用户密码
- 需要验证当前密码
- 需要用户认证

## 安全考虑

### 1. 认证和授权
- 所有 Profile 相关接口都需要用户认证
- 使用 `@CurrentUser('id')` 装饰器获取当前用户 ID
- 用户只能操作自己的 Profile

### 2. 数据验证
- 使用 class-validator 进行输入验证
- 用户名和邮箱长度限制
- 密码最小长度要求

### 3. 唯一性检查
- 更新用户名时检查唯一性
- 更新邮箱时检查唯一性
- 避免数据冲突

### 4. 密码安全
- 使用 argon2 进行密码哈希
- 验证当前密码的正确性
- 自动调用 BeforeUpdate 钩子进行密码哈希

## 错误处理

### 1. 验证错误
- 使用 ValidationException 处理验证错误
- 返回标准的错误码和消息

### 2. 业务错误
- E001: 用户名或邮箱已存在
- E002: 当前密码错误

### 3. 系统错误
- 数据库连接错误
- 密码哈希错误

## API 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "bio": "string",
    "image": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "error message",
  "errorCode": "E001"
}
```

## 前端集成

### 1. API 路径
- 获取 Profile: `GET /api/v1/users/profile`
- 更新 Profile: `PUT /api/v1/users/profile`
- 修改密码: `POST /api/v1/users/change-password`

### 2. 类型定义
- 前端使用 TypeScript 接口定义
- 与后端 DTO 保持一致

### 3. 错误处理
- 统一的错误处理机制
- 用户友好的错误提示

## 测试建议

### 1. 单元测试
- Service 方法的单元测试
- DTO 验证的单元测试
- 错误处理的单元测试

### 2. 集成测试
- API 端点的集成测试
- 认证和授权的测试
- 数据库操作的测试

### 3. E2E 测试
- 完整的用户流程测试
- 前端和后端的集成测试

## 未来扩展

### 1. 功能增强
- 头像上传功能
- 两步验证设置
- 登录历史查看

### 2. 性能优化
- 缓存用户信息
- 批量操作支持
- 数据库查询优化

### 3. 安全增强
- 密码强度检查
- 登录尝试限制
- 异常行为检测

## 总结

通过在现有的 `system/user` 模块中添加 Profile 功能，我们实现了：

1. **代码复用**: 利用现有的用户实体和服务
2. **架构一致性**: 保持 API 结构的统一
3. **功能完整**: 提供完整的用户信息管理功能
4. **安全可靠**: 包含完善的认证、授权和验证机制
5. **易于维护**: 清晰的代码结构和文档

这个实现为前端 Profile 页面提供了完整的后端支持，确保了系统的稳定性和可维护性。 