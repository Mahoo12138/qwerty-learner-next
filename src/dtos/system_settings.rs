use salvo::oapi::ToSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug,Serialize, Deserialize, ToSchema, Default)]
pub struct SettingResponse {
    pub name: String,
    pub value: String,
    pub description: String,
}