use crate::{
    app_writer::AppWriter,
    dtos::word_record::{WordRecordAddRequest, WordRecordResponse},
    middleware::jwt::JwtClaims,
    services::word_record,
};
use qwerty_learner::Routers;
use salvo::{
    oapi::{endpoint, extract::JsonBody},
    prelude::JwtAuthDepotExt,
    Router,
};
use salvo::{Depot, Writer};

#[endpoint(tags("word_records"))]
pub async fn post_add_word_records(
    new_word: JsonBody<WordRecordAddRequest>,
    depot: &mut Depot,
) -> AppWriter<WordRecordResponse> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = word_record::add_word_record(new_word.0, user_id).await;
    AppWriter(result)
}

#[endpoint(tags("word_records"))]
pub async fn get_word_records(depot: &mut Depot) -> AppWriter<Vec<WordRecordResponse>> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = word_record::word_records(user_id).await;
    AppWriter(result)
}

pub struct WordRecordRouter;

impl Routers for WordRecordRouter {
    fn build(self) -> Vec<Router> {
        vec![Router::new()
            .path("/api/wrod-record")
            // http get {ip}/tag/view limit==5 offset==0
            .push(Router::new().get(get_word_records))
            // http post {ip}/tag/new tag="Rust"
            .push(Router::new().post(post_add_word_records))]
    }
}
