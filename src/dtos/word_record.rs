use salvo::oapi::ToSchema;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Debug, Validate, ToSchema, Default)]
pub struct WordRecordAddRequest {
    #[validate(length(min = 1, message = "word length must be greater than 0"))]
    pub chapter_id: String,
    pub word_id: String,
    pub wrong_count: u32,
    pub mistakes: Vec<String>,
}

#[derive(Debug, Serialize, ToSchema, Default)]
pub struct WordRecordResponse {
    pub id: String,
    pub chapter_id: String,
    pub word_id: String,
    pub wrong_count: u32,
    pub mistakes: Vec<String>,
}
