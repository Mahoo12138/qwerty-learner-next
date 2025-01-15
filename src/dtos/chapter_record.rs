use salvo::oapi::ToSchema;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Debug, Validate, ToSchema, Default)]
pub struct ChapterRecordAddRequest {
    #[validate(length(min = 1, message = "word length must be greater than 0"))]
    pub dict_id: String,
    pub time: u32,
    pub word_count: u32,
    pub chapter: u32,
}

#[derive(Debug, Serialize, ToSchema, Default)]
pub struct ChapterRecordResponse {
    pub id: String,
    pub dict_id: String,
    pub time: u32,
    pub word_count: u32,
    pub chapter: u32,
    pub created_at: String,
}
