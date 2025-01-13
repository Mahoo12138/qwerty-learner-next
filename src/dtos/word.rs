use salvo::prelude::{Extractible, ToSchema};
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Debug, Validate, ToSchema, Default)]
pub struct WordAddRequest {
    #[validate(length(min = 1, message = "word length must be greater than 0"))]
    pub name: String,
    pub trans: Vec<String>,
    pub dict_id: String,
}

#[derive(Debug, Deserialize, Extractible, ToSchema, Default)]
#[salvo(extract(default_source(from = "body", parse = "json")))]
pub struct WordUpdateRequest {
    #[salvo(extract(source(from = "param")))]
    pub id: String,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, ToSchema, Default)]
pub struct WordResponse {
    pub id: String,
    pub name: String,
    pub trans: Vec<String>,
}
