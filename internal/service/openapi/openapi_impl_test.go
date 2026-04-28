package openapi

import (
	"context"
	"fmt"
	"strings"
	"testing"

	"github.com/glebarez/sqlite"
	"github.com/gogf/gf/v2/errors/gerror"
	"gorm.io/gorm"

	"taptype/internal/model/entity"
)

func newTestService(t *testing.T) (*serviceImpl, *gorm.DB, context.Context, string) {
	t.Helper()

	dsn := fmt.Sprintf("file:%s?mode=memory&cache=shared", strings.ReplaceAll(t.Name(), "/", "_"))
	db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory sqlite failed: %v", err)
	}

	if err = db.AutoMigrate(&entity.User{}, &entity.ApiToken{}); err != nil {
		t.Fatalf("auto migrate failed: %v", err)
	}

	userID := "user-1"
	user := entity.User{
		ID:           userID,
		Username:     "tester",
		Nickname:     "Tester",
		Email:        "tester@example.com",
		PasswordHash: "hash",
		Role:         "user",
		IsActive:     1,
	}
	if err = db.Create(&user).Error; err != nil {
		t.Fatalf("seed user failed: %v", err)
	}

	return &serviceImpl{db: db}, db, context.Background(), userID
}

func TestCreateTokenAndValidateToken_Success(t *testing.T) {
	svc, _, ctx, userID := newTestService(t)

	token, rawToken, err := svc.CreateToken(ctx, userID, "dev", "", nil)
	if err != nil {
		t.Fatalf("CreateToken failed: %v", err)
	}
	if !strings.HasPrefix(rawToken, tokenPrefix) {
		t.Fatalf("raw token should start with %q, got %q", tokenPrefix, rawToken)
	}
	if token.Prefix != rawToken[:len(tokenPrefix)+8] {
		t.Fatalf("prefix mismatch: got %q", token.Prefix)
	}
	if token.Scopes != "*" {
		t.Fatalf("empty scopes should fallback to '*', got %q", token.Scopes)
	}

	validatedUserID, role, err := svc.ValidateToken(ctx, rawToken)
	if err != nil {
		t.Fatalf("ValidateToken failed: %v", err)
	}
	if validatedUserID != userID {
		t.Fatalf("expected user_id %q, got %q", userID, validatedUserID)
	}
	if role != "user" {
		t.Fatalf("expected role %q, got %q", "user", role)
	}
}

func TestCreateToken_LimitExceeded(t *testing.T) {
	svc, db, ctx, userID := newTestService(t)

	for i := 0; i < maxTokensPerUser; i++ {
		seed := entity.ApiToken{
			ID:        fmt.Sprintf("token-%d", i),
			UserID:    userID,
			Name:      "seed",
			TokenHash: fmt.Sprintf("seed-hash-%d", i),
			Prefix:    "tp_seed",
			Scopes:    "*",
			IsActive:  1,
		}
		if err := db.Create(&seed).Error; err != nil {
			t.Fatalf("seed token failed: %v", err)
		}
	}

	_, _, err := svc.CreateToken(ctx, userID, "overflow", "*", nil)
	if err == nil {
		t.Fatal("expected limit exceeded error, got nil")
	}
	if gerror.Code(err).Code() != 42202 {
		t.Fatalf("expected error code 42202, got %d, err=%v", gerror.Code(err).Code(), err)
	}
}

func TestValidateToken_InvalidPrefix(t *testing.T) {
	svc, _, ctx, _ := newTestService(t)

	_, _, err := svc.ValidateToken(ctx, "not-a-token")
	if err == nil {
		t.Fatal("expected invalid token error")
	}
	if gerror.Code(err).Code() != 40105 {
		t.Fatalf("expected error code 40105, got %d", gerror.Code(err).Code())
	}
}
