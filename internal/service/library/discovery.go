package library

import (
	"context"
	"sort"
	"strings"
	"time"

	"github.com/gogf/gf/v2/errors/gerror"
	"gorm.io/gorm"

	"taptype/internal/model/code"
	"taptype/internal/model/entity"
)

const systemLibraryOwnerID = "00000000-0000-0000-0000-000000000001"

type DiscoveryResult struct {
	SystemLibraries    []DiscoveryLibraryItem      `json:"system_libraries"`
	CommunityLibraries []DiscoveryLibraryItem      `json:"community_libraries"`
	Subscriptions      []DiscoverySubscriptionItem `json:"subscriptions"`
}

type DiscoveryLibraryItem struct {
	ID           string     `json:"id"`
	LibraryType  string     `json:"library_type"`
	Name         string     `json:"name"`
	Description  string     `json:"description,omitempty"`
	Language     string     `json:"language,omitempty"`
	Category     string     `json:"category,omitempty"`
	OwnerID      string     `json:"owner_id"`
	IsPublic     int        `json:"is_public"`
	IsSystem     int        `json:"is_system"`
	ItemCount    int64      `json:"item_count"`
	IsSubscribed int        `json:"is_subscribed"`
	CreatedAt    *time.Time `json:"created_at,omitempty"`
	UpdatedAt    *time.Time `json:"updated_at,omitempty"`
}

type DiscoverySubscriptionItem struct {
	DiscoveryLibraryItem
	SubscriptionID    string    `json:"subscription_id"`
	SubscribedAt      time.Time `json:"subscribed_at"`
	IsAvailable       int       `json:"is_available"`
	UnavailableReason string    `json:"unavailable_reason,omitempty"`
}

type bankCountRow struct {
	BankID string `gorm:"column:bank_id"`
	Total  int64  `gorm:"column:total"`
}

func (s *serviceImpl) ListDiscovery(ctx context.Context, userID string) (*DiscoveryResult, error) {
	subscriptions, err := s.ListSubscriptions(ctx, userID, "")
	if err != nil {
		return nil, err
	}

	subscribedKeys := make(map[string]struct{}, len(subscriptions))
	for _, subscription := range subscriptions {
		subscribedKeys[targetKey(subscription.LibraryType, subscription.LibraryID)] = struct{}{}
	}

	publicLibraries, err := s.listPublicDiscoveryLibraries(ctx, userID, subscribedKeys)
	if err != nil {
		return nil, err
	}

	systemLibraries := make([]DiscoveryLibraryItem, 0, len(publicLibraries))
	communityLibraries := make([]DiscoveryLibraryItem, 0, len(publicLibraries))
	for _, item := range publicLibraries {
		if item.IsSystem == 1 {
			systemLibraries = append(systemLibraries, item)
			continue
		}
		communityLibraries = append(communityLibraries, item)
	}

	subscriptionItems, err := s.buildDiscoverySubscriptions(ctx, userID, subscriptions)
	if err != nil {
		return nil, err
	}

	sortDiscoveryLibraries(systemLibraries)
	sortDiscoveryLibraries(communityLibraries)
	sortDiscoverySubscriptions(subscriptionItems)

	return &DiscoveryResult{
		SystemLibraries:    systemLibraries,
		CommunityLibraries: communityLibraries,
		Subscriptions:      subscriptionItems,
	}, nil
}

func (s *serviceImpl) listPublicDiscoveryLibraries(ctx context.Context, userID string, subscribedKeys map[string]struct{}) ([]DiscoveryLibraryItem, error) {
	items := make([]DiscoveryLibraryItem, 0)

	var wordBanks []entity.WordBank
	if err := s.db.WithContext(ctx).
		Where("is_public = 1 AND owner_id <> ?", userID).
		Find(&wordBanks).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	wordItems, err := s.discoveryItemsFromWordBanks(ctx, wordBanks, subscribedKeys)
	if err != nil {
		return nil, err
	}
	items = append(items, wordItems...)

	var sentenceBanks []entity.SentenceBank
	if err := s.db.WithContext(ctx).
		Where("is_public = 1 AND owner_id <> ?", userID).
		Find(&sentenceBanks).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	sentenceItems, err := s.discoveryItemsFromSentenceBanks(ctx, sentenceBanks, subscribedKeys)
	if err != nil {
		return nil, err
	}
	items = append(items, sentenceItems...)

	var articleBanks []entity.ArticleBank
	if err := s.db.WithContext(ctx).
		Where("is_public = 1 AND owner_id <> ?", userID).
		Find(&articleBanks).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}
	articleItems, err := s.discoveryItemsFromArticleBanks(ctx, articleBanks, subscribedKeys)
	if err != nil {
		return nil, err
	}
	items = append(items, articleItems...)

	return items, nil
}

