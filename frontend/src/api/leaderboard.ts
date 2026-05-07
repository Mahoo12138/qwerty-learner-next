import { useQuery } from '@tanstack/react-query'
import { request } from './client'
import type {
  LeaderboardMetricDefinition,
  LeaderboardMetricKey,
  LeaderboardMyRank,
  LeaderboardPeriod,
  LeaderboardResponse,
} from '@/types/api'

export const DEFAULT_LEADERBOARD_METRICS: LeaderboardMetricDefinition[] = [
  {
    key: 'best_wpm',
    label: '极速冲刺',
    description: '单次练习最高 WPM，适合看峰值速度。',
    unit: 'WPM',
    supports_period: true,
  },
  {
    key: 'avg_wpm',
    label: '稳定巡航',
    description: '窗口内平均 WPM，更能反映持续输出。',
    unit: 'WPM',
    supports_period: true,
  },
  {
    key: 'total_chars',
    label: '码字里程',
    description: '累计输入字符数，衡量总训练量。',
    unit: 'chars',
    supports_period: true,
  },
  {
    key: 'total_duration_ms',
    label: '训练时长',
    description: '累计练习时长，适合观察投入强度。',
    unit: 'duration',
    supports_period: true,
  },
  {
    key: 'current_streak',
    label: '当前连胜',
    description: '连续练习天数，代表最近状态。',
    unit: 'days',
    supports_period: false,
  },
  {
    key: 'longest_streak',
    label: '历史连胜',
    description: '历史最高连续练习天数。',
    unit: 'days',
    supports_period: false,
  },
  {
    key: 'mastered_words',
    label: '掌握词数',
    description: '已掌握的词项规模，体现长期积累。',
    unit: 'items',
    supports_period: false,
  },
  {
    key: 'wordbanks_owned',
    label: '自建词库',
    description: '公开词库数量，适合内容创作者。',
    unit: 'items',
    supports_period: false,
  },
  {
    key: 'achievements_unlocked',
    label: '成就点亮',
    description: '已解锁成就数，展示训练广度。',
    unit: 'items',
    supports_period: false,
  },
]

export function useLeaderboardMetrics() {
  return useQuery({
    queryKey: ['leaderboard', 'metrics'],
    queryFn: async () => {
      try {
        return await request<LeaderboardMetricDefinition[]>('/leaderboard/metrics')
      } catch {
        return DEFAULT_LEADERBOARD_METRICS
      }
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useLeaderboard(metric: LeaderboardMetricKey, period: LeaderboardPeriod, limit = 20) {
  return useQuery({
    queryKey: ['leaderboard', 'board', metric, period, limit],
    queryFn: () => request<LeaderboardResponse>(`/leaderboard/${metric}?period=${encodeURIComponent(period)}&limit=${limit}`),
    placeholderData: (previous) => previous,
  })
}

export function useMyRank(metric: LeaderboardMetricKey, period: LeaderboardPeriod, enabled = true) {
  return useQuery({
    queryKey: ['leaderboard', 'me', metric, period],
    queryFn: () => request<LeaderboardMyRank>(`/leaderboard/me?metric=${encodeURIComponent(metric)}&period=${encodeURIComponent(period)}`),
    enabled,
    placeholderData: (previous) => previous,
  })
}