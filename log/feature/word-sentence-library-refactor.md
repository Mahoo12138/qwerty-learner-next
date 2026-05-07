# 词库 / 句库订阅与词级掌握度改造日志

**日期：** 2026-05-06  
**状态：** ✅ 已完成（一期后端闭环）  
**对应方案：** 词库句库文章库建模（只读订阅 + 词级掌握度）

---

## 本次落地范围

1. 新增 `library_subscriptions`，支持词库 / 句库 / 文章库的统一只读订阅。
2. 新增 `user_word_mastery`，仅在词库练习完成时按 `(user_id, lang, word_norm)` 聚合更新。
3. 修复练习会话创建时未校验库可见性的缺口，私有词库 / 句库不再可被绕过直接练习。
4. 词库补充 `language` 字段，为 mastery 的 `lang` 维度提供稳定来源。
5. 历史练习与订阅不再因作者关公开或删词而直接丢失展示上下文。

---

## 关键实现

### 数据库迁移

- `migrations/000019_add_library_subscriptions_and_word_mastery.sql`
  - `word_banks` 新增 `language`
  - 新建 `library_subscriptions`
  - 新建 `user_word_mastery`
  - 补充订阅与 mastery 索引

### 后端服务

- `internal/service/library/library.go`
  - 新增统一订阅服务：列表、订阅、取消订阅
  - 订阅时校验目标库存在，且必须是 `owner` 或公开库
  - 订阅列表保留失效源库，并返回不可用状态供 UI 标记
- `internal/service/practice/practice.go`
  - `CreateSession` 新增 source access 校验
  - 历史会话读取改为包含已软删词；极端缺失时回放返回占位内容
  - `CompletePractice` 在事务内同步 `user_word_mastery`
- `internal/service/practice/mastery.go`
  - 新增单词规范化逻辑
  - mastery 聚合读取包含已软删词，避免作者删词后掌握度更新断掉
  - 同拼写不同 `word_id` 在 mastery 侧合并
- `internal/service/errors/errors_impl.go`
  - 错题内容读取包含已软删词，极端缺失时返回占位文案
- `internal/model/entity/content.go`
  - `words` 增加 `deleted_at`，词删除改为软删语义

### API 与控制器

- 新增 `GET /api/v1/library-subscriptions`
- 新增 `POST /api/v1/library-subscriptions`
- 新增 `DELETE /api/v1/library-subscriptions/{libraryType}/{libraryId}`
- `word-banks` create/update 请求新增 `language`

---

## 行为结果

- 公开库继续通过 `is_public` 决定可见性。
- 订阅只是用户侧书架记录，不复制内容，也不放开写权限。
- 已订阅库若后来转私有或被删除，订阅行保留，但会标记为不可用，不再允许新开练习。
- 词汇掌握度只从词库练习写入；句库 / 文章库继续只保留会话、错题和进度语义。
- 词删除改为软删，旧会话 / 错题 / mastery 仍可回放或计算；即使遇到硬删残留，也会返回占位内容而不是静默消失。
- 练习流水仍保留 `word_id`，掌握度按 `word_norm` 汇总，符合“跨库同拼写合并”的一期策略。

---

## 验证

- `go test ./internal/service/library ./internal/service/practice ./internal/service/errors` 作为本次定向验证目标
- 额外建议在集成环境执行一次 `go build ./...` 与迁移回放

---

## 前端内容管理页重构与打磨

**日期：** 2026-05-07  
**状态：** ✅ 已完成（内容管理工作台前端闭环）

### 本次补充落地

1. 内容管理页从旧的单列表 CRUD 结构，重构为按来源组织的统一工作台。
2. 词库 / 句库 / 文章库统一支持四条来源泳道：`我的内容`、`系统内容`、`公开发现`、`我的订阅`。
3. 系统内容在前端显式剥离展示，普通用户只读，管理员和站长才会显示编辑能力。
4. 在内容管理页内直接支持公开内容订阅与取消订阅，并展示失效订阅原因。
5. 对页面布局做了一轮结构性打磨，减少重复提示与过重卡片层级，提升信息秩序。

### 关键实现

- 新增 `frontend/src/api/library.ts`
  - 统一封装订阅列表、订阅、取消订阅 hooks
  - 对后端返回的 `{ list: [...] }` 结构做前端归一化，避免页面直接因响应形状变化崩溃
- 更新 `frontend/src/types/api.ts`
  - 新增 `ContentLibraryType`
  - 新增 `LibrarySubscriptionItem`
  - 为 `WordBank` 补齐 `language`
- 新增 `frontend/src/pages/content/contentModel.ts`
  - 统一抽象来源分组、订阅判断、系统内容权限派生与不可用原因文案
- 新增 `frontend/src/pages/content/ContentShell.tsx`
  - 抽出共享工作台壳子、来源切换轨道、列表与详情布局容器
- 重写 `frontend/src/pages/content/ContentPage.tsx`
  - 顶部信息区改为更紧凑的工作台说明与角色提示
  - 去掉重复说明条，减少页面首屏噪音
