package contentaccess

const systemOwnerID = "system"

func CanManageLibrary(ownerID, userID, userRole string) bool {
	if ownerID == userID {
		return true
	}

	if ownerID != systemOwnerID {
		return false
	}

	return userRole == "admin" || userRole == "owner"
}