package library

import (
	"context"
	"errors"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"taptype/internal/model/code"
	"taptype/internal/model/entity"
)

const (
	TypeWordBank     = "word_bank"
	TypeSentenceBank = "sentence_bank"
	TypeArticleBank  = "article_bank"
)

type Service interface {
	ListDiscovery(ctx context.Context, userID string) (*DiscoveryResult, error)
	ListSubscriptions(ctx context.Context, userID, libraryType string) ([]SubscriptionItem, error)
	Subscribe(ctx context.Context, userID string, req SubscribeReq) (*SubscriptionItem, error)
	Unsubscribe(ctx context.Context, userID, libraryType, libraryID string) error
}

type SubscribeReq struct {
	LibraryType string `json:"library_type"`
	LibraryID   string `json:"library_id"`
}

type SubscriptionItem struct {
	entity.LibrarySubscription
	LibraryName       string `json:"library_name"`
	LibraryOwnerID    string `json:"library_owner_id"`
	LibraryIsPublic   int    `json:"library_is_public"`
	IsAvailable       int    `json:"is_available"`
	UnavailableReason string `json:"unavailable_reason,omitempty"`
}

type targetSummary struct {
	Name      string
	OwnerID   string
	IsPublic  int
	Exists    bool
	IsDeleted bool
}

type serviceImpl struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) Service {
	return &serviceImpl{db: db}
}

func (s *serviceImpl) ListSubscriptions(ctx context.Context, userID, libraryType string) ([]SubscriptionItem, error) {
	if libraryType != "" && !isSupportedLibraryType(libraryType) {
		return nil, gerror.NewCode(code.CodeBadRequest, "invalid library_type")
	}

	query := s.db.WithContext(ctx).Model(&entity.LibrarySubscription{}).Where("user_id = ?", userID)
	if libraryType != "" {
		query = query.Where("library_type = ?", libraryType)
	}

	var subscriptions []entity.LibrarySubscription
	if err := query.Order("created_at DESC").Find(&subscriptions).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	targets, err := s.resolveTargets(ctx, subscriptions)
	if err != nil {
		return nil, err
	}

	items := make([]SubscriptionItem, 0, len(subscriptions))
	for _, subscription := range subscriptions {
		target, ok := targets[targetKey(subscription.LibraryType, subscription.LibraryID)]
		if !ok {
			target = targetSummary{}
		}
		available, unavailableReason := availabilityForUser(target, userID)
		items = append(items, SubscriptionItem{
			LibrarySubscription: subscription,
			LibraryName:         target.Name,
			LibraryOwnerID:      target.OwnerID,
			LibraryIsPublic:     target.IsPublic,
			IsAvailable:         boolToInt(available),
			UnavailableReason:   unavailableReason,
		})
	}

	return items, nil
}

func (s *serviceImpl) Subscribe(ctx context.Context, userID string, req SubscribeReq) (*SubscriptionItem, error) {
	if !isSupportedLibraryType(req.LibraryType) {
		return nil, gerror.NewCode(code.CodeBadRequest, "invalid library_type")
	}

	target, err := s.loadTarget(ctx, req.LibraryType, req.LibraryID)
	if err != nil {
		return nil, err
	}
	if target.OwnerID == userID {
		return nil, gerror.NewCode(code.CodeForbidden, "cannot subscribe to your own library")
	}
	if target.OwnerID != userID && target.IsPublic == 0 {
		return nil, gerror.NewCode(code.CodeForbidden, "library is not public")
	}

	var subscription entity.LibrarySubscription
	err = s.db.WithContext(ctx).
		Where("user_id = ? AND library_type = ? AND library_id = ?", userID, req.LibraryType, req.LibraryID).
		First(&subscription).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	if errors.Is(err, gorm.ErrRecordNotFound) {
		now := time.Now()
		subscription = entity.LibrarySubscription{
			ID:          uuid.New().String(),
			UserID:      userID,
			LibraryType: req.LibraryType,
			LibraryID:   req.LibraryID,
			CreatedAt:   now,
		}
		if err := s.db.WithContext(ctx).Create(&subscription).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
	}

	item := SubscriptionItem{
		LibrarySubscription: subscription,
		LibraryName:         target.Name,
		LibraryOwnerID:      target.OwnerID,
		LibraryIsPublic:     target.IsPublic,
		IsAvailable:         1,
	}
	return &item, nil
}

