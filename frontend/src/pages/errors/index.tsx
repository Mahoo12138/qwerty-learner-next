import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useErrors, useReviewQueue, useCreateReviewSession } from '@/api/errors'
import {
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import * as css from './index.css'

export function ErrorsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const { data: errors, isLoading } = useErrors(page, pageSize)
  const { data: queue } = useReviewQueue(50)
  const createSession = useCreateReviewSession()
  const navigate = useNavigate()
  const errorList = errors?.list ?? []
  const previewQueue = queue?.list.slice(0, 3) ?? []

  const totalPages = errors ? Math.max(1, Math.ceil(errors.total / pageSize)) : 1
  const reviewCount = queue?.total ?? 0
  const averageErrorCount = useMemo(() => {
    if (errorList.length === 0) return '—'
    return (errorList.reduce((sum, item) => sum + item.error_count, 0) / errorList.length).toFixed(1)
  }, [errorList])
  const averageResponseMs = useMemo(() => {
    if (errorList.length === 0) return '—'
    return String(Math.round(errorList.reduce((sum, item) => sum + item.avg_time_ms, 0) / errorList.length))
  }, [errorList])
  const coachCopy = reviewCount > 0
    ? `已有 ${reviewCount} 个词到了复习时间，优先吃掉队列里的高错误项，最能直接压低遗忘曲线。`
    : errors?.total
      ? '当前没有立即到点的复习项，但错题档案仍在累积，适合先回看高错误内容与反应时间。'
      : '先完成几轮练习，系统就会把错误内容和复习节奏一起沉淀到这块看板里。'

  const handleReview = () => {
    createSession.mutate(20, {
      onSuccess: (data) => {
        if (data.session) {
          void navigate({ to: '/practice', search: { sessionId: undefined } })
        }
      },
    })
  }

  return (
    <div className={css.page}>
      <header className={css.header}>
        <div className={css.heroTexture} aria-hidden />
        <div className={css.heroBackdrop} aria-hidden>REVIEW</div>

        <div className={css.heroLayout}>
          <div className={css.heroCopy}>
            <div className={css.ribbonRow}>
              <Badge variant="secondary">Review Board</Badge>
              <Badge variant="outline">SM-2 队列</Badge>
              <Badge variant="outline">{errors?.total ?? 0} 条错题</Badge>
            </div>

            <p className={css.heroEyebrow}>Error Archive</p>
            <h1 className={css.title}>
              <span>错题集</span>
              <span className={css.titleAccent}>复习看板</span>
            </h1>
            <p className={css.subtitle}>
              把待复习数量、错误密度、反应时间和复习难度压进同一块复盘赛道里。
            </p>

            <div className={css.coachNote}>
              <span className={css.coachLabel}>Coach Note</span>
              <span className={css.coachValue}>{coachCopy}</span>
            </div>

            {reviewCount > 0 && (
              <div className={css.heroActions}>
                <Button onClick={handleReview} disabled={createSession.isPending}>
                  <Zap className={css.buttonIcon} />
                  {createSession.isPending ? '创建中...' : `一键强化（${reviewCount}）`}
                </Button>
              </div>
            )}
          </div>

          <div className={css.heroBoard}>
            <div className={css.primaryScore}>
              <div>
                <p className={css.scoreLabel}>待复习</p>
                <div className={css.scoreValueRow}>
                  <span className={css.scoreValue}>{reviewCount}</span>
                  <span className={css.scoreSuffix}>ITEMS</span>
                </div>
              </div>
              <p className={css.scoreCaption}>
                {reviewCount > 0
                  ? '立即开始强化可以直接消化到点词条，把最高风险内容优先处理掉。'
                  : '当前没有到点复习项，适合先翻看错误密度更高的内容，提前预热下一轮。'}
              </p>
              <div className={css.scoreLane} aria-hidden />
            </div>

            <div className={css.miniGrid}>
              <HeroMiniStat label="总记录" value={String(errors?.total ?? 0)} caption="累计错题档案" tone="neutral" />
              <HeroMiniStat label="平均错误" value={averageErrorCount} caption="当前页密度" tone="warning" />
              <HeroMiniStat label="平均耗时" value={averageResponseMs === '—' ? '—' : `${averageResponseMs}ms`} caption="当前页反应" tone="success" />
            </div>
          </div>
        </div>
      </header>

      {previewQueue.length > 0 && (
        <section className={css.queuePanel}>
          <div className={css.sectionHeader}>
            <div className={css.sectionTitleBlock}>
              <p className={css.sectionEyebrow}>Immediate Queue</p>
              <h2 className={css.sectionTitle}>马上要复习的内容</h2>
              <p className={css.sectionSubtitle}>先处理已经到点的高风险内容，再回头清理整页错题档案。</p>
            </div>

            <div className={css.sectionMeta}>
              <Badge variant="warning">
                <AlertCircle className={css.buttonIcon} />
                {reviewCount} 项待处理
              </Badge>
            </div>
          </div>

          <div className={css.queueGrid}>
            {previewQueue.map((item) => (
              <QueueCard key={item.id} content={item.content || item.content_id} errorCount={item.error_count} nextReviewAt={item.next_review_at} contentType={item.content_type} />
            ))}
          </div>
        </section>
      )}

      <section className={css.archivePanel}>
        <div className={css.sectionHeader}>
          <div className={css.sectionTitleBlock}>
            <p className={css.sectionEyebrow}>Error Archive</p>
            <h2 className={css.sectionTitle}>错误记录</h2>
            <p className={css.sectionSubtitle}>按内容、错误次数、复习时间和难度把错题压成统一的复盘面板。</p>
          </div>

          <div className={css.sectionMeta}>
            <Badge variant="outline">第 {page}/{totalPages} 页</Badge>
            <Badge variant="outline">当前页 {errorList.length} 项</Badge>
          </div>
        </div>

        {isLoading ? (
          <div className={css.feedbackCard}>
            <p className={css.loadingState}>加载错题档案中...</p>
          </div>
        ) : !errors || errorList.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className={css.recordGrid}>
              {errorList.map((err) => (
                <div key={err.id} className={css.recordCard}>
                  <div className={css.recordTop}>
                    <div className={css.recordText}>
                      <div className={css.recordTags}>
                        <Badge variant="secondary">{err.content_type === 'word' ? '单词' : '句子'}</Badge>
                        <DifficultyBadge ef={err.easiness_factor} />
                      </div>
                      <p className={css.recordContent}>{err.content || err.content_id}</p>
                      <p className={css.recordMeta}>最近记录 {formatDateTime(err.last_seen_at)}</p>
                    </div>

                    <div className={css.recordScore}>
                      <span className={css.recordScoreValue}>{err.error_count}</span>
                      <span className={css.recordScoreLabel}>错误</span>
                    </div>
                  </div>

                  <div className={css.recordMetrics}>
                    <RecordMetric label="下次复习" value={<ReviewTime date={err.next_review_at} />} />
                    <RecordMetric label="平均耗时" value={`${err.avg_time_ms} ms`} />
                    <RecordMetric label="复习间隔" value={`${err.review_interval} 天`} />
                    <RecordMetric label="难度" value={<DifficultyBadge ef={err.easiness_factor} />} />
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={css.pagination}>
                <p className={css.paginationInfo}>
                  共 {errors.total} 条，第 {page}/{totalPages} 页
                </p>
                <div className={css.paginationButtons}>
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronLeft className={css.buttonIcon} />
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronRight className={css.buttonIcon} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

function HeroMiniStat({
  label,
  value,
  caption,
  tone,
}: {
  label: string
  value: string
  caption: string
  tone: 'neutral' | 'success' | 'warning'
}) {
  return (
    <div className={`${css.miniStat} ${css.miniTone[tone]}`}>
      <span className={css.miniLabel}>{label}</span>
      <span className={css.miniValue}>{value}</span>
      <span className={css.miniCaption}>{caption}</span>
    </div>
  )
}

function QueueCard({
  content,
  errorCount,
  nextReviewAt,
  contentType,
}: {
  content: string
  errorCount: number
  nextReviewAt: string
  contentType: string
}) {
  return (
    <div className={css.queueCard}>
      <div className={css.queueCardTop}>
        <Badge variant="secondary">{contentType === 'word' ? '单词' : '句子'}</Badge>
        <Badge variant="warning">{errorCount} 次错误</Badge>
      </div>
      <p className={css.queueContent}>{content}</p>
      <div className={css.queueFoot}>
        <ReviewTime date={nextReviewAt} />
        <span className={css.queueMeta}>{formatDateTime(nextReviewAt)}</span>
      </div>
    </div>
  )
}

function RecordMetric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={css.metricTile}>
      <span className={css.metricTileLabel}>{label}</span>
      <span className={css.metricValueWrap}>{value}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={css.emptyStateWrapper}>
      <Inbox className={css.emptyIcon} strokeWidth={1.2} />
      <p className={css.emptyTitle}>暂无错题记录</p>
      <p className={css.emptyDesc}>完成练习后，错误的词会自动收集到这里</p>
    </div>
  )
}

function ReviewTime({ date }: { date: string }) {
  const now = new Date()
  const review = new Date(date)
  const isDue = review <= now

  if (isDue) {
    return (
      <span className={css.reviewTimeDue}>
        <Clock className={css.clockIcon} />
        待复习
      </span>
    )
  }

  const diffMs = review.getTime() - now.getTime()
  const diffH = Math.floor(diffMs / 3_600_000)
  const diffD = Math.floor(diffH / 24)
  const label = diffD > 0 ? `${diffD}天后` : `${diffH}小时后`

  return <span className={css.reviewTimeUpcoming}>{label}</span>
}

function DifficultyBadge({ ef }: { ef: number }) {
  if (ef >= 2.5) return <span className={css.diffEasy}>简单</span>
  if (ef >= 1.8) return <span className={css.diffMedium}>中等</span>
  return <span className={css.diffHard}>困难</span>
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN')
}
