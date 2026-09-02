import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { usePublicSystemSettings } from '@/api/settings'
import { useAdaptiveProfile, useCreateAdaptiveSession } from '@/api/adaptive'
import { useDaily } from '@/api/daily'
import { useSummary } from '@/api/analysis'
import { useReviewQueue } from '@/api/errors'
import { useGoals } from '@/api/goals'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import * as css from './index.css'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const publicSettings = usePublicSystemSettings(['system.owner_user_id'])

  if (!user && publicSettings.isLoading) {
    return null
  }

  if (!user) {
    const ownerUserID = publicSettings.data?.['system.owner_user_id'] ?? ''
    if (!ownerUserID.trim()) {
      navigate({ to: '/register-admin' })
    } else {
      navigate({ to: '/login' })
    }
    return null
  }

  return (
    <div className={css.page}>
      <div className={css.header}>
        <h1 className={css.headerTitle}>欢迎回来，{user.nickname || user.username}</h1>
        <p className={css.headerSubtitle}>继续今天的练习，保持进步</p>
      </div>

      <div className={css.contentStack}>
        <TodaySection />
        <WeakKeysSection />
        <GoalsOverview />
        <SummarySection />
        <QuickActions />
      </div>
    </div>
  )
}

function TodaySection() {
  const { data: daily } = useDaily()
  const { data: queue } = useReviewQueue(50)

  const reviewCount = queue?.total ?? 0

  return (
    <section className={css.sectionTight}>
      <div className={css.todayGrid}>
        <div className={css.streakCard}>
          <span className={css.streakEmoji}>🔥</span>
          <div>
            <div className={css.streakNumber}>{daily?.streak_day ?? 0}</div>
            <div className={css.streakUnit}>天</div>
          </div>
          <div className={css.streakBottomLabel}>连续打卡</div>
        </div>

        <div className={css.practiceCard}>
          <span className={css.statLabel}>今日练习</span>
          <span className={css.statValue}>{daily?.practice_count ?? 0} 次</span>
          <div className={css.statAccentDot} />
        </div>

        <div className={css.durationCard}>
          <span className={css.statLabel}>今日用时</span>
          <span className={css.statValue}>{formatDuration(daily?.total_duration_ms ?? 0)}</span>
          <div className={css.statAccentDot} />
        </div>

        <div className={reviewCount > 0 ? css.reviewCardAlert : css.reviewCard}>
          <div className={css.statGroup}>
            <span className={css.statLabel}>待复习</span>
            <span className={css.statValue}>{reviewCount} 个</span>
          </div>
          <div className={reviewCount > 0 ? css.statAccentDotWarning : css.statAccentDotSuccess} />
        </div>
      </div>
    </section>
  )
}

function WeakKeysSection() {
  const navigate = useNavigate()
  const { data: profile, isLoading } = useAdaptiveProfile()
  const createAdaptiveSession = useCreateAdaptiveSession()

  if (isLoading || !profile?.has_data || profile.weak_keys.length === 0) return null

  const topKeys = profile.weak_keys.slice(0, 5)
  const keyLabels = topKeys.map((weakKey) => weakKey.key_char.toUpperCase()).join(' / ')
  const avgErrorRate = topKeys.reduce((sum, weakKey) => sum + weakKey.error_rate, 0) / topKeys.length
  const slowerKeys = topKeys.filter((weakKey) => weakKey.interval_delta > 0.05)

  const startTraining = () => {
    createAdaptiveSession.mutate({}, {
      onSuccess: (result) => {
        void navigate({ to: '/practice', search: { sessionId: result.session.id } })
      },
    })
  }

  return (
    <section className={css.sectionNormal}>
      <div className={css.sectionHeadCompact}>
        <span className={css.sectionLabel}>今日弱项</span>
      </div>
      <div className={css.weakCard}>
        <div className={css.weakInfo}>
          <div className={css.weakKeysRow}>
            {topKeys.map((weakKey) => (
              <span key={weakKey.key_char} className={css.weakKeyChip}>{weakKey.key_char}</span>
            ))}
          </div>
          <p className={css.weakHint}>
            {keyLabels} 的整体错误率约 {(avgErrorRate * 100).toFixed(1)}%
            {slowerKeys.length > 0 &&
              `，其中 ${slowerKeys.map((weakKey) => weakKey.key_char.toUpperCase()).join(' / ')} 的击键间隔明显慢于你的平均水平`}
            。针对性训练会优先选择包含这些键位的单词。
          </p>
        </div>
        <Button onClick={startTraining} disabled={createAdaptiveSession.isPending}>
          {createAdaptiveSession.isPending ? '生成中...' : '开始针对性训练'}
        </Button>
      </div>
    </section>
  )
}

