# Qwerty Learner Project Documentation

[中文](zh/README.md)

Welcome to the documentation for the Qwerty Learner project! This monorepo contains both the frontend (web) and backend (server) applications, designed for efficient vocabulary learning and management.

## Project Structure

```
qwerty-learner-next/
├── web/      # Frontend (React, Vite, TypeScript)
├── server/   # Backend (NestJS, TypeORM, PostgreSQL)
└── docs/     # Documentation
```

## Features
- Modern web frontend with React, Vite, Zustand, Jotai, MUI Joy, and more
- RESTful backend API with NestJS, TypeORM, PostgreSQL
- User authentication, vocabulary management, error book, statistics, and more
- Internationalization (i18n)
- E2E and unit tests
- Dockerized deployment
- CI/CD ready

## Quick Start

See [Setup & Development](development.md) for detailed instructions.

### Prerequisites
- Node.js >= 20.10.0
- pnpm >= 9.5.0

### Install dependencies
```bash
pnpm install
```

### Run frontend (web)
```bash
cd web
pnpm dev
```

### Run backend (server)
```bash
cd server
cp .env.example .env
pnpm start:dev
```

## Deployment
See [Deployment Guide](deployment.md).

## Contribution
See [Development Guide](development.md) and [Conventions](conventions/styleguide.md).

## Technology Stack
### Frontend (web)
- React 19, Vite, TypeScript
- Zustand, Jotai, TanStack Query/Router/Table
- MUI Joy, @tabler/icons-react, Radix UI
- ECharts, Dexie, SWR, i18next, Playwright

### Backend (server)
- NestJS 10, TypeScript
- TypeORM, PostgreSQL
- @nestjs-modules/mailer, BullMQ, Swagger
- Jest, ESLint, Prettier, Docker

## Documentation
- [Setup & Development](development.md)
- [Architecture](architecture.md)
- [Database](database.md)
- [Security](security.md)
- [Testing](testing.md)
- [Deployment](deployment.md)
- [Technologies](technologies.md)
- [Troubleshooting](troubleshooting.md)

## License
MIT
