use crate::{
    app_writer::{AppResult, AppWriter},
    dtos::dict::{DictAddRequest, DictResponse, DictUpdateRequest},
    services::dict,
};
use salvo::Writer;
use salvo::{
    oapi::endpoint,
    oapi::extract::{JsonBody, PathParam},
    Request,
};

#[endpoint(tags("dicts"))]
pub async fn post_add_dict(new_dict: JsonBody<DictAddRequest>) -> AppWriter<DictResponse> {
    let result = dict::add_dict(new_dict.0).await;
    AppWriter(result)
}

#[endpoint(  tags("dicts"),
parameters(
    ("id", description = "dictionary id"),
))]
pub async fn put_update_dict(req: &mut Request) -> AppResult<AppWriter<DictResponse>> {
    let req: DictUpdateRequest = req.extract().await?;
    let result = dict::update_dict(req).await;
    Ok(AppWriter(result))
}

#[endpoint(tags("dicts"))]
pub async fn delete_dict(id: PathParam<String>) -> AppWriter<()> {
    let result = dict::delete_dict(id.0).await;
    AppWriter(result)
}

#[endpoint(tags("dicts"))]
pub async fn get_dicts() -> AppWriter<Vec<DictResponse>> {
    let result = dict::dicts().await;
    AppWriter(result)
}
