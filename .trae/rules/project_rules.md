1. 当前项目是 nestjs 和 react 的全栈项目；
  1.1 ./server 目录是 nestjs 项目；
  1.2 ./web 目录是 react 项目；
2. 后端 nestjs 结合 typeorm 操作 postgres；
  2.1. server\src\api 目录是业务 api 定义，分为 system 和 business 层面，包含多个 nestjs module；
  2.2 typeorm 定义的 entity 统一使用 uuid，且需要继承 AbstractEntity （server/src/database/entities/abstract.entity）；
3. 前端 react 使用 shadcn 组件库 + tailwind css 框架；