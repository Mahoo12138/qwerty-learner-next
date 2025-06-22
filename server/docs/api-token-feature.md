# 统一 Token 管理功能文档

## 概述

统一 Token 管理功能将用户登录会话和 API Token 整合到一个统一的系统中。这个系统使用单一的 `TokenEntity` 来管理所有类型的令牌，包括用户登录会话和第三方 API 访问令牌。

## 架构改进

### 统一 Token 实体

新的 `TokenEntity` 替代了原来的 `SessionEntity` 和 `ApiTokenEntity`，具有以下特性：

- **统一管理**: 所有令牌类型都在一个表中管理
- **类型区分**: 通过 `type` 字段区分会话令牌和 API 令牌
- **灵活配置**: 支持过期时间、名称等配置
- **使用记录**: 自动记录最后使用时间

### Token 类型

```typescript
export enum TokenType {
  SESSION = 'session',    // 用户登录会话
  API = 'api',           // API 令牌
}
```

## 功能特性

- **创建 API Token**: 用户可以创建带有名称和过期时间的 API Token
- **列出 API Tokens**: 查看用户创建的所有 API Token
- **删除 API Token**: 删除不再需要的 API Token
- **自动过期检查**: 系统会自动检查 Token 是否过期
- **使用记录**: 记录 Token 的最后使用时间
- **统一验证**: 所有令牌使用相同的验证逻辑

## API 端点

### 1. 创建 API Token

**POST** `/api/v1/auth/api-tokens`

**请求体:**
```json
{
  "name": "GitHub Integration",
  "expiresAt": "2024-12-31T23:59:59.000Z"  // 可选
}
```

**响应:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "GitHub Integration",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenExpires": 1735689599000,
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### 2. 列出 API Tokens

**GET** `/api/v1/auth/api-tokens`

**响应:**
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "GitHub Integration",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "expiresAt": "2024-12-31T23:59:59.000Z",
      "lastUsedAt": "2024-01-20T15:45:00.000Z",
      "isExpired": false
    }
  ],
  "total": 1
}
```

### 3. 删除 API Token

**DELETE** `/api/v1/auth/api-tokens/:tokenId`

## 使用方式

### 1. 创建 API Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/api-tokens \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Integration",
    "expiresAt": "2024-12-31T23:59:59.000Z"
  }'
```

### 2. 使用 API Token

API Token 的使用方式与普通访问令牌相同：

```bash
curl -X GET http://localhost:3000/api/v1/some-protected-endpoint \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## 安全特性

1. **过期时间**: 可以设置 Token 的过期时间，过期后自动失效
2. **唯一性**: 每个 Token 都有唯一的 hash 值
3. **用户隔离**: 用户只能访问自己创建的 Token
4. **使用记录**: 系统记录 Token 的最后使用时间
5. **即时失效**: 删除 Token 后立即失效
6. **类型验证**: 系统会验证 Token 类型，确保 API Token 不能用于刷新操作

## 数据库结构

### token 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| type | ENUM | 令牌类型 (session/api) |
| name | VARCHAR(255) | Token 名称/备注（仅 API 令牌） |
| hash | VARCHAR(255) | Token hash |
| user_id | UUID | 用户ID |
| expires_at | TIMESTAMPTZ | 过期时间 |
| last_used_at | TIMESTAMPTZ | 最后使用时间 |
| created_at | TIMESTAMPTZ | 创建时间 |
| created_by | VARCHAR | 创建者 |
| updated_at | TIMESTAMPTZ | 更新时间 |
| updated_by | VARCHAR | 更新者 |

### 索引

- `IDX_token_user_id`: 用户ID索引
- `IDX_token_type`: 令牌类型索引
- `IDX_token_expires_at`: 过期时间索引

## 迁移说明

### 从旧架构迁移

系统会自动将现有的 `session` 和 `api_token` 表数据迁移到新的 `token` 表：

1. **数据迁移**: 自动迁移现有数据
2. **表结构更新**: 删除旧表，使用新表
3. **向后兼容**: 保持 API 接口不变

### 迁移步骤

1. 运行 `1747147989323-create-token-table.ts` 创建新表
2. 运行 `1747147989324-migrate-session-to-token.ts` 迁移数据
3. 运行 `1747147989325-drop-old-tables.ts` 删除旧表

## 注意事项

1. API Token 与普通登录 Token 具有相同的权限
2. 删除 Token 后无法恢复，请谨慎操作
3. 建议为不同的集成创建不同的 Token，便于管理和追踪
4. Token 过期后需要重新创建，无法续期
5. 系统会自动清理过期的 Token 记录
6. 刷新令牌功能仅适用于会话类型的令牌

## 错误处理

- `401 Unauthorized`: Token 无效或已过期
- `403 Forbidden`: 权限不足
- `404 Not Found`: Token 不存在
- `400 Bad Request`: 请求参数错误

## 优势

### 统一管理
- 所有令牌在一个表中管理
- 统一的验证逻辑
- 简化的数据库结构

### 更好的性能
- 减少数据库表数量
- 优化查询性能
- 统一的索引策略

### 易于维护
- 减少代码重复
- 统一的错误处理
- 简化的测试逻辑 