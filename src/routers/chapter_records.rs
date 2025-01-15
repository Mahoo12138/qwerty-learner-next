use crate::{
    app_writer::AppWriter,
    dtos::chapter_record::{ChapterRecordAddRequest, ChapterRecordResponse},
    middleware::jwt::JwtClaims,
    services::chapter_record,
};
use qwerty_learner::Routers;
use salvo::{
    oapi::{endpoint, extract::JsonBody},
    prelude::JwtAuthDepotExt,
    Router,
};
use salvo::{Depot, Writer};

#[endpoint(tags("chapter_records"))]
pub async fn post_add_chapter_records(
    new_word: JsonBody<ChapterRecordAddRequest>,
    depot: &mut Depot,
) -> AppWriter<ChapterRecordResponse> {
    // Extract user_id from JWT claims
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = chapter_record::add_chapter_record(new_word.0, user_id).await;
    AppWriter(result)
}

#[endpoint(tags("chapter_records"))]
pub async fn get_chapter_records(depot: &mut Depot) -> AppWriter<Vec<ChapterRecordResponse>> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = chapter_record::chapter_records(user_id).await;
    AppWriter(result)
}

pub struct ChapterRecordRouter;

impl Routers for ChapterRecordRouter {
    fn build(self) -> Vec<Router> {
        vec![Router::new()
            .path("/api/chapter-record")
            // http get {ip}/tag/view limit==5 offset==0
            .push(Router::new().get(get_chapter_records))
            // http post {ip}/tag/new tag="Rust"
            .push(Router::new().post(post_add_chapter_records))]
    }
}
