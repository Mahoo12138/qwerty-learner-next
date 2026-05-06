package contentaccess

import "testing"

func TestCanManageLibrary(t *testing.T) {
	tests := []struct {
		name     string
		ownerID  string
		userID   string
		userRole string
		want     bool
	}{
		{name: "owner can manage own library", ownerID: "user-1", userID: "user-1", userRole: "user", want: true},
		{name: "admin can manage system library", ownerID: "system", userID: "user-2", userRole: "admin", want: true},
		{name: "owner role can manage system library", ownerID: "system", userID: "user-3", userRole: "owner", want: true},
		{name: "normal user cannot manage system library", ownerID: "system", userID: "user-4", userRole: "user", want: false},
		{name: "admin cannot manage other user library", ownerID: "user-1", userID: "user-2", userRole: "admin", want: false},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got := CanManageLibrary(test.ownerID, test.userID, test.userRole)
			if got != test.want {
				t.Fatalf("CanManageLibrary() = %v, want %v", got, test.want)
			}
		})
	}
}