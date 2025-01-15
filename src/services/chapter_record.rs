use crate::{
    app_writer::AppResult,
    db::DB,
    dtos::chapter_record::{ChapterRecordAddRequest, ChapterRecordResponse},
    entities::{chapter_records, prelude::ChapterRecords},
};
use chrono::Utc;
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

pub async fn add_chapter_record(
    req: ChapterRecordAddRequest,
    user_id: String,
) -> AppResult<ChapterRecordResponse> {
    let db = DB.get().ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let model = chapter_records::ActiveModel {
        id: Set(Uuid::new_v4().to_string()),
        dict_id: Set(req.dict_id.clone()),
        created_at: Set(Utc::now().naive_utc()),
        user_id: Set(user_id.clone()),
        chapter: Set(req.chapter),
        time: Set(req.time),
        word_count: Set(req.word_count),
    };

    let word = ChapterRecords::insert(model).exec(db).await?;
    Ok(ChapterRecordResponse {
        id: word.last_insert_id,
        dict_id: req.dict_id,
        time: req.time,
        word_count: req.word_count,
        chapter: req.chapter,
        created_at: Utc::now().naive_utc().to_string(),
    })
}

pub async fn chapter_records(user_id: String) -> AppResult<Vec<ChapterRecordResponse>> {
    let db = DB.get().ok_or(anyhow::anyhow!("数据库连接失败。"))?;

    let chapter_records = ChapterRecords::find()
        .filter(chapter_records::Column::UserId.eq(user_id))
        .all(db)
        .await?;
    let res = chapter_records
        .into_iter()
        .map(|item| ChapterRecordResponse {
            id: item.id,
            dict_id: item.dict_id,
            time: item.time,
            word_count: item.word_count,
            chapter: item.chapter,
            created_at: item.created_at.to_string(),
        })
        .collect::<Vec<_>>();
    Ok(res)
}
