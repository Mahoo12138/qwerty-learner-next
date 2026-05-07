## 前端

### 2026-05-07 — 前端变更日志与开发注意要点（由 agent 生成）

概述：记录近期前端改动与对后续开发/agent 自动化应遵循的惯例与注意事项，便于快速上手与自动化操作。

#### 变更记录
- 新增 `frontend/src/components/ui/toaster.tsx`：使用 `sonner` 封装全局 Toaster，并在 `frontend/src/main.tsx` 挂载 `<Toaster richColors closeButton />`，实现统一的全局提示样式与主题映射。

#### 关键技术/约定（供开发与 agent 使用）
- 主题与设计 token：全局主题在 `frontend/src/styles/theme.css.ts` 导出为 `vars`（例如 `vars.color.*`、`vars.shadow.*`、`vars.radius.*`），组件可直接引用 `vars` 或在渲染时将其映射为 CSS 自定义属性。
- 暗黑模式：由 `frontend/src/stores/themeStore.ts` 控制，切换通过 `document.documentElement.classList.toggle('dark', bool)` 实现，agent 修改主题时应使用 store 接口而非直接操作 DOM。
- 样式系统：项目混合使用 `vanilla-extract`（用于 design tokens 和组件样式）与实用类（Tailwind/utility）。优先在 `*.css.ts` 中定义样式与 token，避免在 TSX 中写大量内联样式。
- 组件规范：可复用组件放在 `frontend/src/components/ui`（shadcn 风格）；使用 `cva` 和 `cn` 工具以保持变体与类名一致；页面级组合组件放在 `frontend/src/components/`。
- 全局 Provider 与入口：`frontend/src/main.tsx` 注册 QueryClient、RouterProvider 等；新增全局 UI（如 Toaster）应挂载在 Provider 之下并在根处只注册一次，避免在路由内重复注册。
- 状态管理：使用 `zustand` 放在 `frontend/src/stores`；agent 或脚本应通过暴露的 hooks（如 `useThemeStore`）读写状态。
- 包管理与脚本：前端使用 `pnpm`；常用命令：`pnpm dev`、`pnpm build`、`pnpm preview`、`pnpm test:visual`。新增依赖请用 `pnpm add`，注意 CI 的 `approve-builds` 策略和构建脚本提示。
- 测试：视觉测试使用 Playwright（`frontend/tests/`），编写新组件时尽量补充 E2E/视觉用例。
- 代码风格：TypeScript 严格类型，遵循现有路径与命名约定；组件文件名与导出保持一致，避免默认导出造成查找困难。

#### Agent 自动化要点（Checklist）
- 新增或修改全局组件：
	1. 在 `frontend/src/components/ui` 新建组件文件（遵循组件规范）；
	2. 如需样式 token，先在 `frontend/src/styles/theme.css.ts` 增加或映射到 `vars`；
	3. 安装依赖后在 `frontend/src/main.tsx` 挂载一次（全局），并运行 `pnpm build` 或 `pnpm dev` 做快速 smoke test；
	4. 在变更日志与 repo memory 中记录修改点与使用说明。
- 读取 token 的约定：优先使用 `vars.color.*`、`vars.shadow.*` 等命名，若需要在 Tailwind arbitrary 中使用，映射成 CSS 变量 `--xxx` 再用 `var(--xxx)`。
- 自动化补丁（agent 操作）建议：使用精确的 apply_patch 更新文件（保持最小改动），随后运行 `pnpm build` 验证编译无误，最后可追加 changelog 与更新 memory。

#### 注意事项（常见陷阱）
- 不要在多个地方重复挂载 Provider 或全局组件（如 Toaster），会导致重复提示或 context 冲突。
- 对设计 token 的名称变更会影响大量组件，慎重修改并同步更新 `vars` 与使用处。
- 新增依赖和本地构建脚本可能触发 `approve-builds`，CI 环境中需预先处理或记录在变更日志中。

----

## 后端

### 2026-05-07 — 后端变更日志与开发注意要点（由 agent 生成）

概述：总结后端实现的技术栈、运行/部署约定、代码结构与 agent 自动化注意事项，便于开发与自动化工具保持一致。

