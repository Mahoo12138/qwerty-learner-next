use crate::middleware::{cors::cors_middleware, jwt::jwt_middleware};
use dict::{delete_dict, get_dicts, post_add_dict, put_update_dict};
use salvo::{
    prelude::{CatchPanic, Logger, OpenApi, Scalar},
    Router,
};
use word::{delete_word, get_words, post_add_word, put_update_word};

use self::{
    demo::hello,
    user::{delete_user, get_users, post_add_user, post_login, put_update_user},
};
pub mod demo;
pub mod dict;
mod static_routers;
pub mod user;
pub mod word;

pub fn router() -> Router {
    let mut no_auth_routers = vec![Router::with_path("/api/login").post(post_login)];

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
        Router::with_path("/api/dicts")
            .get(get_dicts)
            .post(post_add_dict)
            .push(
                Router::with_path("<id>")
                    .put(put_update_dict)
                    .delete(delete_dict),
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
                .hoop(jwt_middleware()),
        );
    let doc = OpenApi::new("salvo web api", "0.0.1").merge_router(&router);
    router
        .push(doc.into_router("/api-doc/openapi.json"))
        .push(Scalar::new("/api-doc/openapi.json").into_router("scalar"))
}
