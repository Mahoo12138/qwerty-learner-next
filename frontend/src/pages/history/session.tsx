import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, Flag, Play, RotateCcw, Trash2, TriangleAlert, Zap } from 'lucide-react'
import { useDiscardSession, useSession } from '@/api/practice'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/Card'
import { clearPracticeSessionProgress } from '@/lib/practiceSessionProgress'
import type { Sentence, Word } from '@/types/api'
import * as css from './session.css'

type HistorySessionDetailPageProps = {
  sessionId: string
}

export function HistorySessionDetailPage({ sessionId }: HistorySessionDetailPageProps) {
  const navigate = useNavigate()
  const [actionError, setActionError] = useState('')

  const { data, error, isLoading } = useSession(sessionId)
  const discardSession = useDiscardSession()

  const isCompleted = Boolean(data?.result || data?.session.ended_at)
  const hasContent = (data?.words?.length ?? 0) > 0 || (data?.sentences?.length ?? 0) > 0
  const canResume = Boolean(data && !isCompleted && hasContent)
  const sessionName = data
    ? formatSessionName(data.session.mode, data.session.source_type, data.session.item_count)
    : '练习记录详情'
  const createdAtLabel = data ? new Date(data.session.created_at).toLocaleString('zh-CN') : ''
  const primaryScoreValue = data
    ? (isCompleted && data.result ? data.result.wpm.toFixed(1) : String(data.session.item_count))
    : '0'
  const primaryScoreSuffix = isCompleted ? 'WPM' : '项'
  const primaryScoreLabel = isCompleted ? '本轮主成绩' : '待完成条目'
  const heroBackdropLabel = isCompleted ? 'RECAP' : 'PENDING'
  const heroCoachNote = data
    ? (isCompleted
        ? `这一轮已经完赛。优先回看错误更高的键位和错题复习时间，把复盘动作接在训练热度还在的时候完成。`
        : canResume
          ? `这条记录还可以继续。保持原来的输入节奏比重开更有效，先把这一轮完整收掉，再比较成绩变化。`
          : '这条记录尚未完成，但原始内容不可恢复。当前更适合把它当成一次阶段快照来复盘指标。')
    : '正在读取这轮练习的指标、内容和复盘线索。'

  const topKeystrokeStats = useMemo(() => {
    if (!data) return []
    return [...data.keystroke_stats]
      .sort((left, right) => right.error_count - left.error_count || right.hit_count - left.hit_count)
      .slice(0, 8)
  }, [data])

  const handleResume = () => {
    void navigate({ to: '/practice', search: { sessionId } })
  }

  const handleDiscard = () => {
    if (!window.confirm('确定要舍弃这条未完成练习吗？舍弃后无法继续恢复。')) {
      return
    }

    setActionError('')
    discardSession.mutate(sessionId, {
      onSuccess: () => {
        clearPracticeSessionProgress(sessionId)
        void navigate({ to: '/history', replace: true })
      },
      onError: (discardError) => {
        setActionError(discardError instanceof Error ? discardError.message : '舍弃练习失败，请重试')
      },
    })
  }

  return (
    <div className={css.page}>
      <header className={css.header}>
        <div className={css.heroTexture} aria-hidden />
        <div className={css.heroBackdrop} aria-hidden>{heroBackdropLabel}</div>

        <div className={css.heroLayout}>
          <div className={css.heroCopy}>
            <div className={css.backWrap}>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/history' })}>
                <ArrowLeft className={css.iconSm} />
                返回记录列表
              </Button>
            </div>

            <div className={css.ribbonRow}>
              <Badge variant="secondary">{isCompleted ? 'Session Recap' : 'Resume Session'}</Badge>
              {data && <Badge variant="outline">{formatModeLabel(data.session.mode)}</Badge>}
              {data && <Badge variant="outline">{formatSourceLabel(data.session.source_type)}</Badge>}
            </div>

            <h1 className={css.title}>练习记录详情</h1>
            <p className={css.subtitle}>
              {data
                ? `${sessionName} 的内容、成绩、弱键和错题节奏都被压进同一块复盘看板里。`
                : '查看本轮练习内容、结果指标，以及未完成记录的恢复操作。'}
            </p>

            <div className={css.coachNote}>
              <span className={css.coachLabel}>Coach Note</span>
              <span className={css.coachValue}>{heroCoachNote}</span>
            </div>

            <div className={css.heroActions}>
              <Button variant="outline" onClick={() => navigate({ to: '/practice', search: { sessionId: undefined } })}>
                <RotateCcw className={css.iconSm} />
                新练习
              </Button>
              {data && !isCompleted && (
                <Button onClick={handleResume} disabled={!canResume}>
                  <Play className={css.iconSm} />
                  继续练习
                </Button>
              )}
              {data && !isCompleted && (
                <Button variant="ghost" onClick={handleDiscard} disabled={discardSession.isPending}>
                  <Trash2 className={css.iconSm} />
                  {discardSession.isPending ? '舍弃中...' : '舍弃练习'}
                </Button>
              )}
            </div>
          </div>

          {data && (
            <div className={css.heroBoard}>
              <div className={css.primaryScore}>
                <div>
                  <p className={css.scoreLabel}>{primaryScoreLabel}</p>
                  <div className={css.scoreValueRow}>
                    <span className={css.scoreValue}>{primaryScoreValue}</span>
                    <span className={css.scoreSuffix}>{primaryScoreSuffix}</span>
                  </div>
                </div>
                <p className={css.scoreCaption}>
                  {isCompleted
                    ? `${sessionName} 已完赛，可直接回看弱键与错题分布。`
                    : `${sessionName} 尚未收官，原始内容与恢复入口仍在。`}
                </p>
                <div className={css.scoreLane} aria-hidden />
              </div>

              <div className={css.snapshotGrid}>
                <SnapshotTile
                  label="准确率"
                  value={data.result ? `${(data.result.accuracy * 100).toFixed(1)}%` : '待完成'}
                  caption="整轮稳定度"
                  icon={<CheckCircle2 className={css.iconSm} />}
                  tone="success"
                />
                <SnapshotTile
                  label="用时"
                  value={formatDuration(data.session.duration_ms)}
                  caption="整轮耗时"
                  icon={<Clock3 className={css.iconSm} />}
                  tone="neutral"
                />
                <SnapshotTile
                  label="弱键"
                  value={String(topKeystrokeStats.length)}
                  caption="已抓取重点键位"
                  icon={<Zap className={css.iconSm} />}
                  tone="warning"
                />
                <SnapshotTile
                  label="错题"
                  value={String(data.error_items.length)}
                  caption="进入复习队列"
                  icon={<Flag className={css.iconSm} />}
                  tone="warning"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {isLoading && (
        <Card className={css.stateCard}>
          <CardContent className={css.loadingPanel}>加载练习详情中...</CardContent>
        </Card>
      )}

      {!isLoading && error && (
        <Card className={css.stateCard}>
          <CardContent className={css.errorPanel}>
            {error instanceof Error ? error.message : '加载练习详情失败，请重试'}
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && data && (
        <div className={css.stack}>
          <Card className={css.summaryCard}>
            <CardHeader className={css.cardHeaderSplit}>
              <div>
                <p className={css.panelEyebrow}>Run Metadata</p>
                <div className={css.sessionTitleWrap}>
                  <CardTitle className={css.panelTitle}>{sessionName}</CardTitle>
                  <Badge variant={isCompleted ? 'success' : 'warning'}>
                    {isCompleted ? '已完成' : '未完成'}
                  </Badge>
                </div>
                <CardDescription className={css.panelDescription}>
                  创建于 {createdAtLabel} · 项目数 {data.session.item_count}
                </CardDescription>
              </div>
              <div className={css.summaryBadges}>
                <Badge variant="outline">{formatModeLabel(data.session.mode)}</Badge>
                <Badge variant="outline">{formatSourceLabel(data.session.source_type)}</Badge>
                <Badge variant="outline">{data.session.item_count} 项</Badge>
              </div>
            </CardHeader>
            <CardContent className={css.summaryBody}>
              <div className={css.metrics}>
                <MetricTile label="状态" value={isCompleted ? '已完成' : '未完成'} />
                <MetricTile label="项目数" value={String(data.session.item_count)} />
                <MetricTile label="用时" value={formatDuration(data.session.duration_ms)} />
                <MetricTile label="WPM" value={data.result ? data.result.wpm.toFixed(1) : '-'} />
                <MetricTile label="准确率" value={data.result ? `${(data.result.accuracy * 100).toFixed(1)}%` : '-'} />
              </div>

              {actionError && <p className={css.actionError}>{actionError}</p>}

              {!hasContent && (
                <div className={css.warningPanel}>
                  <TriangleAlert className={css.warningIcon} />
                  <p>该记录没有保存可回放的练习内容，当前可以查看结果，但无法恢复原始练习项。</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={css.sectionCard}>
            <CardHeader className={css.panelHeader}>
              <div>
                <p className={css.panelEyebrow}>Run Content</p>
                <CardTitle className={css.panelTitle}>练习内容</CardTitle>
                <CardDescription className={css.panelDescription}>按本轮练习的原始顺序展示。</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <SessionContentList
                sourceType={data.session.source_type}
                words={data.words ?? []}
                sentences={data.sentences ?? []}
              />
            </CardContent>
          </Card>

          <div className={css.splitGrid}>
            <Card className={css.sectionCard}>
              <CardHeader className={css.panelHeader}>
                <div>
                  <p className={css.panelEyebrow}>Weak Keys</p>
                  <CardTitle className={css.panelTitle}>键位统计</CardTitle>
                  <CardDescription className={css.panelDescription}>按错误数从高到低展示本轮输入中最需要关注的键位。</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {topKeystrokeStats.length === 0 ? (
                  <p className={css.mutedText}>当前没有键位统计数据。</p>
                ) : (
                  <div className={css.list}>
                    {topKeystrokeStats.map((item) => (
                      <div key={item.id} className={css.keyStatRow}>
                        <div>
                          <p className={css.keyChar}>{item.key_char}</p>
                          <p className={css.keyInterval}>平均间隔 {item.avg_interval_ms}ms</p>
                        </div>
                        <div className={css.hitErrorGrid}>
                          <div>
                            <p className={css.hitErrorLabel}>命中</p>
                            <p className={css.hitErrorValue}>{item.hit_count}</p>
                          </div>
                          <div>
                            <p className={css.hitErrorLabel}>错误</p>
                            <p className={css.hitErrorValue}>{item.error_count}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={css.sectionCard}>
              <CardHeader className={css.panelHeader}>
                <div>
                  <p className={css.panelEyebrow}>Review Queue</p>
                  <CardTitle className={css.panelTitle}>错题记录</CardTitle>
                  <CardDescription className={css.panelDescription}>显示本轮被记入复习队列的内容。</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {data.error_items.length === 0 ? (
                  <p className={css.mutedText}>这轮练习没有写入错题项。</p>
                ) : (
                  <div className={css.list}>
                    {data.error_items.map((item) => (
                      <div key={item.id} className={css.errorItemCard}>
                        <div className={css.errorItemHeader}>
                          <span className={css.errorItemContent}>{item.content || item.content_id}</span>
                          <Badge variant="warning">{item.error_count} 次错误</Badge>
                        </div>
                        <p className={css.errorItemReview}>
                          下次复习 {new Date(item.next_review_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function SessionContentList({
  sourceType,
  words,
  sentences,
}: {
  sourceType: string
  words: Word[]
  sentences: Sentence[]
}) {
  if (sourceType === 'word_bank') {
    if (words.length === 0) {
      return <p className={css.mutedText}>当前没有可展示的词条内容。</p>
    }

    return (
      <div className={css.contentGrid}>
        {words.map((word, index) => (
          <div key={word.id} className={css.contentItem}>
            <div className={css.contentItemHeader}>
              <p className={css.contentItemTitle}>{index + 1}. {word.content}</p>
              <Badge variant="outline">单词</Badge>
            </div>
            <p className={css.contentItemMeta}>音标：{word.pronunciation || '暂无'}</p>
            <p className={css.contentItemBody}>释义：{word.definition || '暂无'}</p>
          </div>
        ))}
      </div>
    )
  }

  if (sentences.length === 0) {
    return <p className={css.mutedText}>当前没有可展示的句子内容。</p>
  }

  return (
    <div className={css.contentStack}>
      {sentences.map((sentence, index) => (
        <div key={sentence.id} className={css.contentItem}>
          <div className={css.contentItemHeader}>
            <p className={css.contentItemTitle}>{index + 1}. {sentence.content}</p>
            <Badge variant="outline">句子</Badge>
          </div>
          <p className={css.contentItemBody}>翻译：{sentence.translation || '暂无'}</p>
        </div>
      ))}
    </div>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={css.metricTile}>
      <p className={css.metricLabel}>{label}</p>
      <p className={css.metricValue}>{value}</p>
    </div>
  )
}

function SnapshotTile({
  label,
  value,
  caption,
  icon,
  tone,
}: {
  label: string
  value: string
  caption: string
  icon: ReactNode
  tone: 'warning' | 'neutral' | 'success'
}) {
  return (
    <div className={`${css.snapshotTile} ${css.snapshotTone[tone]}`}>
      <div className={css.snapshotTop}>
        <span className={css.snapshotLabel}>{label}</span>
        <span className={css.snapshotIcon}>{icon}</span>
      </div>
      <span className={css.snapshotValue}>{value}</span>
      <span className={css.snapshotCaption}>{caption}</span>
    </div>
  )
}

function formatModeLabel(mode: string) {
  switch (mode) {
    case 'dictation':
      return '默写模式'
    case 'recitation':
      return '背词模式'
    default:
      return '普通打字'
  }
}

function formatSourceLabel(sourceType: string) {
  return sourceType === 'sentence_bank' ? '句库练习' : '词库练习'
}

function formatSessionName(mode: string, sourceType: string, itemCount: number) {
  return `${formatModeLabel(mode)}-${formatSourceLabel(sourceType)} · ${itemCount}项`
}

function formatDuration(durationMs: number | null | undefined) {
  if (!durationMs) return '-'
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}
