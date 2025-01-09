use crate::{
    app_writer::AppResult,
    db::INTERNAL_DICT_DB,
    dtos::dict::{DictAddRequest, DictResponse, DictUpdateRequest},
    entities::{dicts, prelude::Dicts},
};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use uuid::Uuid;

pub async fn add_dict(req: DictAddRequest) -> AppResult<DictResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let model = dicts::ActiveModel {
        id: Set(Uuid::new_v4().to_string()),
        name: Set(req.name.clone()),
        language: Set(req.language.clone()),
        word_count: Set(0),
        created_at: Set(Utc::now().naive_utc()),
        updated_at: Set(Utc::now().naive_utc()),
    };
    let dict = Dicts::insert(model).exec(db).await?;
    Ok(DictResponse {
        id: dict.last_insert_id,
        name: req.name,
        language: req.language,
        word_count: 0,
    })
}

pub async fn update_dict(req: DictUpdateRequest) -> AppResult<DictResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let dict = Dicts::find_by_id(req.id).one(db).await?;
    if dict.is_none() {
        return Err(anyhow::anyhow!("词典不存在。").into());
    }
    let mut dict: dicts::ActiveModel = dict.unwrap().into();

    dict.name = Set(req.name.to_owned());
    dict.language = Set(req.language.to_owned());
    dict.word_count = Set(req.word_count);
    dict.updated_at = Set(Utc::now().naive_utc());

    let dict: dicts::Model = dict.update(db).await?;

    Ok(DictResponse {
        id: dict.id,
        name: dict.name,
        language: dict.language,
        word_count: dict.word_count,
    })
}

pub async fn delete_dict(id: String) -> AppResult<()> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;
    Dicts::delete_by_id(id).exec(db).await?;
    Ok(())
}

pub async fn dicts() -> AppResult<Vec<DictResponse>> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;
    let dicts = Dicts::find().all(db).await?;
    let res = dicts
        .into_iter()
        .map(|dict| DictResponse {
            id: dict.id,
            name: dict.name,
            language: dict.language,
            word_count: dict.word_count,
        })
        .collect::<Vec<_>>();
    Ok(res)
}
