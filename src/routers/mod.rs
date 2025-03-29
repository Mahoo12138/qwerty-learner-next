use crate::middleware::{cors::cors_middleware, jwt::jwt_middleware};
use chapter_records::ChapterRecordRouter;
use dict::{get_builtin_dicts, DictRouter};
use qwerty_learner::Routers;
use salvo::{
    prelude::{CatchPanic, Logger, OpenApi, Scalar},
    Router,
};
use user::post_signup;
use word::{delete_word, get_builtin_dict_words, get_words, post_add_word, put_update_word};
use word_records::WordRecordRouter;

use self::{
    demo::hello,
    user::{delete_user, get_users, post_add_user, post_login, put_update_user},
};
pub mod chapter_records;
pub mod demo;
pub mod dict;
mod static_routers;
pub mod user;
pub mod word;
pub mod word_records;

pub fn router() -> Router {
    let mut no_auth_routers = vec![
        Router::with_path("/api/login").post(post_login),
        Router::with_path("/api/signup").post(post_signup),
        Router::with_path("/api/dict/public").get(get_builtin_dicts),
        Router::with_path("/api/word/public").get(get_builtin_dict_words),
    ];

    let _cors_handler = cors_middleware();

    let mut need_auth_routers = vec![
        Router::with_path("/api/users")
            .get(get_users)
            .post(post_add_user)
            .push(
                Router::with_path("<id>")
                    .put(put_update_user)
                    .delete(delete_user),
            ),
        Router::with_path("/api/words")
            .get(get_words)
            .post(post_add_word)
            .push(
                Router::with_path("<id>")
                    .put(put_update_word)
                    .delete(delete_word),
            ),
    ];

    let router = Router::new()
        //.hoop(_cors_handler)
        .hoop(Logger::new())
        .hoop(CatchPanic::new())
        .get(hello)
        .append(&mut no_auth_routers)
        .push(
            Router::new()
                .append(&mut need_auth_routers)
                .append(&mut DictRouter.build())
                .append(&mut WordRecordRouter.build())
                .append(&mut ChapterRecordRouter.build())
                .hoop(jwt_middleware()),
        );
    let doc = OpenApi::new("salvo web api", "0.0.1").merge_router(&router);
    router
        .push(doc.into_router("/api-doc/openapi.json"))
        .push(Scalar::new("/api-doc/openapi.json").into_router("scalar"))
}
