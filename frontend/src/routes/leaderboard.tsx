import { createFileRoute } from '@tanstack/react-router'
import { LeaderboardPage } from '../pages/leaderboard/LeaderboardPage'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})