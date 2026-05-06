import { startTransition, useDeferredValue, useEffect, useState, type ReactNode } from 'react'
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react'
import { type ColumnDef } from '@tanstack/react-table'

import { usePromoteWordMastery, useWordMasteries, type WordMasteryFilter } from '@/api/vocabulary'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { ContentDataTable } from '@/pages/content/ContentDataTable'
import * as css from '@/styles/pages/vocabulary.css'
import type { WordMasteryItem, WordMasteryStatus } from '@/types/api'

const PAGE_SIZE = 20

const FILTER_OPTIONS: Array<{ value: WordMasteryFilter; label: string }> = [
  { value: 'mastered', label: '已掌握' },
  { value: 'pre_mastered', label: '预掌握' },
  { value: 'all', label: '全部追踪' },
]

export function VocabularyPage() {
  const [status, setStatus] = useState<WordMasteryFilter>('mastered')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [promotingId, setPromotingId] = useState<string | null>(null)
  const deferredSearch = useDeferredValue(searchInput.trim())

  const { data, isLoading, isFetching } = useWordMasteries({
    status,
    search: deferredSearch,
    page,
    pageSize: PAGE_SIZE,
  })
  const promoteWordMastery = usePromoteWordMastery()

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const items = data?.list ?? []
  const summary = data?.summary ?? { tracked_count: 0, pre_mastered_count: 0, mastered_count: 0 }

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const columns: ColumnDef<WordMasteryItem>[] = [
    {
      accessorKey: 'word_norm',
      header: '单词',
      cell: ({ row }) => (
        <div className={css.wordCell}>
          <span className={css.wordValue}>{row.original.word_norm}</span>
          <span className={css.wordMeta}>语言 {row.original.lang.toUpperCase()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: 'mastery_level',
      header: '掌握层级',
      cell: ({ row }) => <span className={css.numericCell}>{row.original.mastery_level}</span>,
    },
    {
      accessorKey: 'times_seen',
      header: '练习次数',
      cell: ({ row }) => <span className={css.numericCell}>{row.original.times_seen}</span>,
    },
    {
      accessorKey: 'last_practiced_at',
      header: '最近练习',
      cell: ({ row }) => formatDateTime(row.original.last_practiced_at),
    },
    {
      accessorKey: 'next_review_at',
      header: '下次复习',
      cell: ({ row }) => formatDateTime(row.original.next_review_at),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        if (row.original.status !== 'pre_mastered') {
          return row.original.status === 'mastered'
            ? <Badge variant="success">已纳入掌握</Badge>
            : <Badge variant="outline">继续练习</Badge>
        }

        return (
          <Button
            size="sm"
            variant="secondary"
            disabled={promoteWordMastery.isPending && promotingId === row.original.id}
            onClick={() => {
              setPromotingId(row.original.id)
              promoteWordMastery.mutate(row.original.id, {
                onSettled: () => setPromotingId(null),
              })
            }}
          >
            <CheckCircle2 />
            {promoteWordMastery.isPending && promotingId === row.original.id ? '处理中...' : '转为掌握'}
          </Button>
        )
      },
    },
  ]

  return (
    <div className={css.pageRoot}>
      <section className={css.hero}>
        <div className={css.heroGlow} aria-hidden />
        <div className={css.heroTopRow}>
          <div>
            <p className={css.heroEyebrow}>Vocabulary Deck</p>
            <h1 className={css.heroTitle}>词汇量</h1>
            <p className={css.heroSubtitle}>
              把练习过的词按掌握进度沉淀下来。已掌握的词会稳定沉淀，预掌握词可以人工确认，避免反复游离在边界状态。
            </p>
          </div>

          <div className={css.heroHint}>
            <div className={css.heroHintCard}>
              <span className={css.heroHintLabel}>当前视图</span>
              <span className={css.heroHintValue}>{filterLabel(status)}</span>
            </div>
            <div className={css.heroHintCard}>
              <span className={css.heroHintLabel}>搜索范围</span>
              <span className={css.heroHintValue}>{deferredSearch || '全部词条'}</span>
            </div>
          </div>
        </div>

        <div className={css.statsGrid}>
          <SummaryCard label="已掌握" value={summary.mastered_count} caption="进入长期保留区的词" icon={<CheckCircle2 size={18} />} />
          <SummaryCard label="预掌握" value={summary.pre_mastered_count} caption="已稳定多次拼写正确" icon={<Sparkles size={18} />} />
          <SummaryCard label="总追踪" value={summary.tracked_count} caption="所有被纳入词汇记忆的词" icon={<BookOpen size={18} />} />
        </div>
      </section>

      <section className={css.controlsCard}>
        <div className={css.controlsTop}>
          <div>
            <h2 className={css.controlsTitle}>筛选视图</h2>
            <p className={css.controlsHint}>默认先看已掌握词，也可以切到预掌握视图逐个确认。</p>
          </div>
          {isFetching && !isLoading && <Badge variant="outline">同步中</Badge>}
        </div>

        <div className={css.filterRow}>
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? 'secondary' : 'outline'}
              onClick={() => {
                startTransition(() => {
                  setStatus(option.value)
                  setPage(1)
                })
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className={css.searchRow}>
          <Input
            className={css.searchInput}
            value={searchInput}
            placeholder="搜索单词，例如 memory"
            onChange={(event) => {
              const nextValue = event.target.value
              startTransition(() => {
                setSearchInput(nextValue)
                setPage(1)
              })
            }}
          />
          <div className={css.searchMeta}>
            <Badge variant="outline">每页 {PAGE_SIZE} 条</Badge>
            <span>共 {total} 条结果</span>
          </div>
        </div>
      </section>

      <section className={css.tableCard}>
        <div className={css.tableHeader}>
          <div>
            <h2 className={css.tableTitle}>{filterLabel(status)}</h2>
            <p className={css.tableSub}>表格使用 TanStack React Table 渲染，可直接在预掌握词上执行转掌握操作。</p>
          </div>
          <Badge variant="secondary">第 {Math.min(page, totalPages)} / {totalPages} 页</Badge>
        </div>

        {isLoading ? (
          <p className={css.loadingText}>词汇量加载中...</p>
        ) : items.length === 0 ? (
          <div className={css.emptyState}>
            <p className={css.emptyTitle}>当前筛选下还没有词条</p>
            <p className={css.emptyText}>
              {status === 'mastered'
                ? '继续练习词库，或在练习页直接把当前词标记为掌握。'
                : '先多练几轮词库，预掌握和掌握词会自动沉淀到这里。'}
            </p>
          </div>
        ) : (
          <>
            <ContentDataTable ariaLabel="词汇量列表" data={items} columns={columns} />
            <div className={css.paginationRow}>
              <span className={css.paginationInfo}>
                显示 {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, total)} / {total}
              </span>
              <div className={css.paginationButtons}>
                <Button variant="outline" disabled={page <= 1} onClick={() => startTransition(() => setPage((value) => Math.max(1, value - 1)))}>
                  上一页
                </Button>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => startTransition(() => setPage((value) => Math.min(totalPages, value + 1)))}>
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function SummaryCard({ label, value, caption, icon }: { label: string; value: number; caption: string; icon: ReactNode }) {
  return (
    <div className={css.statCard}>
      <span className={css.statLabel}>{label}</span>
      <span className={css.statValue}>{value}</span>
      <span className={css.statCaption}>{caption}</span>
      <Badge variant="outline">{icon}{' '}词汇状态</Badge>
    </div>
  )
}

function renderStatusBadge(status: WordMasteryStatus) {
  switch (status) {
    case 'mastered':
      return <Badge variant="success">已掌握</Badge>
    case 'pre_mastered':
      return <Badge variant="warning">预掌握</Badge>
    default:
      return <Badge variant="outline">学习中</Badge>
  }
}

function filterLabel(status: WordMasteryFilter) {
  return FILTER_OPTIONS.find((option) => option.value === status)?.label ?? '词汇量'
}

function formatDateTime(value: string | null) {
  if (!value) {
    return '未记录'
  }
  return new Date(value).toLocaleString('zh-CN')
}