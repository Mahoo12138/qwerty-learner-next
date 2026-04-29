-- +goose Up
-- +goose StatementBegin
-- Promote the system owner user to the 'owner' role.
-- The owner user is identified via the system.owner_user_id setting.
UPDATE users
SET role = 'owner'
WHERE id = (
    SELECT value FROM system_settings WHERE definition_key = 'system.owner_user_id' LIMIT 1
)
  AND role = 'admin';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Demote owner back to admin
UPDATE users
SET role = 'admin'
WHERE id = (
    SELECT value FROM system_settings WHERE definition_key = 'system.owner_user_id' LIMIT 1
)
  AND role = 'owner';
-- +goose StatementEnd