- 重写 `frontend/src/pages/content/WordPanel.tsx`
  - 词库支持来源切换、订阅动作、系统内容只读/可编辑态分流
  - 词条编辑补齐发音、例句、标签等字段
- 重写 `frontend/src/pages/content/SentencePanel.tsx`
  - 句库支持来源切换、订阅动作与统一的句子编辑工作流
- 重写 `frontend/src/pages/content/ArticlePanel.tsx`
  - 文章库、文章列表、文章详情与句子翻译并入同一工作台
- 新增 / 重构 `frontend/src/styles/pages/contentWorkspace.css.ts`
  - 来源切换从左栏大卡片改为顶部工作轨道
  - 列宽、卡片层级、长标题换行和桌面 sticky 列表行为做了统一打磨

### 行为结果

- 用户先选内容类型，再按来源选择库，交互路径更清晰。
- `系统内容` 不再和普通用户自建内容混在同一书架里。
- `公开发现` 和 `我的订阅` 进入同一页面心智模型，减少在多个页面之间切换。
- 订阅列表对失效源库保持可见，并明确不可用原因，避免“凭空消失”。
- 布局从“左栏堆叠来源卡 + 内容列表”调整为“顶部来源工作轨道 + 下方双栏工作区”，视觉层级更稳定。

### 前端验证

- `cd frontend && npm run build` 已通过
- 当前仍存在 Vite chunk size warning，但不影响功能与构建产物

---

## 2026-05-07 补充交付：内容管理页工作台重构

**状态：** ✅ 已完成（系统内容分流 + 公开发现 / 我的订阅前端闭环）

### 本轮新增范围

1. 内容管理页重构为按来源切换的工作台：`我的内容`、`系统内容`、`公开发现`、`我的订阅`。
2. 词库 / 句库 / 文章库前端统一接入订阅列表、订阅、取消订阅能力。
3. 系统默认内容从普通用户自建内容中剥离；普通用户只读，管理员和站长可编辑。
4. 订阅失效态前端落地：源库转私有、删除、丢失时仍保留入口并展示原因。
5. 词库前端补齐 `language` 字段透传，支持新建 / 编辑时配置语言。

### 关键实现

#### 后端权限补位

- `internal/service/contentaccess/access.go`
  - 新增 `CanManageLibrary(ownerID, userID, userRole)`，统一 system 内容可编辑判定。
- `internal/service/word/word.go`
- `internal/service/sentence/sentence.go`
- `internal/service/article/article.go`
  - 写接口统一透传 `userRole`，让 `admin` / `owner` 能编辑 `owner_id == system` 的内容。
- `internal/controller/wordbank/wordbank_v1.go`
- `internal/controller/sentencebank/sentencebank_v1.go`
- `internal/controller/articlebank/articlebank_v1.go`
  - 从上下文读取 `role` 并传入 service。

#### 前端数据层

- `frontend/src/api/library.ts`
  - 新增统一订阅 hooks：列表、订阅、取消订阅。
- `frontend/src/types/api.ts`
  - 新增 `ContentLibraryType`、`LibrarySubscriptionItem`
  - `WordBank` 增加 `language`
- `frontend/src/api/wordBanks.ts`
  - 词库 create/update 请求补齐 `language`

#### 前端页面与交互

- `frontend/src/pages/content/ContentPage.tsx`
  - 重做内容管理入口页头和类型切换壳子，改为训练工作台风格。
- `frontend/src/pages/content/WordPanel.tsx`
- `frontend/src/pages/content/SentencePanel.tsx`
- `frontend/src/pages/content/ArticlePanel.tsx`
  - 三个面板全部切成“来源选择 -> 库详情 -> 内容编辑/订阅”的统一结构。
  - 系统内容与公开内容分栏展示，订阅和取消订阅直接在详情区完成。
  - 文章库不再走旧的三段面包屑流，改为同页选库、选文章、改句子翻译。
- `frontend/src/pages/content/ContentShell.tsx`
- `frontend/src/pages/content/contentModel.ts`
- `frontend/src/styles/pages/contentWorkspace.css.ts`
  - 新增共用的来源 rail、库列表卡片、详情区、状态卡片与工作台样式。

### 行为结果

- 普通用户进入内容管理页后，不会再把 system 创建的内容误认为是自己可编辑的内容。
- 管理员 / 站长可在前端直接维护系统默认词库、句库、文章库。
- 用户可在内容管理页直接浏览全站公开内容并订阅，不必再通过额外入口跳转。
- `我的订阅` 会持续保留历史入口；即使源库后来不可用，也会展示不可用原因并允许取消订阅。
- 三类内容的页面结构、权限提示和操作位置统一，降低了跨词/句/文章维护时的切换成本。

### 验证

- `go test ./internal/service/contentaccess ./internal/service/word ./internal/service/sentence ./internal/service/article`
- `cd frontend && npm run build`