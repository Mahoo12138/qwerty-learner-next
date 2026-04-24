-- +goose Up
INSERT INTO setting_definitions
    (key, scope, type, group_key, label, description, default_value, enum_options, validation_rule, is_public, sort_order, created_at, updated_at)
VALUES
('user.practice.key_sound_id',
 'user', 'string', 'practice',
 '按键音效标识', '保存当前选中的按键音效媒体 ID',
 '', NULL, '{"max_length":64}', 0, 131, datetime('now'), datetime('now'));

-- +goose Down
DELETE FROM setting_definitions WHERE key = 'user.practice.key_sound_id';
