-- +goose Up
-- +goose StatementBegin
ALTER TABLE word_banks ADD COLUMN language TEXT NOT NULL DEFAULT 'en';

CREATE TABLE IF NOT EXISTS library_subscriptions (
    id           TEXT PRIMARY KEY,
    user_id      TEXT NOT NULL REFERENCES users(id),
    library_type TEXT NOT NULL,
    library_id   TEXT NOT NULL,
    created_at   DATETIME NOT NULL,
    UNIQUE(user_id, library_type, library_id),
    CHECK (library_type IN ('word_bank', 'sentence_bank', 'article_bank'))
);

CREATE TABLE IF NOT EXISTS user_word_mastery (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL REFERENCES users(id),
    lang              TEXT NOT NULL,
    word_norm         TEXT NOT NULL,
    mastery_level     INTEGER NOT NULL DEFAULT 0,
    ease_factor       REAL NOT NULL DEFAULT 2.5,
    next_review_at    DATETIME,
    last_practiced_at DATETIME,
    times_seen        INTEGER NOT NULL DEFAULT 0,
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME NOT NULL,
    UNIQUE(user_id, lang, word_norm)
);

CREATE INDEX IF NOT EXISTS idx_library_subscriptions_user ON library_subscriptions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_library_subscriptions_lookup ON library_subscriptions(library_type, library_id);
CREATE INDEX IF NOT EXISTS idx_user_word_mastery_review ON user_word_mastery(user_id, next_review_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_word_mastery_review;
DROP INDEX IF EXISTS idx_library_subscriptions_lookup;
DROP INDEX IF EXISTS idx_library_subscriptions_user;
DROP TABLE IF EXISTS user_word_mastery;
DROP TABLE IF EXISTS library_subscriptions;
ALTER TABLE word_banks DROP COLUMN language;
-- +goose StatementEnd