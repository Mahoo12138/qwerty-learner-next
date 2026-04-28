import { useState } from 'react'
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

  const totalPages = errors ? Math.ceil(errors.total / pageSize) : 0
  const reviewCount = queue?.total ?? 0

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
      <div className={css.header}>
        <div className={css.headerText}>
          <h1 className={css.title}>错题集</h1>
          <p className={css.subtitle}>SM-2 算法智能安排复习时间</p>
        </div>
        {reviewCount > 0 && (
          <Button onClick={handleReview} disabled={createSession.isPending}>
            <Zap className={css.buttonIcon} />
            一键强化（{reviewCount}）
          </Button>
        )}
      </div>

      {reviewCount > 0 && (
        <div className={css.reviewBanner}>
          <AlertCircle className={css.bannerIcon} />
          <p className={css.bannerText}>
            你有 <strong>{reviewCount}</strong> 个词到了复习时间，点击「一键强化」开始复习。
          </p>
        </div>
      )}

      {isLoading ? (
        <div className={css.loadingState}>加载中…</div>
      ) : !errors || errors.list.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className={css.tableWrapper}>
            <table className={css.table}>
              <thead>
                <tr>
                  <th className={css.th}>内容</th>
                  <th className={css.th}>类型</th>
                  <th className={css.th}>错误次数</th>
                  <th className={css.th}>下次复习</th>
                  <th className={css.th}>难度</th>
                </tr>
              </thead>
              <tbody>
                {errors.list.map((err) => (
                  <tr key={err.id} className={css.tr}>
                    <td className={css.tdContent}>{err.content || err.content_id}</td>
                    <td className={css.td}>
                      <Badge variant="secondary">
                        {err.content_type === 'word' ? '单词' : '句子'}
                      </Badge>
                    </td>
                    <td className={css.td}>{err.error_count}</td>
                    <td className={css.td}>
                      <ReviewTime date={err.next_review_at} />
                    </td>
                    <td className={css.td}>
                      <DifficultyBadge ef={err.easiness_factor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
