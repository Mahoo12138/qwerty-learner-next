use crate::{
    app_writer::AppResult,
    db::INTERNAL_DICT_DB,
    dtos::dict::{DictAddRequest, DictResponse, DictUpdateRequest},
    entities::{dicts, prelude::Dicts},
};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

pub async fn add_dict(req: DictAddRequest, user_id: String) -> AppResult<DictResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let model = dicts::ActiveModel {
        id: Set(Uuid::new_v4().to_string()),
        name: Set(req.name.clone()),
        language: Set(req.language.clone()),
        word_count: Set(0),
        builtin: Set(false),
        user_id: Set(user_id),
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

pub async fn update_dict(req: DictUpdateRequest, user_id: String) -> AppResult<DictResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let dict = Dicts::find_by_id(req.id).one(db).await?;
    if dict.is_none() {
        return Err(anyhow::anyhow!("词典不存在。").into());
    }
    if dict.as_ref().unwrap().user_id != user_id {
        return Err(anyhow::anyhow!("无权操作。").into());
    }
    let mut dict: dicts::ActiveModel = dict.unwrap().into();

    if let Some(name) = req.name {
        dict.name = Set(name);
    }
    if let Some(language) = req.language {
        dict.language = Set(language);
    }
    if let Some(word_count) = req.word_count {
        dict.word_count = Set(word_count);
    }
    dict.updated_at = Set(Utc::now().naive_utc());

    let dict: dicts::Model = dict.update(db).await?;

    Ok(DictResponse {
        id: dict.id,
        name: dict.name,
        language: dict.language,
        word_count: dict.word_count,
    })
}

pub async fn delete_dict(id: String, user_id: String) -> AppResult<()> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let dict = Dicts::find_by_id(id.clone())
        .one(db)
        .await?
        .ok_or(anyhow::anyhow!("字典未找到。"))?;

    // 校验 user_id
    if dict.user_id != *user_id {
        return Err(anyhow::anyhow!("无权限删除该字典。").into());
    }
    Dicts::delete_by_id(id).exec(db).await?;
    Ok(())
}

pub async fn dicts(user_id: String) -> AppResult<Vec<DictResponse>> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;
    let dicts = Dicts::find()
        .filter(dicts::Column::UserId.eq(user_id))
        .all(db)
        .await?;
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

pub async fn check_dict_permission(dict_id: &String, user_id: &String) -> AppResult<()> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let dict = Dicts::find_by_id(dict_id.clone())
        .one(db)
        .await?
        .ok_or(anyhow::anyhow!("字典未找到。"))?;

    // 校验 user_id
    if dict.user_id != *user_id {
        return Err(anyhow::anyhow!("无权限操作该字典。").into());
    }
    Ok(())
}
