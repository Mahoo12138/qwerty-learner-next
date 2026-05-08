package v1

import "github.com/gogf/gf/v2/frame/g"

type GetLibraryDiscoveryReq struct {
	g.Meta `path:"/library-discovery" method:"get" tags:"Library" summary:"Get discoverable libraries grouped for the discovery page"`
}

type GetLibraryDiscoveryRes struct {
	SystemLibraries    interface{} `json:"system_libraries"`
	CommunityLibraries interface{} `json:"community_libraries"`
	Subscriptions      interface{} `json:"subscriptions"`
}

type ListLibrarySubscriptionsReq struct {
	g.Meta      `path:"/library-subscriptions" method:"get" tags:"Library" summary:"List library subscriptions"`
	LibraryType string `json:"library_type" in:"query"`
}

type ListLibrarySubscriptionsRes struct {
	List interface{} `json:"list"`
}

type CreateLibrarySubscriptionReq struct {
	g.Meta      `path:"/library-subscriptions" method:"post" tags:"Library" summary:"Subscribe to a library"`
	LibraryType string `json:"library_type" v:"required#library_type is required"`
	LibraryID   string `json:"library_id" v:"required#library_id is required"`
}

type CreateLibrarySubscriptionRes struct{}

type DeleteLibrarySubscriptionReq struct {
	g.Meta      `path:"/library-subscriptions/{libraryType}/{libraryId}" method:"delete" tags:"Library" summary:"Unsubscribe from a library"`
	LibraryType string `json:"libraryType" in:"path"`
	LibraryID   string `json:"libraryId" in:"path"`
}

type DeleteLibrarySubscriptionRes struct{}
