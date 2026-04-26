import { createFileRoute } from '@tanstack/react-router'
import { HistorySessionDetailPage as HistorySessionDetailView } from '../pages/history/session'

export const Route = createFileRoute('/history/$sessionId')({
  component: HistorySessionDetailPage,
})

function HistorySessionDetailPage() {
  const { sessionId } = Route.useParams()
  return <HistorySessionDetailView sessionId={sessionId} />
}