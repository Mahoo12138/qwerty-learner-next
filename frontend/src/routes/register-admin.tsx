import { createFileRoute } from '@tanstack/react-router'
import { RegisterAdminPage } from '@/pages/register-admin'

export const Route = createFileRoute('/register-admin')({
  component: RegisterAdminPage,
})
