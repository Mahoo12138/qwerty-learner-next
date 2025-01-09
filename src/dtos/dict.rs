use salvo::prelude::{Extractible, ToSchema};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Debug, Validate, ToSchema, Default)]
pub struct DictAddRequest {
    #[validate(length(min = 5, message = "dictionary name length must be greater than 5"))]
    pub name: String,
    pub language: String,
}

#[derive(Debug, Deserialize, Extractible, ToSchema, Default)]
#[salvo(extract(default_source(from = "body", parse = "json")))]
pub struct DictUpdateRequest {
    #[salvo(extract(source(from = "param")))]
    pub id: String,
    pub name: String,
    pub language: String,
    pub word_count: u32,
}

#[derive(Debug, Serialize, ToSchema, Default)]
pub struct DictResponse {
    pub id: String,
    pub name: String,
    pub language: String,
    pub word_count: u32,
}
