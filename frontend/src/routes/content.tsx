import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/pages/content'
import type { ContentTab } from '@/pages/content'

const contentTabs = ['word', 'sentence', 'article'] as const

function parseContentTab(value: unknown): ContentTab {
  return typeof value === 'string' && contentTabs.includes(value as ContentTab)
    ? (value as ContentTab)
    : 'word'
}

function parsePositiveInt(value: unknown, fallback: number) {
  if (typeof value !== 'string') return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const Route = createFileRoute('/content')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: parseContentTab(search.tab),
    wordPage: parsePositiveInt(search.wordPage, 1),
  }),
  component: function ContentRoute() {
    const { tab, wordPage } = Route.useSearch()
    return <ContentPage tab={tab} wordPage={wordPage} />
  },
})
