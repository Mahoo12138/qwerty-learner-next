use salvo::oapi::endpoint;
use crate::app_writer::AppWriter;
use crate::dtos::system_settings::SettingResponse;
use crate::services::system_settings;

#[endpoint(tags("system_settings"))]
pub async fn get_system_settings() -> AppWriter<Vec<SettingResponse>> {
    let result = system_settings::settings().await;
    AppWriter(result)
}