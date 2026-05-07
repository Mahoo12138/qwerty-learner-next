# 排行榜页面实现日志

**日期：** 2026-05-07
**状态：** ✅ 已完成
**关联规格：** `.cursor/plans/站内排行榜功能_d9015842.plan.md` 的前端页面、路由与导航入口部分

---

## 本次核心设计

1. 新增 `/leaderboard` 页面，采用偏训练场 / 领奖台的视觉方向来承载站内排行榜。
2. 页面支持多维度 metric 切换、period 切换、前三领奖台、完整榜单表格和我的排名卡。
3. 复用现有用户设置接口读取 `privacy.leaderboard_visible`，在用户关闭展示时显示 opt-out banner。
4. 在侧边栏与移动端导航中加入排行榜入口，并将成就图标改为 `Award`，避免与排行榜重复。

---

## 关键实现

### 前端数据层

- `frontend/src/types/api.ts`
  - 新增 `LeaderboardMetricKey`、`LeaderboardPeriod`
  - 新增 `LeaderboardMetricDefinition`、`LeaderboardEntry`、`LeaderboardResponse`、`LeaderboardMyRank`
- `frontend/src/api/leaderboard.ts`
  - 新增 `useLeaderboardMetrics()`、`useLeaderboard()`、`useMyRank()`
  - 对 metric 元数据提供前端静态 fallback，避免页面在后端 metrics 端点尚未就绪时失去切换能力

### 页面与样式

- `frontend/src/pages/leaderboard/LeaderboardPage.tsx`
  - 实现排行榜页面主体
  - 支持 metric tabs、period select、领奖台、榜单表格、我的排名卡、opt-out banner
  - 榜单头像通过受权 fetch + blob URL 加载，兼容当前媒体接口鉴权方式
- `frontend/src/pages/leaderboard/LeaderboardPage.css.ts`
  - 使用 vanilla-extract 完成整页样式
  - 视觉特征包括训练场式 hero、终点线纹理、领奖台卡片与移动端适配

### 路由与导航

- `frontend/src/routes/leaderboard.tsx`
  - 新增文件路由 `/leaderboard`
- `frontend/src/routes/__root.tsx`
  - 桌面 / 移动导航新增「排行榜」入口
  - 成就入口图标从 `Trophy` 调整为 `Award`
- `frontend/src/routeTree.gen.ts`
  - 补入 `leaderboard` 路由类型，保证 `tsc -b` 阶段通过

---

## 验证

- 前端构建：`pnpm build`（frontend）✅ 通过

---

## 说明

- 本次实现范围为前端页面与接入点。
- 榜单实际数据仍依赖后端以下接口返回：
  - `GET /api/v1/leaderboard/metrics`
  - `GET /api/v1/leaderboard/:metric`
  - `GET /api/v1/leaderboard/me`

---

## 后续迭代记录

### 2026-05-07 排行榜维度区重排

- 将排行榜维度区从单层工具栏重排为「当前赛道说明 + 多行赛道切换卡片 + 独立时间窗口块」的结构，强化信息层级与阅读节奏。
- 每个维度按钮补充了简短的计分提示，区分“支持时间窗口”与“仅看生涯累计”，减少切换前的理解成本。
- 时间窗口区域补充状态提示与说明文案，在不支持 period 的维度下直接说明为何被锁定。
- 修复了 `LeaderboardPage.css.ts` 中 vanilla-extract 不允许的 `& > *:nth-child(...)` 选择器，改为 `globalStyle(...)`。
- 重新执行 `pnpm build`（frontend）✅ 通过。

### 2026-05-07 排行榜维度抽屉化改版

- 将常驻平铺的维度切换卡片改为「当前赛道摘要 + 右侧抽屉面板」模式，主页面只保留当前维度，不再直接展开所有选项。
- 维度切换动作现在集中在侧边抽屉中完成，抽屉内按赛道列表展示全部 metric，减少榜单上方的横向铺陈感。
- 保留当前赛道的即时可见性，同时让完整维度列表退到次级层级，整体阅读节奏更集中在榜单内容本身。

### 2026-05-07 Hero 卡片内联切换

- 将「当前赛道」卡片直接改造成维度切换入口，维度列表通过右侧抽屉展开，不再单独占用下方控制区。
- 将「时间窗口」切换直接放进第二张 hero 卡片内，维持和维度切换一致的就地操作方式。
- 删除原本独立的控制区，让榜单头部的信息与操作集中在同一组卡片里。
