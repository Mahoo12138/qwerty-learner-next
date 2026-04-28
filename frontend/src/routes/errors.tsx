import { createFileRoute } from '@tanstack/react-router'
import { ErrorsPage } from '@/pages/errors'

export const Route = createFileRoute('/errors')({
  component: ErrorsPage,
})
