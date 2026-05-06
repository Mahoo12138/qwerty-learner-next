import { Bookmark, Compass, FolderOpen, Sparkles, type LucideIcon } from 'lucide-react'

import type {
  ArticleBank,
  ContentLibraryType,
  LibrarySubscriptionItem,
  SentenceBank,
  User,
  WordBank,
} from '@/types/api'

export type ContentStage = 'owned' | 'system' | 'discover' | 'subscriptions'

export type ContentBank = WordBank | SentenceBank | ArticleBank

export interface StageDefinition {
  key: ContentStage
  label: string
  description: string
  icon: LucideIcon
}

export interface LibraryCardData {
  id: string
  title: string
  caption: string
  meta: string
  badges: Array<{ label: string; variant: 'default' | 'secondary' | 'outline' | 'warning' | 'success' | 'destructive' }>
}

export const CONTENT_STAGES: StageDefinition[] = [
  { key: 'owned', label: '我的内容', description: '创建与维护自己的内容库', icon: FolderOpen },
  { key: 'system', label: '系统内容', description: '平台默认内容，普通用户只读', icon: Sparkles },
  { key: 'discover', label: '公开发现', description: '浏览全站公开内容并订阅', icon: Compass },
  { key: 'subscriptions', label: '我的订阅', description: '保留订阅入口并处理失效状态', icon: Bookmark },
]

export function isPrivilegedUser(user: User | null) {
  return user?.role === 'admin' || user?.role === 'owner'
}

export function isSystemLibrary(ownerID: string) {
  return ownerID === 'system'
}

export function canManageLibrary(bank: ContentBank | null | undefined, user: User | null) {
  if (!bank || !user) {
    return false
  }
  if (bank.owner_id === user.id) {
    return true
  }
  return isSystemLibrary(bank.owner_id) && isPrivilegedUser(user)
}

export function groupBanksByStage<T extends ContentBank>(banks: T[], user: User | null) {
  const userID = user?.id
  return {
    owned: banks.filter((bank) => bank.owner_id === userID),
    system: banks.filter((bank) => isSystemLibrary(bank.owner_id)),
    discover: banks.filter(
      (bank) => bank.is_public === 1 && bank.owner_id !== userID && !isSystemLibrary(bank.owner_id),
    ),
  }
}

export function isSubscribed(subscriptions: LibrarySubscriptionItem[], bankID: string) {
  if (!Array.isArray(subscriptions)) {
    return false
  }
  return subscriptions.some((subscription) => subscription.library_id === bankID)
}

export function subscriptionByLibraryID(
  subscriptions: LibrarySubscriptionItem[],
  libraryID: string,
) {
  if (!Array.isArray(subscriptions)) {
    return undefined
  }
  return subscriptions.find((subscription) => subscription.library_id === libraryID)
}

export function visibilityLabel(isPublic: number) {
  return isPublic === 1 ? '公开' : '私有'
}

export const LIBRARY_LANGUAGE_OPTIONS = [
  { value: 'en', label: '英语' },
  { value: 'other', label: '其他' },
] as const

export type LibraryLanguageValue = (typeof LIBRARY_LANGUAGE_OPTIONS)[number]['value']

export function normalizeLibraryLanguage(language?: string | null): LibraryLanguageValue {
  return language === 'en' ? 'en' : 'other'
}

export function libraryLanguageLabel(language?: string | null) {
  return normalizeLibraryLanguage(language) === 'en' ? '英语' : '其他'
}

export function librarySourceLabel(bank: ContentBank, user: User | null) {
  if (bank.owner_id === user?.id) {
    return '我的内容'
  }
  if (isSystemLibrary(bank.owner_id)) {
    return '系统默认'
  }
  return '公开社区'
}

export function unavailabilityText(reason?: string) {
  switch (reason) {
    case 'library_private':
      return '源库已转为不公开，仅保留订阅占位，不能继续基于它开新练习。'
    case 'library_deleted':
      return '源库已删除，保留这条订阅只是为了让你知道它曾存在。'
    case 'library_missing':
      return '源库已不可解析，建议取消订阅。'
    default:
      return '源库暂不可用。'
  }
}

export function countLabel(kind: ContentLibraryType, count?: number | null) {
  const safeCount = typeof count === 'number' && Number.isFinite(count) ? count : 0

  switch (kind) {
    case 'word_bank':
      return `${safeCount} 个词条`
    case 'sentence_bank':
      return `${safeCount} 条句子`
    case 'article_bank':
      return `${safeCount} 篇文章`
    default:
      return `${safeCount} 项`
  }
}