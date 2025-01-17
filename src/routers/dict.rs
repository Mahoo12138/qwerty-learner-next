use crate::{
    app_writer::{AppResult, AppWriter},
    dtos::dict::{DictAddRequest, DictResponse, DictUpdateRequest},
    middleware::jwt::JwtClaims,
    services::dict,
};
use qwerty_learner::Routers;
use salvo::{
    oapi::{
        endpoint,
        extract::{JsonBody, PathParam},
    },
    prelude::JwtAuthDepotExt,
    Request, Router,
};
use salvo::{Depot, Writer};

#[endpoint(tags("dicts"))]
pub async fn post_add_dict(
    new_dict: JsonBody<DictAddRequest>,
    depot: &mut Depot,
) -> AppWriter<DictResponse> {
    // Extract user_id from JWT claims
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();

    let result = dict::add_dict(new_dict.0, user_id).await;
    AppWriter(result)
}

#[endpoint(  tags("dicts"),
parameters(
    ("id", description = "dictionary id"),
))]
pub async fn put_update_dict(
    req: &mut Request,
    depot: &mut Depot,
) -> AppResult<AppWriter<DictResponse>> {
    let req: DictUpdateRequest = req.extract().await?;
    // Extract user_id from JWT claims
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();
    let result = dict::update_dict(req, user_id).await;
    Ok(AppWriter(result))
}

#[endpoint(tags("dicts"))]
pub async fn delete_dict(id: PathParam<String>, depot: &mut Depot) -> AppWriter<()> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();
    let result = dict::delete_dict(id.0, user_id).await;
    AppWriter(result)
}

#[endpoint(tags("dicts"))]
pub async fn get_dicts(depot: &mut Depot) -> AppWriter<Vec<DictResponse>> {
    let user_id = depot
        .jwt_auth_data::<JwtClaims>()
        .map(|token| token.claims.user_id.clone())
        .unwrap();
    let result = dict::dicts(user_id).await;
    AppWriter(result)
}

#[endpoint(tags("dicts"))]
pub async fn get_builtin_dicts() -> AppWriter<Vec<DictResponse>> {
    let result = dict::builtin_dicts().await;
    AppWriter(result)
}

pub struct DictRouter;

impl Routers for DictRouter {
    fn build(self) -> Vec<Router> {
        vec![Router::with_path("/api/dicts")
            .get(get_dicts)
            .post(post_add_dict)
            .push(
                Router::with_path("<id>")
                    .put(put_update_dict)
                    .delete(delete_dict),
            )]
    }
}
