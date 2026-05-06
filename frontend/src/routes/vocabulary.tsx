import { createFileRoute } from '@tanstack/react-router'

import { VocabularyPage } from '@/pages/vocabulary/VocabularyPage'

export const Route = createFileRoute('/vocabulary')({
  component: VocabularyPage,
})