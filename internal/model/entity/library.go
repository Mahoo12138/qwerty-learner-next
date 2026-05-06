package entity

import "time"

type LibrarySubscription struct {
	ID          string    `gorm:"primaryKey;type:text" json:"id"`
	UserID      string    `gorm:"type:text;not null;index" json:"user_id"`
	LibraryType string    `gorm:"type:text;not null" json:"library_type"`
	LibraryID   string    `gorm:"type:text;not null" json:"library_id"`
	CreatedAt   time.Time `json:"created_at"`
}

func (LibrarySubscription) TableName() string { return "library_subscriptions" }

type UserWordMastery struct {
	ID              string     `gorm:"primaryKey;type:text" json:"id"`
	UserID          string     `gorm:"type:text;not null;index" json:"user_id"`
	Lang            string     `gorm:"type:text;not null" json:"lang"`
	WordNorm        string     `gorm:"type:text;not null" json:"word_norm"`
	MasteryLevel    int        `gorm:"type:integer;not null;default:0" json:"mastery_level"`
	EaseFactor      float64    `gorm:"type:real;not null;default:2.5" json:"ease_factor"`
	NextReviewAt    *time.Time `json:"next_review_at"`
	LastPracticedAt *time.Time `json:"last_practiced_at"`
	TimesSeen       int        `gorm:"type:integer;not null;default:0" json:"times_seen"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

func (UserWordMastery) TableName() string { return "user_word_mastery" }
