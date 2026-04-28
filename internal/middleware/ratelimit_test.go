package middleware

import (
	"testing"
	"time"
)

func resetLimitersForTest() {
	mu.Lock()
	defer mu.Unlock()
	limiters = make(map[string]*rateLimiterStore)
}

func TestRateLimiter_AllowBurstAndRefill(t *testing.T) {
	resetLimitersForTest()

	store := getOrCreateStore("test-burst", RateLimitConfig{
		MaxTokens:  1,
		RefillRate: 10,
	})
	ip := "127.0.0.1"

	if !store.allow(ip) {
		t.Fatal("first request should pass with initial token")
	}
	if store.allow(ip) {
		t.Fatal("second immediate request should be limited")
	}

	store.mu.Lock()
	store.buckets[ip].lastRefill = time.Now().Add(-200 * time.Millisecond)
	store.mu.Unlock()

	if !store.allow(ip) {
		t.Fatal("request should pass after refill window")
	}
}

func TestCleanupExpiredBuckets_RemovesStaleBucket(t *testing.T) {
	resetLimitersForTest()

	store := getOrCreateStore("test-cleanup", RateLimitConfig{
		MaxTokens:  2,
		RefillRate: 1,
	})
	ip := "10.0.0.1"

	if !store.allow(ip) {
		t.Fatal("seed request should pass")
	}

	store.mu.Lock()
	store.buckets[ip].lastRefill = time.Now().Add(-11 * time.Minute)
	store.mu.Unlock()

	CleanupExpiredBuckets()

	store.mu.Lock()
	_, exists := store.buckets[ip]
	store.mu.Unlock()
	if exists {
		t.Fatal("stale bucket should be removed")
	}
}

func TestCleanupExpiredBuckets_KeepsRecentBucket(t *testing.T) {
	resetLimitersForTest()

	store := getOrCreateStore("test-cleanup-keep", RateLimitConfig{
		MaxTokens:  2,
		RefillRate: 1,
	})
	ip := "10.0.0.2"

	if !store.allow(ip) {
		t.Fatal("seed request should pass")
	}

	store.mu.Lock()
	store.buckets[ip].lastRefill = time.Now().Add(-5 * time.Minute)
	store.mu.Unlock()

	CleanupExpiredBuckets()

	store.mu.Lock()
	_, exists := store.buckets[ip]
	store.mu.Unlock()
	if !exists {
		t.Fatal("recent bucket should not be removed")
	}
}
