# 用户管理模块日志

**日期：** 2026-05-06
**状态：** ✅ 已完成
**关联规格：** 第 6.3 节 users 表 role 字段（`user` | `admin` | `owner`）

---

## 本次核心设计

1. 新增 `owner` 用户角色，比 `admin` 拥有更高权限：
   - 可创建 admin 和 user 账号（admin 只能创建 user）
   - 可对 admin 账号进行禁用、角色变更和删除（admin 不可）
2. 初始管理员注册时角色设为 `owner`（此前为 `admin`）。
3. 在设置页面新增「用户管理」面板，仅对 `admin` 和 `owner` 可见。
4. 管理功能：新建用户、禁用/启用账号、角色升降级（owner 专属）、删除账号。

---

## 权限矩阵

| 操作 | owner | admin | user |
|---|---|---|---|
| 查看用户列表 | ✅ | ✅ | ❌ |
| 新建 admin 账号 | ✅ | ❌ | ❌ |
| 新建 user 账号 | ✅ | ✅ | ❌ |
| 禁用/启用 admin 账号 | ✅ | ❌ | ❌ |
| 禁用/启用 user 账号 | ✅ | ✅ | ❌ |
| 变更用户角色 | ✅（非 owner） | ❌ | ❌ |
| 删除 admin 账号 | ✅ | ❌ | ❌ |
| 删除 user 账号 | ✅ | ✅ | ❌ |
| 删除 owner 账号 | ❌ | ❌ | ❌ |
| 修改自身账号 | ❌（管理面板） | ❌（管理面板） | ❌ |

---

## 关键实现

### 数据库迁移

- `migrations/000018_add_owner_role.sql`
  - 将 `system.owner_user_id` 指向的用户角色从 `admin` 升级为 `owner`
  - Down migration 反向降级

### 后端

- `internal/service/auth/auth_impl.go`
  - `RegisterInitialAdmin`：初始管理员角色改为 `"owner"`
- `internal/middleware/jwt.go`
  - `AdminOnly`：扩展为同时允许 `admin` 和 `owner` 通过
  - 新增 `OwnerOnly` 中间件（供未来扩展使用）
- `api/admin/v1/admin.go`
  - 新增 `CreateUserReq/Res`：`POST /admin/users`
  - 新增 `DeleteUserReq/Res`：`DELETE /admin/users/{id}`
- `api/admin/admin.go`
  - 接口定义新增 `CreateUser`、`DeleteUser`
- `internal/controller/admin/admin_v1.go`
  - 实现 `CreateUser`：检查 callerRole，owner 可建 admin，admin 只能建 user
  - 实现 `DeleteUser`：自我保护 + 角色层级检查
  - 更新 `UpdateUser`：同样加入角色层级保护逻辑

### 前端

- `frontend/src/types/api.ts`
  - `User.role` 类型扩展为 `'user' | 'admin' | 'owner'`
- `frontend/src/api/admin.ts`（新建）
  - `useAdminUsers`：获取用户列表
  - `useCreateAdminUser`：新建用户
  - `useUpdateAdminUser`：更新状态/角色
  - `useDeleteAdminUser`：删除用户
- `frontend/src/pages/settings/SettingsPage.tsx`
  - `isPrivileged` 变量：`admin` 或 `owner` 均为特权用户
  - 侧边栏新增「用户管理」入口（`user-accounts`），标注 Admin 徽章
  - 顶部角色 Badge 新增「所有者模式」显示
  - 新增 `UserAccountsSection` 组件：
    - 用户列表（名称、用户名、邮箱、角色、状态、注册时间）
    - 「新建用户」对话框（owner 可选角色，admin 只能建 user）
    - 每行下拉菜单：禁用/启用、角色变更（owner 专属）、删除
    - 自身账号不显示操作菜单（`isSelf` 保护）