const GOAL_TYPE_LABELS: Record<string, string> = {
  duration: '练习时长',
  wpm: '平均 WPM',
  accuracy: '准确率',
  practice_count: '练习次数',
}

function GoalsOverview() {
  const { data: goals = [] } = useGoals()
  const navigate = useNavigate()
  const active = goals.filter((g) => g.is_active === 1)

  if (active.length === 0) return null

  return (
    <section className={css.sectionNormal}>
      <div className={css.sectionHead}>
        <span className={css.sectionLabel}>今日目标</span>
        <Button variant="link" size="sm" onClick={() => navigate({ to: '/goals' })}>
          管理目标 →
        </Button>
      </div>
      <div className={css.goalsGrid}>
        {active.slice(0, 3).map((goal) => {
          const progress = goal.target_value > 0
            ? Math.min(100, (goal.current_value / goal.target_value) * 100)
            : 0
          const done = progress >= 100
          return (
            <div key={goal.id} className={css.goalItem}>
              <div className={css.goalItemHeader}>
                <span className={css.goalType}>
                  {GOAL_TYPE_LABELS[goal.goal_type] ?? goal.goal_type}
                </span>
                {done && <Badge variant="success">已完成</Badge>}
              </div>
              <div className={css.goalValues}>
                {Math.round(goal.current_value)} / {Math.round(goal.target_value)}
              </div>
              <div className={css.goalTrack}>
                <div
                  className={done ? css.goalFillDone : css.goalFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function SummarySection() {
  const { data: summary } = useSummary()

  if (!summary) return null

  return (
    <section className={css.sectionNormal}>
      <div className={css.sectionHeadCompact}>
        <span className={css.sectionLabel}>累计统计</span>
      </div>
      <div className={css.summaryStrip}>
        <div className={css.summaryItem}>
          <span className={css.summaryValue}>{summary.total_sessions}</span>
          <span className={css.summaryLabel}>总练习次数</span>
        </div>
        <div className={css.summaryItem}>
          <span className={css.summaryValue}>{summary.best_wpm.toFixed(1)}</span>
          <span className={css.summaryLabel}>最佳 WPM</span>
        </div>
        <div className={css.summaryItem}>
          <span className={css.summaryValue}>{(summary.avg_accuracy * 100).toFixed(1)}%</span>
          <span className={css.summaryLabel}>平均准确率</span>
        </div>
        <div className={css.summaryItem}>
          <span className={css.summaryValue}>{summary.longest_streak} 天</span>
          <span className={css.summaryLabel}>最长连续</span>
        </div>
      </div>
    </section>
  )
}

function QuickActions() {
  const navigate = useNavigate()
  return (
    <section className={css.sectionLoose}>
      <div className={css.sectionHeadCompact}>
        <span className={css.sectionLabel}>快速开始</span>
      </div>
      <div className={css.actionsRow}>
        <Button
          variant="default"
          onClick={() => navigate({ to: '/practice', search: { sessionId: undefined } })}
        >
          开始练习
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/errors' })}>
          复习错题
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/analysis' })}>
          查看分析
        </Button>
      </div>
    </section>
  )
}

function formatDuration(ms: number): string {
  if (ms === 0) return '0 分'
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes} 分`
  const hours = Math.floor(minutes / 60)
  const rem = minutes % 60
  return `${hours}h ${rem}m`
}