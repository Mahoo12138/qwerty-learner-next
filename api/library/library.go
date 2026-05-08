package library

import (
	"context"

	v1 "taptype/api/library/v1"
)

type ILibraryV1 interface {
	GetLibraryDiscovery(ctx context.Context, req *v1.GetLibraryDiscoveryReq) (res *v1.GetLibraryDiscoveryRes, err error)
	ListLibrarySubscriptions(ctx context.Context, req *v1.ListLibrarySubscriptionsReq) (res *v1.ListLibrarySubscriptionsRes, err error)
	CreateLibrarySubscription(ctx context.Context, req *v1.CreateLibrarySubscriptionReq) (res *v1.CreateLibrarySubscriptionRes, err error)
	DeleteLibrarySubscription(ctx context.Context, req *v1.DeleteLibrarySubscriptionReq) (res *v1.DeleteLibrarySubscriptionRes, err error)
}
