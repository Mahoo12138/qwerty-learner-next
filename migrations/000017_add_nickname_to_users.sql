-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN nickname TEXT NOT NULL DEFAULT '';

-- Back-fill existing users: nickname = '用户' || username
UPDATE users SET nickname = '用户' || username WHERE nickname = '';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- SQLite does not support DROP COLUMN in older versions; recreate table without nickname
CREATE TABLE users_backup AS SELECT id, username, email, password_hash, avatar_media_id, role, is_active, created_at, updated_at, deleted_at FROM users;
DROP TABLE users;
ALTER TABLE users_backup RENAME TO users;
-- +goose StatementEnd
