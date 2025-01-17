# 介绍
这是一个由 [salvo-cli](https://github.com/salvo-rs/salvo-cli) 生成的项目，你可以按照以下命令来运行程序以及测试 (非 sqlite 数据库的请先按照教程修改数据库连接串，完成数据的初始工作)。
😄 最新版的 Salvo 依赖 Rust 版本 1.75。如果编译失败，请尝试使用 `rustup update` 来升级版本。
``` shell
//运行项目
cargo run 
//运行测试
cargo test
```
# 小贴士
- 如果你选择的 sqlite 或者已经初始化了 users 表的数据，请使用账号 zhangsan 密码 123 来登录。
- 程序数据库连接串在 config/config.toml 里，但是如果你使用的是 sqlx 或者 seaorm，库本身读取 .env 文件的配置来生成实体，运行迁移，验证。所以当你修改数据库连接串时，需要同时修改两个地方。
# orm 的文档或主页链接
🐚 您选择了 sea-orm，文档可以在这里查看:https://www.sea-ql.org/SeaORM/docs/index/
## sea_orm_cli
SeaOrm-cli 的相关数据库迁移，自动创建实体等命令请查看文档:https://www.sea-ql.org/SeaORM/docs/migration/running-migration/#command-line-interface-cli
## 数据初始化
你选择的是 sqlite 数据库，数据库已初始化完毕，在 data 文件夹下。
# 项目目录说明
# qwerty-learner-next
- **目录:** qwerty-learner-next 
- *文件:* .env         (存储数据库连接串的配置文件)
- **目录:** .github 
    - **目录:** workflows 
        - *文件:* build.yml 
- **目录:** assets         (静态资源如图片、JavaScript 脚本和 CSS 样式表)
    - *文件:* favicon.ico 
- *文件:* Cargo.toml         (Rust 项目的依赖和配置信息)
- *文件:* cliff.toml         (用于 git-cliff 生成变更日志)
- **目录:** config         (包含所有配置文件的文件夹)
    - **目录:** certs 
        - *文件:* cert.pem 
        - *文件:* key.pem 
    - *文件:* config.yml 
- **目录:** data         (包含数据库文件或初始化数据 sql 文件的目录)
    - *文件:* demo.db 
- *文件:* deny.toml         (许可证检查用于验证您使用的每个板条箱都有您认为可以接受的许可证条款。)
- **目录:** migration         (数据库迁移脚本的存放位置)
    - *文件:* Cargo.toml 
    - **目录:** src 
        - *文件:* lib.rs 
        - *文件:* m20220101_000001_create_table.rs 
        - *文件:* main.rs 
- **目录:** src         (源代码目录)
    - *文件:* app_error.rs 
    - *文件:* app_writer.rs 
    - *文件:* config.rs 
    - *文件:* db.rs 
    - **目录:** dtos 
        - *文件:* mod.rs 
        - *文件:* user.rs 
    - **目录:** entities 
        - *文件:* mod.rs 
        - *文件:* prelude.rs 
        - *文件:* users.rs 
    - *文件:* main.rs 
    - **目录:** middleware 
        - *文件:* cors.rs 
        - *文件:* handle_404.rs 
        - *文件:* jwt.rs 
        - *文件:* mod.rs 
    - **目录:** routers 
        - *文件:* demo.rs 
        - *文件:* mod.rs 
        - *文件:* static_routers.rs 
        - *文件:* user.rs 
    - **目录:** services 
        - *文件:* mod.rs 
        - *文件:* user.rs 
    - **目录:** utils 
        - *文件:* mod.rs 
        - *文件:* rand_utils.rs 

# cargo-deny
``` shell
cargo install --locked cargo-deny && cargo deny check
```
# git cliff
请替换 cliff.toml 文件第 49 行的 url 为该仓库的 url，用来触发自动生成变更日志。
# 关于赛风 (salvo)
你可以在 https://salvo.rs/ 📖查看 salvo 的文档以及更多例子，如果我们的工具帮到你，欢迎 start [salvo](https://github.com/salvo-rs/salvo) 和 [salvo-cli](https://github.com/salvo-rs/salvo-cli),这将给我们很大激励。❤️️