func (s *serviceImpl) buildDiscoverySubscriptions(ctx context.Context, userID string, subscriptions []SubscriptionItem) ([]DiscoverySubscriptionItem, error) {
	itemMap, err := s.loadDiscoveryItemMapByIDs(ctx, subscriptions)
	if err != nil {
		return nil, err
	}

	items := make([]DiscoverySubscriptionItem, 0, len(subscriptions))
	for _, subscription := range subscriptions {
		if isOwnedByCurrentUser(subscription.LibraryOwnerID, userID) {
			continue
		}

		item, ok := itemMap[targetKey(subscription.LibraryType, subscription.LibraryID)]
		if !ok {
			item = DiscoveryLibraryItem{
				ID:           subscription.LibraryID,
				LibraryType:  subscription.LibraryType,
				Name:         fallbackDiscoveryName(subscription.LibraryType, subscription.LibraryName),
				OwnerID:      subscription.LibraryOwnerID,
				IsPublic:     subscription.LibraryIsPublic,
				IsSystem:     boolToInt(isSystemLibraryOwner(subscription.LibraryOwnerID)),
				IsSubscribed: 1,
			}
		}

		item.IsSubscribed = 1
		items = append(items, DiscoverySubscriptionItem{
			DiscoveryLibraryItem: item,
			SubscriptionID:       subscription.ID,
			SubscribedAt:         subscription.CreatedAt,
			IsAvailable:          subscription.IsAvailable,
			UnavailableReason:    subscription.UnavailableReason,
		})
	}

	return items, nil
}

