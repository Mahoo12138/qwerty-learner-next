use crate::{
    app_writer::AppResult,
    db::DB,
    dtos::word_record::{WordRecordAddRequest, WordRecordResponse},
    entities::{prelude::WordRecords, word_records},
};
use chrono::Utc;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

pub async fn add_word_record(
    req: WordRecordAddRequest,
    user_id: String,
) -> AppResult<WordRecordResponse> {
    let db = DB.get().ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let model = word_records::ActiveModel {
        id: Set(Uuid::new_v4().to_string()),
        created_at: Set(Utc::now().naive_utc()),
        chapter_id: Set(req.chapter_id.clone()),
        word_id: Set(req.word_id.clone()),
        mistakes: Set(req.mistakes.clone().into()),
        wrong_count: Set(req.wrong_count),
        user_id: Set(user_id),
    };

    let word = WordRecords::insert(model).exec(db).await?;
    Ok(WordRecordResponse {
        id: word.last_insert_id,
        chapter_id: req.chapter_id,
        word_id: req.word_id,
        wrong_count: req.wrong_count,
        mistakes: req.mistakes,
    })
}

pub async fn word_records(user_id: String) -> AppResult<Vec<WordRecordResponse>> {
    let db = DB.get().ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let word_records = WordRecords::find()
        .filter(word_records::Column::UserId.eq(user_id))
        .all(db)
        .await?;
    let res = word_records
        .into_iter()
        .map(|item| WordRecordResponse {
            id: item.id,
            chapter_id: item.chapter_id,
            word_id: item.word_id,
            wrong_count: item.wrong_count,
            mistakes: item.mistakes.as_array().map_or(vec![], |mistakes| {
                mistakes.iter().map(|v| v.to_string()).collect()
            }),
        })
        .collect::<Vec<_>>();
    Ok(res)
}
