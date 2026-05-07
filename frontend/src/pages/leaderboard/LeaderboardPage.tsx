import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Award, Clock3, Crown, Flame, LibraryBig, Medal, Sparkles, TimerReset, Trophy, UserRoundX, Zap } from 'lucide-react'
import { useLeaderboard, useLeaderboardMetrics, useMyRank } from '@/api/leaderboard'
import { useUserSettings } from '@/api/settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/core/Avatar'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { Card, CardContent } from '@/components/core/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core/Select'
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/core/Sheet'
import { useAuthStore } from '@/stores/authStore'
import type {
  LeaderboardEntry,
  LeaderboardMetricKey,
  LeaderboardPeriod,
} from '@/types/api'
import {
  emptyState,
  loadingText,
  textMuted,
} from '@/styles/shared.css'
import * as css from './LeaderboardPage.css'

const PERIOD_OPTIONS: Array<{ value: LeaderboardPeriod; label: string }> = [
  { value: 'all', label: '全部时间' },
  { value: 'month', label: '近 30 天' },
  { value: 'week', label: '近 7 天' },
  { value: 'day', label: '近 24 小时' },
]

const METRIC_ICONS: Record<LeaderboardMetricKey, typeof Trophy> = {
  best_wpm: Zap,
  avg_wpm: TimerReset,
  total_chars: Sparkles,
  total_duration_ms: Clock3,
  current_streak: Flame,
  longest_streak: Crown,
  mastered_words: Medal,
  wordbanks_owned: LibraryBig,
  achievements_unlocked: Award,
}