func (s *serviceImpl) loadDiscoveryItemMapByIDs(ctx context.Context, subscriptions []SubscriptionItem) (map[string]DiscoveryLibraryItem, error) {
	wordIDs := make([]string, 0)
	sentenceIDs := make([]string, 0)
	articleIDs := make([]string, 0)
	subscribedKeys := make(map[string]struct{}, len(subscriptions))

	for _, subscription := range subscriptions {
		subscribedKeys[targetKey(subscription.LibraryType, subscription.LibraryID)] = struct{}{}
		if subscription.IsAvailable != 1 {
			continue
		}

		switch subscription.LibraryType {
		case TypeWordBank:
			wordIDs = append(wordIDs, subscription.LibraryID)
		case TypeSentenceBank:
			sentenceIDs = append(sentenceIDs, subscription.LibraryID)
		case TypeArticleBank:
			articleIDs = append(articleIDs, subscription.LibraryID)
		}
	}

	itemMap := make(map[string]DiscoveryLibraryItem, len(subscriptions))

	if len(wordIDs) > 0 {
		var wordBanks []entity.WordBank
		if err := s.db.WithContext(ctx).Where("id IN ?", wordIDs).Find(&wordBanks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		wordItems, err := s.discoveryItemsFromWordBanks(ctx, wordBanks, subscribedKeys)
		if err != nil {
			return nil, err
		}
		for _, item := range wordItems {
			itemMap[targetKey(item.LibraryType, item.ID)] = item
		}
	}

	if len(sentenceIDs) > 0 {
		var sentenceBanks []entity.SentenceBank
		if err := s.db.WithContext(ctx).Where("id IN ?", sentenceIDs).Find(&sentenceBanks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		sentenceItems, err := s.discoveryItemsFromSentenceBanks(ctx, sentenceBanks, subscribedKeys)
		if err != nil {
			return nil, err
		}
		for _, item := range sentenceItems {
			itemMap[targetKey(item.LibraryType, item.ID)] = item
		}
	}

	if len(articleIDs) > 0 {
		var articleBanks []entity.ArticleBank
		if err := s.db.WithContext(ctx).Where("id IN ?", articleIDs).Find(&articleBanks).Error; err != nil {
			return nil, gerror.NewCode(code.CodeInternalError, err.Error())
		}
		articleItems, err := s.discoveryItemsFromArticleBanks(ctx, articleBanks, subscribedKeys)
		if err != nil {
			return nil, err
		}
		for _, item := range articleItems {
			itemMap[targetKey(item.LibraryType, item.ID)] = item
		}
	}

	return itemMap, nil
}

func (s *serviceImpl) discoveryItemsFromWordBanks(ctx context.Context, banks []entity.WordBank, subscribedKeys map[string]struct{}) ([]DiscoveryLibraryItem, error) {
	counts, err := s.wordCountsByBankID(ctx, collectWordBankIDs(banks))
	if err != nil {
		return nil, err
	}

	items := make([]DiscoveryLibraryItem, 0, len(banks))
	for _, bank := range banks {
		items = append(items, newDiscoveryWordBankItem(bank, counts[bank.ID], hasDiscoverySubscription(subscribedKeys, TypeWordBank, bank.ID)))
	}
	return items, nil
}

func (s *serviceImpl) discoveryItemsFromSentenceBanks(ctx context.Context, banks []entity.SentenceBank, subscribedKeys map[string]struct{}) ([]DiscoveryLibraryItem, error) {
	counts, err := s.sentenceCountsByBankID(ctx, collectSentenceBankIDs(banks))
	if err != nil {
		return nil, err
	}

	items := make([]DiscoveryLibraryItem, 0, len(banks))
	for _, bank := range banks {
		items = append(items, newDiscoverySentenceBankItem(bank, counts[bank.ID], hasDiscoverySubscription(subscribedKeys, TypeSentenceBank, bank.ID)))
	}
	return items, nil
}

func (s *serviceImpl) discoveryItemsFromArticleBanks(ctx context.Context, banks []entity.ArticleBank, subscribedKeys map[string]struct{}) ([]DiscoveryLibraryItem, error) {
	counts, err := s.articleCountsByBankID(ctx, collectArticleBankIDs(banks))
	if err != nil {
		return nil, err
	}

	items := make([]DiscoveryLibraryItem, 0, len(banks))
	for _, bank := range banks {
		items = append(items, newDiscoveryArticleBankItem(bank, counts[bank.ID], hasDiscoverySubscription(subscribedKeys, TypeArticleBank, bank.ID)))
	}
	return items, nil
}

func (s *serviceImpl) wordCountsByBankID(ctx context.Context, bankIDs []string) (map[string]int64, error) {
	return groupedCountByBankID(ctx, s.db.WithContext(ctx).Model(&entity.Word{}), bankIDs)
}

func (s *serviceImpl) sentenceCountsByBankID(ctx context.Context, bankIDs []string) (map[string]int64, error) {
	return groupedCountByBankID(ctx, s.db.WithContext(ctx).Model(&entity.Sentence{}), bankIDs)
}

func (s *serviceImpl) articleCountsByBankID(ctx context.Context, bankIDs []string) (map[string]int64, error) {
	return groupedCountByBankID(ctx, s.db.WithContext(ctx).Model(&entity.Article{}), bankIDs)
}

func groupedCountByBankID(ctx context.Context, query *gorm.DB, bankIDs []string) (map[string]int64, error) {
	if len(bankIDs) == 0 {
		return map[string]int64{}, nil
	}

	var rows []bankCountRow
	if err := query.
		Select("bank_id, COUNT(*) AS total").
		Where("bank_id IN ?", bankIDs).
		Group("bank_id").
		Find(&rows).Error; err != nil {
		return nil, gerror.NewCode(code.CodeInternalError, err.Error())
	}

	counts := make(map[string]int64, len(rows))
	for _, row := range rows {
		counts[row.BankID] = row.Total
	}
	return counts, nil
}

func collectWordBankIDs(banks []entity.WordBank) []string {
	ids := make([]string, 0, len(banks))
	for _, bank := range banks {
		ids = append(ids, bank.ID)
	}
	return ids
}

func collectSentenceBankIDs(banks []entity.SentenceBank) []string {
	ids := make([]string, 0, len(banks))
	for _, bank := range banks {
		ids = append(ids, bank.ID)
	}
	return ids
}

func collectArticleBankIDs(banks []entity.ArticleBank) []string {
	ids := make([]string, 0, len(banks))
	for _, bank := range banks {
		ids = append(ids, bank.ID)
	}
	return ids
}

func newDiscoveryWordBankItem(bank entity.WordBank, itemCount int64, subscribed bool) DiscoveryLibraryItem {
	createdAt := bank.CreatedAt
	updatedAt := bank.UpdatedAt
	return DiscoveryLibraryItem{
		ID:           bank.ID,
		LibraryType:  TypeWordBank,
		Name:         bank.Name,
		Description:  strings.TrimSpace(bank.Description),
		Language:     bank.Language,
		OwnerID:      bank.OwnerID,
		IsPublic:     bank.IsPublic,
		IsSystem:     boolToInt(isSystemLibraryOwner(bank.OwnerID)),
		ItemCount:    itemCount,
		IsSubscribed: boolToInt(subscribed),
		CreatedAt:    &createdAt,
		UpdatedAt:    &updatedAt,
	}
}

func newDiscoverySentenceBankItem(bank entity.SentenceBank, itemCount int64, subscribed bool) DiscoveryLibraryItem {
	createdAt := bank.CreatedAt
	updatedAt := bank.UpdatedAt
	return DiscoveryLibraryItem{
		ID:           bank.ID,
		LibraryType:  TypeSentenceBank,
		Name:         bank.Name,
		Category:     strings.TrimSpace(bank.Category),
		OwnerID:      bank.OwnerID,
		IsPublic:     bank.IsPublic,
		IsSystem:     boolToInt(isSystemLibraryOwner(bank.OwnerID)),
		ItemCount:    itemCount,
		IsSubscribed: boolToInt(subscribed),
		CreatedAt:    &createdAt,
		UpdatedAt:    &updatedAt,
	}
}

func newDiscoveryArticleBankItem(bank entity.ArticleBank, itemCount int64, subscribed bool) DiscoveryLibraryItem {
	createdAt := bank.CreatedAt
	updatedAt := bank.UpdatedAt
	return DiscoveryLibraryItem{
		ID:           bank.ID,
		LibraryType:  TypeArticleBank,
		Name:         bank.Name,
		Description:  strings.TrimSpace(bank.Description),
		Language:     bank.Language,
		OwnerID:      bank.OwnerID,
		IsPublic:     bank.IsPublic,
		IsSystem:     boolToInt(isSystemLibraryOwner(bank.OwnerID)),
		ItemCount:    itemCount,
		IsSubscribed: boolToInt(subscribed),
		CreatedAt:    &createdAt,
		UpdatedAt:    &updatedAt,
	}
}

func hasDiscoverySubscription(subscribedKeys map[string]struct{}, libraryType, libraryID string) bool {
	_, ok := subscribedKeys[targetKey(libraryType, libraryID)]
	return ok
}

func sortDiscoveryLibraries(items []DiscoveryLibraryItem) {
	sort.SliceStable(items, func(i, j int) bool {
		leftUpdatedAt := discoveryTimeValue(items[i].UpdatedAt)
		rightUpdatedAt := discoveryTimeValue(items[j].UpdatedAt)
		if !leftUpdatedAt.Equal(rightUpdatedAt) {
			return leftUpdatedAt.After(rightUpdatedAt)
		}
		return items[i].Name < items[j].Name
	})
}

func sortDiscoverySubscriptions(items []DiscoverySubscriptionItem) {
	sort.SliceStable(items, func(i, j int) bool {
		if !items[i].SubscribedAt.Equal(items[j].SubscribedAt) {
			return items[i].SubscribedAt.After(items[j].SubscribedAt)
		}
		return items[i].Name < items[j].Name
	})
}

func discoveryTimeValue(value *time.Time) time.Time {
	if value == nil {
		return time.Time{}
	}
	return *value
}

func isSystemLibraryOwner(ownerID string) bool {
	normalized := strings.ToLower(strings.TrimSpace(ownerID))
	return normalized == "system" || normalized == systemLibraryOwnerID
}

func fallbackDiscoveryName(libraryType, name string) string {
	if strings.TrimSpace(name) != "" {
		return name
	}

	switch libraryType {
	case TypeWordBank:
		return "不可用词库"
	case TypeSentenceBank:
		return "不可用句库"
	case TypeArticleBank:
		return "不可用文章库"
	default:
		return "不可用内容库"
	}
}

func isOwnedByCurrentUser(ownerID, userID string) bool {
	if strings.TrimSpace(userID) == "" {
		return false
	}
	return strings.TrimSpace(ownerID) == strings.TrimSpace(userID)
}