#### 关键技术栈与实现要点
- 框架：使用 GoFrame（`github.com/gogf/gf/v2`）作为 HTTP 服务及路由框架，入口逻辑位于 `internal/cmd/cmd.go`（通过 `g.Server()`、`group.Bind()` 等方式注册路由）。
- 数据库与 ORM：使用 GORM（`gorm.io/gorm`），支持 `sqlite`（`github.com/glebarez/sqlite`）和 `postgres`（`gorm.io/driver/postgres`）。数据库初始化在 `utility/db`，由 `Init(driver, dsn)` 负责打开连接并运行迁移。
- 迁移：使用 `pressly/goose`，迁移文件放在 `migrations/*.sql` 并通过 `migrations.FS` embed 到二进制，`utility/db.RunMigrations` 在启动时执行 `goose.Up`（注意 goose dialect 在 sqlite 下为 `sqlite3`）。
- 代码分层：
	- API 类型定义在 `api/*/v1`（使用 `g.Meta` 标注 path/method/validation），
	- 控制器在 `internal/controller/*`（实现 GoFrame Bind 风格方法），
	- 业务逻辑在 `internal/service/*`（接收 `*gorm.DB` 与依赖），
	- 数据模型在 `internal/model/entity`（GORM struct + `TableName()`）、错误码定义在 `internal/model/code`。
- 认证/鉴权：采用 JWT（HS256）和 refresh-token 机制；refresh token 以 HttpOnly cookie 存储（路径 `/api/v1/auth/refresh`）。支持前缀 `tp_` 的 API token（由 openapi service 提供验证器）。中间件位于 `internal/middleware`（JWT、CORS、RateLimit、UploadSizeLimit、统一响应包装等）。
- 静态资源与嵌入：前端产物通过 `resource` 包 embed（`resource.Frontend`），后端在非 API 路由上提供 SPA fallback（优先返回真实静态文件，否则返回 `index.html`）。系统声音等也通过 `resource.Sounds` 嵌入并在启动时 seed。
- 错误与响应约定：控制器/服务通过 `gerror` 与自定义 `code` 返回错误；中间件统一将响应封装为 {code, message, data} 结构并通过 `WriteJsonExit` 终止处理链。
- 日志/配置：默认配置位于 `manifest/config/config.yaml`（server、database、jwt、logger 等）；生产环境请注入/覆盖敏感配置（不要在仓库中泄露 `jwt.secret`）。日志使用 GoFrame glog，可在配置中控制级别与输出。
- 构建与运行：开发可使用 `make dev`（`go run main.go`），生产构建使用 `make build`（交叉编译参数已写入 Makefile），镜像构建使用 `make docker` 或 `docker build`。测试主要通过 `go test`（Makefile 已列出常用 target）。

#### 后端 Agent 自动化清单（Checklist）
- 修改/新增 API：
	1. 在 `api/<area>/v1` 定义新的请求/响应结构并使用 `g.Meta` 标注；
	2. 在 `internal/controller` 添加或更新控制器方法并绑定到路由组；
	3. 在 `internal/service` 添加业务实现并注入到 `internal/cmd/cmd.go` 的服务初始化处；
	4. 如变更 DB schema，新增 `migrations/` 下的 SQL 文件（按 goose 版本号前缀），并验证 `goose.Up` 在本地 sqlite 下可运行。
- 依赖管理：使用 `go get`（或 `go install` / `go work`）来添加 Go 依赖，注意更新 `go.mod` 与 `go.sum` 并在 CI 中验证 `go mod tidy`。自动化脚本应在变更后执行 `go test` 与 `make build` 做 smoke test。
- 数据库与迁移：优先通过 SQL migration（`migrations/*.sql`）而非直接 ORM 自动迁移，agent 在修改模型字段或表结构前需编写对应 migration，并在本地用 `goose` 验证。
- 配置与秘密：不要在变更中提交明文密钥。默认 `manifest/config/config.yaml` 仅作开发参考；生产部署请使用环境变量或外部 secret 管理。
- 静态资源：前端发布产物需要放入 `frontend/dist` 并通过 `resource` embed（`embed` 指令），变更后需要重新运行 `go build` 打包二进制以包含新资源。

#### 注意事项与常见陷阱
- API 兼容性：不要在不增版本的情况下破坏已有 API（若有破坏性更改，新增版本目录如 `v2` 并同时保留旧版本）。
- 实体/表名与迁移：模型字段类型或主键类型变更需要严格的迁移步骤；GORM 的 `SingularTable: true` 与 `TableName()` 的显式返回需要保持一致。
- 启动迁移风险：`utility/db.RunMigrations` 在启动时会执行 `goose.Up`，生产部署需谨慎（在可控窗口内运行迁移或通过专门迁移步骤执行）。
- 并发与资源：上传与大文件处理通过 `UploadSizeLimit` 中间件限制（默认在路由组设置为 10MB），对大媒体处理请使用流式处理并考虑 CDN/外部存储。
- Admin 权限：管理接口被 `AdminOnly` 中间件保护，确保角色判断逻辑与权限分配一致。

----

