import { createFileRoute } from '@tanstack/react-router'
import { PracticePage } from '@/pages/practice/PracticePage'

function PracticeRoute() {
  const { sessionId } = Route.useSearch()
  return <PracticePage resumeSessionId={sessionId} />
}

export const Route = createFileRoute('/practice')({
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: typeof search.sessionId === 'string' && search.sessionId.length > 0 ? search.sessionId : undefined,
  }),
  component: PracticeRoute,
})