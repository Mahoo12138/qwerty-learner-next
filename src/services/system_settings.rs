use sea_orm::EntityTrait;
use entity::prelude::SystemSettings;
use crate::app_writer::AppResult;
use crate::db::DB;
use crate::dtos::system_settings::SettingResponse;



pub async fn settings() -> AppResult<Vec<SettingResponse>> {
    let db = DB.get().ok_or(anyhow::anyhow!("数据库连接失败。"))?;
    let settings = SystemSettings::find().all(db).await?;
    let res = settings
        .into_iter()
        .map(|setting| SettingResponse {
            value: setting.value,
            name: setting.name,
            description: setting.description
        })
        .collect::<Vec<_>>();
    Ok(res)
}
