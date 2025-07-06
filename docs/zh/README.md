# Qwerty Learner 项目文档

[English](../README.md)

欢迎阅读 Qwerty Learner 项目文档！本仓库为前后端一体的单体项目，包含高效的词汇学习与管理功能。

## 项目结构

```
qwerty-learner-next/
├── web/      # 前端（React, Vite, TypeScript）
├── server/   # 后端（NestJS, TypeORM, PostgreSQL）
└── docs/     # 文档
```

## 主要功能
- 现代化前端：React、Vite、Zustand、Jotai、MUI Joy 等
- 后端 RESTful API：NestJS、TypeORM、PostgreSQL
- 用户认证、词汇管理、错题本、统计分析等
- 国际化（i18n）
- E2E 与单元测试
- Docker 部署
- CI/CD 支持

## 快速开始
详细步骤见 [开发指南](../development.md)。

### 环境要求
- Node.js >= 20.10.0
- pnpm >= 9.5.0

### 安装依赖
```bash
pnpm install
```

### 启动前端（web）
```bash
cd web
pnpm dev
```

### 启动后端（server）
```bash
cd server
cp .env.example .env
pnpm start:dev
```

## 部署
详见 [部署指南](../deployment.md)。

## 贡献指南
详见 [开发指南](../development.md) 与 [代码规范](../conventions/styleguide.md)。

## 技术栈
### 前端（web）
- React 19、Vite、TypeScript
- Zustand、Jotai、TanStack Query/Router/Table
- MUI Joy、@tabler/icons-react、Radix UI
- ECharts、Dexie、SWR、i18next、Playwright

### 后端（server）
- NestJS 10、TypeScript
- TypeORM、PostgreSQL
- @nestjs-modules/mailer、BullMQ、Swagger
- Jest、ESLint、Prettier、Docker

## 文档索引
- [开发指南](../development.md)
- [架构设计](../architecture.md)
- [数据库](../database.md)
- [安全](../security.md)
- [测试](../testing.md)
- [部署](../deployment.md)
- [技术栈](../technologies.md)
- [常见问题](../troubleshooting.md)

## 许可证
MIT 