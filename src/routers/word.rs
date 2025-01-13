use crate::{
    app_writer::{AppResult, AppWriter},
    dtos::word::{WordAddRequest, WordResponse, WordUpdateRequest},
    middleware::jwt::JwtClaims,
    services::word,
};
use salvo::{
    oapi::{
        endpoint,
        extract::{JsonBody, PathParam, QueryParam},
    },
    prelude::JwtAuthDepotExt,
    Request,
};
use salvo::{Depot, Writer};

#[endpoint(tags("words"))]
pub async fn post_add_word(
    new_word: JsonBody<WordAddRequest>,
    depot: &mut Depot,
) -> AppWriter<WordResponse> {
    // Extract user_id from JWT claims
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = word::add_word(new_word.0, user_id).await;
    AppWriter(result)
}

#[endpoint(  tags("words"),
parameters(
    ("id", description = "word id"),
))]
pub async fn put_update_word(
    req: &mut Request,
    depot: &mut Depot,
) -> AppResult<AppWriter<WordResponse>> {
    let req: WordUpdateRequest = req.extract().await?;
    // Extract user_id from JWT claims
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();
    let result = word::update_word(req, user_id).await;
    Ok(AppWriter(result))
}

#[endpoint(tags("words"))]
pub async fn delete_word(id: PathParam<String>, depot: &mut Depot) -> AppWriter<()> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();
    let result = word::delete_word(id.0, user_id).await;
    AppWriter(result)
}

#[endpoint(tags("words"))]
pub async fn get_words(
    dict_id: QueryParam<String>,
    depot: &mut Depot,
) -> AppWriter<Vec<WordResponse>> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = word::words(dict_id.into_inner(), user_id).await;
    AppWriter(result)
}