export function LeaderboardPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const metricsQuery = useLeaderboardMetrics()
  const settingsQuery = useUserSettings()
  const metrics = metricsQuery.data ?? []
  const defaultMetric = metrics[0]?.key ?? 'best_wpm'
  const [metric, setMetric] = useState<LeaderboardMetricKey>(defaultMetric)
  const [period, setPeriod] = useState<LeaderboardPeriod>('all')
  const [metricSheetOpen, setMetricSheetOpen] = useState(false)

  useEffect(() => {
    if (!metrics.length) {
      return
    }
    if (!metrics.some((item) => item.key === metric)) {
      setMetric(metrics[0].key)
    }
  }, [metric, metrics])

  const activeMetric = useMemo(
    () => metrics.find((item) => item.key === metric) ?? metrics[0],
    [metric, metrics],
  )

  useEffect(() => {
    if (activeMetric && !activeMetric.supports_period && period !== 'all') {
      setPeriod('all')
    }
  }, [activeMetric, period])

  const boardQuery = useLeaderboard(metric, activeMetric?.supports_period ? period : 'all')
  const isVisible = settingsQuery.data?.['privacy.leaderboard_visible'] !== 'false'
  const myRankQuery = useMyRank(metric, activeMetric?.supports_period ? period : 'all', Boolean(currentUser) && isVisible)
  const entries = boardQuery.data?.list ?? []
  const podium = useMemo(() => buildPodium(entries), [entries])
  const myRank = isVisible ? (myRankQuery.data?.entry ?? boardQuery.data?.my_rank ?? null) : null
  const myPosition = isVisible ? (myRankQuery.data?.rank ?? boardQuery.data?.my_rank?.rank ?? null) : null
  const topPerformer = entries[0] ?? null
  const periodDisabled = !activeMetric?.supports_period
  const ActiveMetricIcon = activeMetric ? (METRIC_ICONS[activeMetric.key] ?? Trophy) : Trophy

  return (
    <div className={css.page}>
      <section className={css.hero}>
        <div className={css.heroCopy}>
          <div className={css.heroBadgeRow}>
            <Badge variant="secondary" className={css.heroBadge}>League Board</Badge>
            <span className={css.heroMeta}>站内公开榜单 · 默认显示昵称与头像</span>
          </div>
          <h1 className={css.heroTitle}>排行榜</h1>
          <p className={css.heroSubtitle}>
            用一块训练场式的总览，把速度、耐力、连胜和积累放进同一条赛道里。切换维度时，页面会把你最值得追的那条线提到前面。
          </p>

          <div className={css.heroTape}>
            <span className={css.heroTapeLead}>冲线播报</span>
            <strong className={css.heroTapeValue}>{topPerformer ? topPerformer.nickname : '等待新的领跑者'}</strong>
            <span className={css.heroTapeHint}>
              {topPerformer
                ? `${formatMetricValue(metric, topPerformer.value)} · ${activeMetric?.label ?? '当前维度'}`
                : `${activeMetric?.label ?? '排行榜维度'} 会在成绩返回后点亮这里`}
            </span>
          </div>

          <div className={css.heroTrackPanel}>
            <span className={css.heroTrackLabel}>今日赛道</span>
            <div className={css.heroTrackValue}>{activeMetric?.label ?? '加载中'}</div>
            <span className={css.heroTrackNote}>{periodDisabled ? '按生涯累计结算' : findPeriodLabel(period)}</span>
          </div>

          <div className={css.heroStats}>
            <Sheet open={metricSheetOpen} onOpenChange={setMetricSheetOpen}>
              <div className={css.highlightControlCard}>
                <div className={css.highlightControlHeader}>
                  <span className={css.highlightLabel}>当前赛道</span>
                  <span className={css.highlightControlBadge}>按需展开</span>
                </div>
                <div className={css.highlightControlValueRow}>
                  <span className={css.highlightControlIconWrap}>
                    <ActiveMetricIcon className={css.highlightControlIcon} strokeWidth={1.9} />
                  </span>
                  <strong className={css.highlightControlValue}>{activeMetric?.label ?? '加载中'}</strong>
                </div>
                <span className={css.highlightHint}>{activeMetric?.description ?? '正在同步榜单维度'}</span>
                <SheetTrigger className={css.highlightControlTrigger} disabled={!metrics.length}>
                  <span className={css.highlightControlTriggerLead}>切换维度</span>
                  <span className={css.highlightControlTriggerText}>
                    {metrics.length ? `${metrics.length} 条赛道可选` : '维度加载中'}
                  </span>
                </SheetTrigger>
              </div>

              <SheetContent side="right" className={css.metricSheetContent}>
                <SheetHeader className={css.metricSheetHeader}>
                  <SheetTitle className={css.metricSheetTitle}>切换排行榜维度</SheetTitle>
                  <p className={css.metricSheetSubtitle}>
                    维度切换现在挂在当前赛道卡片上，只有在需要时才展开全部赛道列表。
                  </p>
                </SheetHeader>
                <SheetBody className={css.metricSheetBody}>
                  {metrics.length ? (
                    <div className={css.metricSheetList} role="listbox" aria-label="排行榜维度列表">
                      {metrics.map((item) => {
                        const Icon = METRIC_ICONS[item.key] ?? Trophy
                        const selected = item.key === metric

                        return (
                          <button
                            key={item.key}
                            type="button"
                            aria-selected={selected}
                            className={selected ? css.metricSheetOptionActive : css.metricSheetOption}
                            onClick={() => {
                              setMetric(item.key)
                              setMetricSheetOpen(false)
                            }}
                          >
                            <span className={css.metricSheetOptionIconWrap}>
                              <Icon className={css.metricSheetOptionIcon} strokeWidth={1.9} />
                            </span>
                            <span className={css.metricSheetOptionCopy}>
                              <span className={css.metricSheetOptionTitleRow}>
                                <span className={css.metricSheetOptionTitle}>{item.label}</span>
                                <span className={selected ? css.metricSheetOptionTagActive : css.metricSheetOptionTag}>
                                  {selected ? '当前赛道' : item.supports_period ? '支持时间窗口' : '生涯累计'}
                                </span>
                              </span>
                              <span className={css.metricSheetOptionMeta}>
                                {item.description ?? '切换到这个维度查看站内公开成绩会如何重新排序。'}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className={css.metricSheetEmpty}>排行榜维度正在加载中。</p>
                  )}
                </SheetBody>
              </SheetContent>
            </Sheet>

            <div className={css.highlightControlCard}>
              <div className={css.highlightControlHeader}>
                <span className={css.highlightLabel}>时间窗口</span>
                <span className={css.highlightControlBadge}>{periodDisabled ? '锁定' : '直接切换'}</span>
              </div>
              <div className={css.highlightControlValueRow}>
                <span className={css.highlightControlIconWrap}>
                  <Clock3 className={css.highlightControlIcon} strokeWidth={1.9} />
                </span>
                <strong className={css.highlightControlValue}>{periodDisabled ? '生涯累计' : findPeriodLabel(period)}</strong>
              </div>
              <span className={css.highlightHint}>
                {periodDisabled
                  ? '这个维度只按生涯累计结算，所以时间范围保持固定。'
                  : '时间范围直接挂在这张卡里，不再单独占一整块控制区。'}
              </span>
              <Select
                value={periodDisabled ? 'all' : period}
                onValueChange={(value) => setPeriod(value as LeaderboardPeriod)}
                disabled={periodDisabled}
              >
                <SelectTrigger className={css.highlightControlSelectTrigger}>
                  <SelectValue placeholder="选择时间窗口" />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <HighlightCard
              label="头名成绩"
              value={topPerformer ? formatMetricValue(metric, topPerformer.value) : '—'}
              hint={topPerformer ? `${topPerformer.nickname} 目前领跑` : '等待榜单数据' }
              emphasized
            />
          </div>
        </div>

        <Card elevated className={css.heroAside}>
          <CardContent className={css.heroAsideContent}>
            <div className={css.heroAsideHeader}>
              <div className={css.finishFlag}>
                <Trophy className={css.finishFlagIcon} strokeWidth={1.8} />
                <span>本周观察</span>
              </div>
              <div className={css.heroAsideRank}>#1</div>
            </div>
            <div className={css.heroAsideValue}>
              {topPerformer ? topPerformer.nickname : '暂无领跑'}
            </div>
            <p className={css.heroAsideHint}>
              {topPerformer
                ? `${formatMetricValue(metric, topPerformer.value)} · ${activeMetric?.label ?? '当前维度'}`
                : '榜单会在训练数据返回后自动填充'}
            </p>
            <div className={css.heroAsideTrack}>
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className={css.trackDash} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {!isVisible && (
        <section className={css.banner}>
          <div className={css.bannerIconWrap}>
            <UserRoundX className={css.bannerIcon} strokeWidth={1.8} />
          </div>
          <div className={css.bannerBody}>
            <p className={css.bannerTitle}>你已关闭排行榜展示</p>
            <p className={css.bannerText}>当前仍可查看其他人的榜单，但不会展示你的昵称、头像与个人排名卡。</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/settings' })}>前往设置开启</Button>
        </section>
      )}

      <section className={css.snapshotGrid}>
        <Card elevated className={css.myRankCard}>
          <CardContent className={css.myRankContent}>
            <div className={css.cardEyebrow}>我的排名</div>
            {isVisible ? (
              myRank ? (
                <>
                  <div className={css.myRankMain}>
                    <span className={css.myRankValue}>#{myPosition ?? '—'}</span>
                    <span className={css.myRankMetric}>{formatMetricValue(metric, myRank.value)}</span>
                  </div>
                  <div className={css.profileRow}>
                    <LeaderboardAvatar nickname={myRank.nickname} avatarMediaId={myRank.avatar_media_id} className={css.inlineAvatar} />
                    <div>
                      <p className={css.profileName}>{myRank.nickname}</p>
                      <p className={css.profileMeta}>{activeMetric?.label ?? '当前维度'} · {findPeriodLabel(periodDisabled ? 'all' : period)}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className={css.mutedCopy}>当前维度还没有你的排名记录，先完成几次练习再回来看看。</p>
              )
            ) : (
              <p className={css.mutedCopy}>开启排行榜展示后，这里会固定显示你的个人名次和成绩。</p>
            )}
          </CardContent>
        </Card>

        <Card className={css.metricCard}>
          <CardContent className={css.metricCardContent}>
            <div className={css.cardEyebrow}>维度说明</div>
            <h2 className={css.metricCardTitle}>{activeMetric?.label ?? '排行榜维度'}</h2>
            <p className={css.metricCardText}>{activeMetric?.description ?? '系统会按所选维度展示站内公开成绩。'}</p>
            <div className={css.metricChipRow}>
              <Badge variant="secondary" className={css.metricChip}>{periodDisabled ? '全量统计' : '支持时间窗口'}</Badge>
              <Badge variant="secondary" className={css.metricChip}>{activeMetric?.unit ? `单位 ${activeMetric.unit}` : '单位自动格式化'}</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={css.boardSection}>
        <div className={css.sectionHeading}>
          <div>
            <p className={css.sectionEyebrow}>领先席位</p>
            <h2 className={css.sectionTitle}>前三领奖台</h2>
          </div>
          <p className={css.sectionHint}>切换赛道时，领奖台与完整榜单都会同步更新。</p>
        </div>

        {boardQuery.isLoading && !boardQuery.data ? (
          <p className={loadingText}>排行榜加载中...</p>
        ) : boardQuery.isError ? (
          <div className={emptyState}>
            <p className={css.emptyTitle}>排行榜暂时不可用</p>
            <p className={textMuted}>请先确认后端 leaderboard 接口是否已接入，然后重新刷新页面。</p>
          </div>
        ) : entries.length === 0 ? (
          <div className={emptyState}>
            <p className={css.emptyTitle}>当前维度暂无公开数据</p>
            <p className={textMuted}>等用户产生练习记录后，这里会自动出现新的排位。</p>
          </div>
        ) : (
          <>
            <div className={css.podiumGrid}>
              {podium.map(({ entry, place }) => (
                <PodiumCard
                  key={entry.user_id}
                  entry={entry}
                  metric={metric}
                  place={place}
                  highlighted={entry.user_id === currentUser?.id}
                />
              ))}
            </div>

            <div className={css.tableShell}>
              <div className={css.tableHeaderRow}>
                <span>排名</span>
                <span>选手</span>
                <span>{activeMetric?.unit ? `成绩 / ${formatMetricUnit(activeMetric.unit)}` : '成绩'}</span>
                <span>最近更新</span>
              </div>
              <div className={css.tableBody}>
                {entries.map((entry) => {
                  const mine = entry.user_id === currentUser?.id
                  return (
                    <article key={entry.user_id} className={mine ? css.tableRowMine : css.tableRow}>
                      <div className={css.rankSlot}>
                        <span className={entry.rank <= 3 ? css.rankBadgeHot : css.rankBadge}>#{entry.rank}</span>
                      </div>
                      <div className={css.userSlot}>
                        <LeaderboardAvatar nickname={entry.nickname} avatarMediaId={entry.avatar_media_id} className={css.tableAvatar} />
                        <div>
                          <p className={css.userName}>{entry.nickname}</p>
                          <p className={css.userSubline}>{mine ? '这是你当前的公开成绩' : describeLane(entry.rank)}</p>
                        </div>
                      </div>
                      <div className={css.valueSlot}>{formatMetricValue(metric, entry.value)}</div>
                      <div className={css.updatedSlot}>{formatUpdatedAt(entry.updated_at)}</div>
                    </article>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function HighlightCard({
  label,
  value,
  hint,
  emphasized = false,
}: {
  label: string
  value: string
  hint: string
  emphasized?: boolean
}) {
  return (
    <div className={emphasized ? css.highlightCardStrong : css.highlightCard}>
      <span className={css.highlightLabel}>{label}</span>
      <strong className={css.highlightValue}>{value}</strong>
      <span className={css.highlightHint}>{hint}</span>
    </div>
  )
}

function PodiumCard({
  entry,
  metric,
  place,
  highlighted,
}: {
  entry: LeaderboardEntry
  metric: LeaderboardMetricKey
  place: number
  highlighted: boolean
}) {
  return (
    <Card elevated className={highlighted ? css.podiumCardMine : css.podiumCard}>
      <CardContent className={css.podiumContent}>
        <div className={css.podiumHeader}>
          <span className={css.podiumPlace}>0{place}</span>
          <Trophy className={css.podiumIcon} strokeWidth={1.8} />
        </div>
        <LeaderboardAvatar nickname={entry.nickname} avatarMediaId={entry.avatar_media_id} className={css.podiumAvatar} />
        <div className={css.podiumName}>{entry.nickname}</div>
        <div className={css.podiumScore}>{formatMetricValue(metric, entry.value)}</div>
        <div className={css.podiumMeta}>{formatUpdatedAt(entry.updated_at)}</div>
      </CardContent>
    </Card>
  )
}

function LeaderboardAvatar({
  avatarMediaId,
  nickname,
  className,
}: {
  avatarMediaId?: string | null
  nickname: string
  className?: string
}) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (!avatarMediaId) {
      setAvatarUrl('')
      return
    }

    const abortController = new AbortController()
    let objectUrl = ''

    const loadAvatar = async () => {
      try {
        const response = await fetch(`/api/v1/media/${avatarMediaId}`, {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
        if (!response.ok) {
          throw new Error('avatar fetch failed')
        }
        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        setAvatarUrl(objectUrl)
      } catch {
        setAvatarUrl('')
      }
    }

    void loadAvatar()

    return () => {
      abortController.abort()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [accessToken, avatarMediaId])

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl} alt={nickname} />
      <AvatarFallback delayMs={0}>{nickname.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

function formatMetricValue(metric: LeaderboardMetricKey, value: number) {
  if (metric === 'best_wpm' || metric === 'avg_wpm') {
    return `${value.toFixed(1)} WPM`
  }

  if (metric === 'total_duration_ms') {
    if (value >= 3_600_000) {
      return `${(value / 3_600_000).toFixed(1)} 小时`
    }
    return `${Math.round(value / 60_000)} 分钟`
  }

  if (metric === 'total_chars') {
    return `${Math.round(value).toLocaleString('zh-CN')} 字`
  }

  if (metric === 'current_streak' || metric === 'longest_streak') {
    return `${Math.round(value)} 天`
  }

  return `${Math.round(value).toLocaleString('zh-CN')} 个`
}

function formatUpdatedAt(updatedAt?: string | null) {
  if (!updatedAt) {
    return '刚刚同步'
  }

  const date = new Date(updatedAt)
  if (Number.isNaN(date.getTime())) {
    return '已同步'
  }

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

function findPeriodLabel(period: LeaderboardPeriod) {
  return PERIOD_OPTIONS.find((item) => item.value === period)?.label ?? '全部时间'
}

function describeLane(rank: number) {
  if (rank <= 3) {
    return '领奖台选手'
  }
  if (rank <= 10) {
    return '第一梯队'
  }
  if (rank <= 20) {
    return '正在追赶领奖台'
  }
  return '持续训练中'
}

function formatMetricUnit(unit: string) {
  switch (unit) {
    case 'wpm':
      return 'WPM'
    case 'chars':
      return '字符'
    case 'duration':
      return '时长'
    case 'days':
      return '天数'
    case 'items':
      return '数量'
    default:
      return unit
  }
}

function buildPodium(entries: LeaderboardEntry[]) {
  const topThree = entries.slice(0, 3)
  if (topThree.length === 3) {
    return [
      { entry: topThree[1], place: 2 },
      { entry: topThree[0], place: 1 },
      { entry: topThree[2], place: 3 },
    ]
  }

  return topThree.map((entry, index) => ({ entry, place: index + 1 }))
}