use chrono::Utc;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;
use entity::{prelude::Words, words};
use crate::{
    app_writer::AppResult,
    db::INTERNAL_DICT_DB,
    dtos::word::{WordAddRequest, WordResponse, WordUpdateRequest},
};

use super::dict::{check_dict_permission, check_dict_public};

pub async fn add_word(req: WordAddRequest, user_id: String) -> AppResult<WordResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    check_dict_permission(&req.dict_id, &user_id).await?;

    let model = words::ActiveModel {
        id: Set(Uuid::new_v4().to_string()),
        name: Set(req.name.clone()),
        trans: Set(req.trans.clone().into()),
        dict_id: Set(req.dict_id.clone()),
        created_at: Set(Utc::now().naive_utc()),
        updated_at: Set(Utc::now().naive_utc()),
    };

    let word = Words::insert(model).exec(db).await?;
    Ok(WordResponse {
        id: word.last_insert_id,
        name: req.name,
        trans: req.trans,
    })
}

pub async fn update_word(req: WordUpdateRequest, _user_id: String) -> AppResult<WordResponse> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let word = Words::find_by_id(req.id).one(db).await?;
    if word.is_none() {
        return Err(anyhow::anyhow!("词典不存在。").into());
    }

    let mut word: words::ActiveModel = word.unwrap().into();

    if let Some(name) = req.name {
        word.name = Set(name);
    }
    word.updated_at = Set(Utc::now().naive_utc());

    let word: words::Model = word.update(db).await?;

    Ok(WordResponse {
        id: word.id,
        name: word.name,
        trans: word.trans.as_array().map_or(vec![], |trans| {
            trans.iter().map(|v| v.to_string()).collect()
        }),
    })
}

pub async fn delete_word(id: String, _user_id: String) -> AppResult<()> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let _word = Words::find_by_id(id.clone())
        .one(db)
        .await?
        .ok_or(anyhow::anyhow!("字典未找到。"))?;

    Words::delete_by_id(id).exec(db).await?;
    Ok(())
}

pub async fn words(dict_id: String, user_id: String) -> AppResult<Vec<WordResponse>> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    check_dict_permission(&dict_id, &user_id).await?;

    let words = Words::find()
        .filter(words::Column::DictId.eq(dict_id))
        .all(db)
        .await?;
    let res = words
        .into_iter()
        .map(|word| WordResponse {
            id: word.id,
            name: word.name,
            trans: word.trans.as_array().map_or(vec![], |trans| {
                trans
                    .iter()
                    .filter_map(|v| v.as_str())
                    .map(|s| s.to_string())
                    .collect()
            }),
        })
        .collect::<Vec<_>>();
    Ok(res)
}

pub async fn public_words(dict_id: String) -> AppResult<Vec<WordResponse>> {
    let db = INTERNAL_DICT_DB
        .get()
        .ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    check_dict_public(&dict_id).await?;

    let words = Words::find()
        .filter(words::Column::DictId.eq(dict_id))
        .all(db)
        .await?;
    let res = words
        .into_iter()
        .map(|word| WordResponse {
            id: word.id,
            name: word.name,
            trans: word.trans.as_array().map_or(vec![], |trans| {
                trans
                    .iter()
                    .filter_map(|v| v.as_str())
                    .map(|s| s.to_string())
                    .collect()
            }),
        })
        .collect::<Vec<_>>();
    Ok(res)
}
