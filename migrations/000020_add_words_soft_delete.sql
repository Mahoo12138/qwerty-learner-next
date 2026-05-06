-- +goose Up
-- +goose StatementBegin
ALTER TABLE words ADD COLUMN deleted_at DATETIME;

CREATE INDEX IF NOT EXISTS idx_words_deleted_at ON words(deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_words_deleted_at;
ALTER TABLE words DROP COLUMN deleted_at;
-- +goose StatementEnd