func (s *serviceImpl) Unsubscribe(ctx context.Context, userID, libraryType, libraryID string) error {
	if !isSupportedLibraryType(libraryType) {
		return gerror.NewCode(code.CodeBadRequest, "invalid library_type")
	}

	result := s.db.WithContext(ctx).
		Where("user_id = ? AND library_type = ? AND library_id = ?", userID, libraryType, libraryID).
		Delete(&entity.LibrarySubscription{})
	if result.Error != nil {
		return gerror.NewCode(code.CodeInternalError, result.Error.Error())
	}
	if result.RowsAffected == 0 {
		return gerror.NewCode(code.CodeNotFound, "subscription not found")
	}

	return nil
}

func (s *serviceImpl) resolveTargets(ctx context.Context, subscriptions []entity.LibrarySubscription) (map[string]targetSummary, error) {
	groupedIDs := map[string][]string{
		TypeWordBank:     {},
		TypeSentenceBank: {},
		TypeArticleBank:  {},
	}
	for _, subscription := range subscriptions {
		groupedIDs[subscription.LibraryType] = append(groupedIDs[subscription.LibraryType], subscription.LibraryID)
	}

	targets := make(map[string]targetSummary, len(subscriptions))
	if len(groupedIDs[TypeWordBank]) > 0 {
		var banks []entity.WordBank
		if err := s.db.WithContext(ctx).Unscoped().Where("id IN ?", groupedIDs[TypeWordBank]).Find(&banks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		for _, bank := range banks {
			targets[targetKey(TypeWordBank, bank.ID)] = targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic, Exists: true, IsDeleted: bank.DeletedAt.Valid}
		}
	}
	if len(groupedIDs[TypeSentenceBank]) > 0 {
		var banks []entity.SentenceBank
		if err := s.db.WithContext(ctx).Unscoped().Where("id IN ?", groupedIDs[TypeSentenceBank]).Find(&banks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		for _, bank := range banks {
			targets[targetKey(TypeSentenceBank, bank.ID)] = targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic, Exists: true, IsDeleted: bank.DeletedAt.Valid}
		}
	}
	if len(groupedIDs[TypeArticleBank]) > 0 {
		var banks []entity.ArticleBank
		if err := s.db.WithContext(ctx).Unscoped().Where("id IN ?", groupedIDs[TypeArticleBank]).Find(&banks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		for _, bank := range banks {
			targets[targetKey(TypeArticleBank, bank.ID)] = targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic, Exists: true, IsDeleted: bank.DeletedAt.Valid}
		}
	}

	return targets, nil
}

func (s *serviceImpl) loadTarget(ctx context.Context, libraryType, libraryID string) (*targetSummary, error) {
	switch libraryType {
	case TypeWordBank:
		var bank entity.WordBank
		if err := s.db.WithContext(ctx).First(&bank, "id = ?", libraryID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, gerror.NewCode(code.CodeNotFound, "word bank not found")
			}
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		return &targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic}, nil
	case TypeSentenceBank:
		var bank entity.SentenceBank
		if err := s.db.WithContext(ctx).First(&bank, "id = ?", libraryID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, gerror.NewCode(code.CodeNotFound, "sentence bank not found")
			}
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		return &targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic}, nil
	case TypeArticleBank:
		var bank entity.ArticleBank
		if err := s.db.WithContext(ctx).First(&bank, "id = ?", libraryID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, gerror.NewCode(code.CodeNotFound, "article bank not found")
			}
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		return &targetSummary{Name: bank.Name, OwnerID: bank.OwnerID, IsPublic: bank.IsPublic}, nil
	default:
		return nil, gerror.NewCode(code.CodeBadRequest, "invalid library_type")
	}
}

func isSupportedLibraryType(libraryType string) bool {
	switch libraryType {
	case TypeWordBank, TypeSentenceBank, TypeArticleBank:
		return true
	default:
		return false
	}
}

func targetKey(libraryType, libraryID string) string {
	return libraryType + ":" + libraryID
}

func availabilityForUser(target targetSummary, userID string) (bool, string) {
	if !target.Exists {
		return false, "library_missing"
	}
	if target.IsDeleted {
		return false, "library_deleted"
	}
	if target.OwnerID != userID && target.IsPublic == 0 {
		return false, "library_private"
	}
	return true, ""
}

func boolToInt(value bool) int {
	if value {
		return 1
	}
	return 0
}
