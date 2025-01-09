use crate::config::CFG;
use sea_orm::{entity::prelude::DatabaseConnection, ConnectOptions, Database};
use std::time::Duration;
use tokio::sync::OnceCell;

pub static DB: OnceCell<DatabaseConnection> = OnceCell::const_new();
pub static CUSTOM_DICT_DB: OnceCell<DatabaseConnection> = OnceCell::const_new();
pub static INTERNAL_DICT_DB: OnceCell<DatabaseConnection> = OnceCell::const_new();

pub async fn init_db_conn() {
    DB.get_or_init(|| async {
        let mut opt = ConnectOptions::new(CFG.database.database_url.to_owned());
        opt.max_connections(1000)
            .min_connections(5)
            .connect_timeout(Duration::from_secs(8))
            .idle_timeout(Duration::from_secs(8))
            .sqlx_logging(false);

        Database::connect(opt).await.expect("数据库打开失败")
    })
    .await;
    CUSTOM_DICT_DB
        .get_or_init(|| async {
            let mut opt = ConnectOptions::new(CFG.database.costom_dict_db_url.to_owned());
            opt.max_connections(1000)
                .min_connections(5)
                .connect_timeout(Duration::from_secs(8))
                .idle_timeout(Duration::from_secs(8))
                .sqlx_logging(false);

            Database::connect(opt).await.expect("自定义词典数据库打开失败")
        })
        .await;
    INTERNAL_DICT_DB
        .get_or_init(|| async {
            let mut opt = ConnectOptions::new(CFG.database.internal_dict_db_url.to_owned());
            opt.max_connections(1000)
                .min_connections(5)
                .connect_timeout(Duration::from_secs(8))
                .idle_timeout(Duration::from_secs(8))
                .sqlx_logging(false);

            Database::connect(opt).await.expect("内置词典数据库打开失败")
        })
        .await;
}
