import { startTransition, useDeferredValue, useEffect, useState, type ReactNode } from 'react'
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { clsx } from 'clsx'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Target } from 'lucide-react'

import { usePromoteWordMastery, useWordMasteries, type WordMasteryFilter } from '@/api/vocabulary'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
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
  const visiblePage = Math.min(page, totalPages)
  const masteryRate = summary.tracked_count > 0
    ? Math.round((summary.mastered_count / summary.tracked_count) * 100)
    : 0
  const focusCopy = getFocusCopy(status)
  const syncLabel = isFetching && !isLoading ? '数据同步中' : '训练结果已同步'

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
        <div className={clsx(css.wordCell, css.wordCellTone[row.original.status])}>
          <span className={css.wordValue}>{row.original.word_norm}</span>
          <span className={css.wordMeta}>语言 {row.original.lang.toUpperCase()} · 词汇档案</span>
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
      cell: ({ row }) => <span className={css.numericPill}>{row.original.mastery_level}</span>,
    },
    {
      accessorKey: 'times_seen',
      header: '练习次数',
      cell: ({ row }) => <span className={css.numericCell}>{row.original.times_seen}</span>,
    },
    {
      accessorKey: 'last_practiced_at',
      header: '最近练习',
      cell: ({ row }) => <span className={css.dateCell}>{formatDateTime(row.original.last_practiced_at)}</span>,
    },
    {
      accessorKey: 'next_review_at',
      header: '下次复习',
      cell: ({ row }) => <span className={css.dateCell}>{formatDateTime(row.original.next_review_at)}</span>,
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        if (row.original.status !== 'pre_mastered') {
          return row.original.status === 'mastered'
            ? <Badge className={css.statusBadge} variant="success">已纳入掌握</Badge>
            : <Badge className={css.statusBadge} variant="outline">继续练习</Badge>
        }

        return (
          <Button
            size="sm"
            variant="secondary"
            className={css.promoteButton}
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

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={css.pageRoot}>
      <section className={css.hero}>
        <div className={css.heroTexture} aria-hidden />
        <div className={css.heroBackdrop} aria-hidden>WORDS</div>
        <div className={css.heroLayout}>
          <div className={css.heroCopy}>
            <div className={css.ribbonRow}>
              <Badge variant="secondary">Word Training Deck</Badge>
              <Badge variant="outline">{syncLabel}</Badge>
            </div>

            <div className={css.heroTitleStack}>
              <p className={css.heroEyebrow}>词库训练成果</p>
              <h1 className={css.heroTitle}>
                <span>词汇量</span>
                <span className={css.heroTitleAccent}>训练看板</span>
              </h1>
            </div>

            <p className={css.heroSubtitle}>
              把每次词库练习都压进一块更有存在感的成绩板里。掌握词沉淀为长期底盘，预掌握词留在确认区，避免成果停在模糊地带。
            </p>

            <div className={css.coachNote}>
              <span className={css.coachLabel}>Coach Note</span>
              <span className={css.coachValue}>{focusCopy}</span>
            </div>
          </div>

          <div className={css.heroScoreboard}>
            <div className={css.scorePrimary}>
              <div>
                <p className={css.scoreLabel}>已掌握词</p>
                <div className={css.scoreValueRow}>
                  <span className={css.scoreValue}>{summary.mastered_count}</span>
                  <span className={css.scoreSuffix}>词</span>
                </div>
              </div>
              <p className={css.scoreCaption}>这些词已经进入长期保留区，是你真正稳定拿下的词汇底盘。</p>
              <div className={css.scoreLane} aria-hidden />
            </div>

            <div className={css.scoreSecondaryGrid}>
              <MiniMetric label="预掌握" value={summary.pre_mastered_count} caption="等待人工确权" icon={<Sparkles size={18} />} tone="warning" />
              <MiniMetric label="总追踪" value={summary.tracked_count} caption="已纳入词汇记忆" icon={<BookOpen size={18} />} tone="neutral" />
              <MiniMetric label="掌握率" value={`${masteryRate}%`} caption="当前沉淀效率" icon={<Target size={18} />} tone="success" />
            </div>
          </div>
        </div>
      </section>

      <section className={css.controlStrip}>
        <div className={css.controlHeader}>
          <div>
            <p className={css.sectionEyebrow}>筛选与检索</p>
            <h2 className={css.sectionTitle}>{filterLabel(status)}</h2>
            <p className={css.sectionSub}>先选视图，再按单词检索。预掌握视图适合做人工确权，全部追踪视图适合看完整训练面。</p>
          </div>
          <Badge variant="outline">第 {visiblePage} / {totalPages} 页</Badge>
        </div>

        <div className={css.filterRail}>
          {FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={status === option.value ? 'default' : 'outline'}
              className={clsx(css.filterButton, status === option.value && css.filterButtonActive)}
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

        <div className={css.searchBlock}>
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
            <span className={css.searchMetaStrong}>共 {total} 条结果</span>
            <span>每页 {PAGE_SIZE} 条</span>
            <span>{deferredSearch ? `检索词：${deferredSearch}` : '当前未启用检索'}</span>
          </div>
        </div>
      </section>

      <section className={css.boardSection}>
        <div className={css.boardHeader}>
          <div>
            <p className={css.boardEyebrow}>Word Ledger</p>
            <h2 className={css.boardTitle}>词汇名单</h2>
            <p className={css.boardSub}>表格继续由 TanStack React Table 驱动，但表现形式改成更像训练名册板。预掌握词可以直接在这里确权为掌握。</p>
          </div>
          <Badge variant="secondary">当前焦点：{filterLabel(status)}</Badge>
        </div>

        <div className={css.tableFrame}>
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
              <div className={css.tableShell}>
                <table className={css.boardTable} aria-label="词汇量列表">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className={css.boardHeadCell} scope="col">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className={css.boardRow}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={css.boardCell}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={css.paginationRow}>
                <span className={css.paginationInfo}>
                  显示 {(visiblePage - 1) * PAGE_SIZE + 1} - {Math.min(visiblePage * PAGE_SIZE, total)} / {total}
                </span>
                <div className={css.paginationButtons}>
                  <Button
                    variant="outline"
                    className={css.paginationButton}
                    disabled={visiblePage <= 1}
                    onClick={() => startTransition(() => setPage((value) => Math.max(1, value - 1)))}
                  >
                    <ChevronLeft size={16} />
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    className={css.paginationButton}
                    disabled={visiblePage >= totalPages}
                    onClick={() => startTransition(() => setPage((value) => Math.min(totalPages, value + 1)))}
                  >
                    下一页
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function MiniMetric({
  label,
  value,
  caption,
  icon,
  tone,
}: {
  label: string
  value: number | string
  caption: string
  icon: ReactNode
  tone: 'warning' | 'neutral' | 'success'
}) {
  return (
    <div className={clsx(css.miniMetric, css.miniMetricTone[tone])}>
      <div className={css.miniMetricTop}>
        <span className={css.miniMetricLabel}>{label}</span>
        <span className={css.miniMetricIcon}>{icon}</span>
      </div>
      <span className={css.miniMetricValue}>{value}</span>
      <span className={css.miniMetricCaption}>{caption}</span>
    </div>
  )
}

function renderStatusBadge(status: WordMasteryStatus) {
  switch (status) {
    case 'mastered':
      return <Badge className={css.statusBadge} variant="success">已掌握</Badge>
    case 'pre_mastered':
      return <Badge className={css.statusBadge} variant="warning">预掌握</Badge>
    default:
      return <Badge className={css.statusBadge} variant="outline">学习中</Badge>
  }
}

function getFocusCopy(status: WordMasteryFilter) {
  switch (status) {
    case 'pre_mastered':
      return '这批词已经连续多次打对，最适合在这里做人工确权。'
    case 'all':
      return '完整视图会同时展开学习中、预掌握和已掌握词，适合检查整体推进节奏。'
    default:
      return '这里展示的是已经稳定沉淀下来的词，是你长期可调用的词汇底盘。'
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