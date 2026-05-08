import { createFileRoute } from '@tanstack/react-router'

import { DiscoverContentPage } from '@/pages/discover'

export const Route = createFileRoute('/discover')({
	component: DiscoverContentPage,
})