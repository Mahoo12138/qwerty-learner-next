-- +goose Up
-- +goose StatementBegin
INSERT INTO setting_definitions (
    key,
    scope,
    type,
    group_key,
    label,
    description,
    default_value,
    is_public,
    sort_order,
    created_at,
    updated_at
)
SELECT
    'privacy.leaderboard_visible',
    'user',
    'bool',
    'privacy',
    '参与排行榜',
    '关闭后不在站内排行榜中展示你的昵称与头像',
    'true',
    1,
    240,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM setting_definitions WHERE key = 'privacy.leaderboard_visible'
);

CREATE INDEX IF NOT EXISTS idx_user_settings_definition_user ON user_settings(definition_key, user_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_user_settings_definition_user;
DELETE FROM setting_definitions WHERE key = 'privacy.leaderboard_visible';
-- +goose StatementEnd