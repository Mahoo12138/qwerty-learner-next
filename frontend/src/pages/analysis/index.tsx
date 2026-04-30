import { clsx } from 'clsx'
import { useState } from 'react'
import {
  Activity,
  BarChart3,
  Clock3,
  Gauge,
  Target,
  TrendingUp,
} from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useKeymap, useSummary, useTrend } from '@/api/analysis'
import ActivityCalendarHeatmap from '@/components/ActivityCalendarHeatmap'
import KeyboardHeatmap from '@/components/KeyboardHeatmap'
import { Button } from '@/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/core/Card'
import { useThemeStore } from '@/stores/themeStore'
import { vars } from '@/styles/theme.css'
import * as css from './index.css'

type Period = 'day' | 'week' | 'month'
type Tone = 'positive' | 'neutral' | 'negative'

type SegmentedOption<T extends string | number> = {
  value: T
  label: string
}

const PERIOD_OPTIONS: SegmentedOption<Period>[] = [
  { value: 'day', label: '按日' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
]

const DAY_OPTIONS: SegmentedOption<number>[] = [
  { value: 7, label: '7 天' },
  { value: 30, label: '30 天' },
  { value: 90, label: '90 天' },
]

const PERIOD_LABELS: Record<Period, string> = {
  day: '日',
  week: '周',
  month: '月',
}

const tooltipStyle = {
  backgroundColor: vars.color.bg.panelElevated,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.lg,
  color: vars.color.text.primary,
  boxShadow: vars.shadow.md,
}

export function AnalysisPage() {
  const [period, setPeriod] = useState<Period>('day')
  const [days, setDays] = useState(30)
  const trendQuery = useTrend(period, days)
  const activityQuery = useTrend('day', 365)
  const keymapQuery = useKeymap()
  const summaryQuery = useSummary()
  const dark = useThemeStore((state) => state.dark)

  const chartData = (trendQuery.data ?? []).map((point) => ({
    ...point,
    accuracy: +(point.accuracy * 100).toFixed(1),
  }))

  const summary = summaryQuery.data
  const latestPoint = chartData.at(-1)
  const firstPoint = chartData[0]
  const wpmDelta = latestPoint && firstPoint ? latestPoint.wpm - firstPoint.wpm : 0
  const accuracyDelta = latestPoint && firstPoint ? latestPoint.accuracy - firstPoint.accuracy : 0

  const metrics = [
    {
      icon: BarChart3,
      label: '总练习次数',
      value: summary ? `${summary.total_sessions} 次` : '—',
      hint: summary ? `${summary.total_chars.toLocaleString('zh-CN')} 字符已录入` : '累计字符统计同步中',
    },
    {
      icon: TrendingUp,
      label: '最佳 WPM',
      value: summary ? summary.best_wpm.toFixed(1) : '—',
      hint: chartData.length > 1 ? `窗口变化 ${formatSigned(wpmDelta, 1)} WPM` : '继续练习以形成速度曲线',
      featured: true,
    },
    {
      icon: Gauge,
      label: '平均 WPM',
      value: summary ? summary.avg_wpm.toFixed(1) : '—',
      hint: latestPoint ? `最近一次 ${latestPoint.wpm.toFixed(1)} WPM` : '暂无最近成绩',
    },
    {
      icon: Target,
      label: '平均准确率',
      value: summary ? formatRatioPercent(summary.avg_accuracy) : '—',
      hint: chartData.length > 1 ? `窗口变化 ${formatSigned(accuracyDelta, 1)}%` : '稳定性趋势待建立',
    },
    {
      icon: Clock3,
      label: '累计练习时长',
      value: summary ? formatDuration(summary.total_duration_ms) : '—',
      hint: summary ? `当前连续 ${summary.current_streak} 天` : '连续天数同步中',
    },
    {
      icon: Activity,
      label: '待复习项',
      value: summary ? `${summary.review_due_count} 项` : '—',
      hint: summary ? `累计易错词 ${summary.error_word_count} 个` : '复习队列同步中',
    },
  ]

  const focusItems: Array<{
    label: string
    value: string
    meta: string
    tone: Tone
  }> = [
    {
      label: '速度动量',
      value: chartData.length > 1 ? `${formatSigned(wpmDelta, 1)} WPM` : '建立中',
      meta: latestPoint ? `最近一次 ${latestPoint.wpm.toFixed(1)} WPM` : '至少完成两次练习后可对比',
      tone: resolveTone(wpmDelta),
    },
    {
      label: '准确率动量',
      value: chartData.length > 1 ? `${formatSigned(accuracyDelta, 1)}%` : '建立中',
      meta: latestPoint ? `最近一次 ${latestPoint.accuracy.toFixed(1)}%` : '继续练习以建立稳定曲线',
      tone: resolveTone(accuracyDelta, 0.2),
    },
    {
      label: '当前连击',
      value: summary ? `${summary.current_streak} 天` : '—',
      meta: summary ? `历史最高 ${summary.longest_streak} 天` : '保持连续练习',
      tone: 'neutral' as const,
    },
    {
      label: '复习压力',
      value: summary ? `${summary.review_due_count} 项` : '—',
      meta: summary ? `累计易错词 ${summary.error_word_count} 个` : '等待复习队列同步',
      tone: summary ? (summary.review_due_count > 0 ? 'negative' : 'positive') : 'neutral',
    },
  ]

  return (
    <div className={css.page}>
      <section className={css.hero}>
        <div className={css.heroBody}>
          <div className={css.heroText}>
            <span className={css.eyebrow}>Typing Analytics</span>
            <h1 className={css.title}>数据分析</h1>
            <p className={css.subtitle}>
              把速度、准确率和易错键位放进同一个视图里，快速判断最近的训练质量，以及下一轮练习该把注意力放在哪里。
            </p>
          </div>

          <div className={css.heroHighlights}>
            <HeroHighlight
              label="最新速度"
              value={latestPoint ? `${latestPoint.wpm.toFixed(1)} WPM` : '—'}
              hint={latestPoint ? `Raw WPM ${latestPoint.raw_wpm.toFixed(1)}` : '等待新的练习记录'}
            />
            <HeroHighlight
              label="最新准确率"
              value={latestPoint ? `${latestPoint.accuracy.toFixed(1)}%` : '—'}
              hint={chartData.length > 1 ? `相较窗口起点 ${formatSigned(accuracyDelta, 1)}%` : '继续练习建立趋势'}
            />
            <HeroHighlight
              label="训练焦点"
              value={summary ? `${summary.review_due_count} 项` : '—'}
              hint={summary ? `当前连击 ${summary.current_streak} 天` : '复习队列同步中'}
            />
          </div>
        </div>

        <div className={css.controlDeck}>
          <SegmentedControl
            label="聚合颗粒"
            value={period}
            onChange={setPeriod}
            options={PERIOD_OPTIONS}
          />
          <SegmentedControl
            label="观察窗口"
            value={days}
            onChange={setDays}
            options={DAY_OPTIONS}
          />
        </div>
      </section>

      <section className={css.metricsGrid}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
            featured={metric.featured}
          />
        ))}
      </section>

      <section className={css.analyticsGrid}>
        <Card className={css.panelCard} elevated>
          <CardHeader className={css.panelHeader}>
            <div className={css.panelHeaderRow}>
              <div>
                <CardTitle>速度走势</CardTitle>
                <CardDescription>
                  当前按{PERIOD_LABELS[period]}聚合，观察过去 {days} 天的 WPM 与 Raw WPM 变化。
                </CardDescription>
              </div>
              <span className={css.panelBadge}>{days} 天窗口</span>
            </div>
          </CardHeader>
          <CardContent className={css.chartContent}>
            <ChartPanelState
              queryState={trendQuery}
              hasData={chartData.length > 0}
              loadingTitle="正在生成速度曲线"
              emptyTitle="当前窗口还没有速度数据"
              emptyDescription="先完成几次练习，这里会开始显示 WPM 与 Raw WPM 的走势。"
              errorTitle="速度趋势加载失败"
            >
              <div className={css.chartCanvasLarge}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke={vars.color.border.soft} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: vars.color.text.muted }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                      tickFormatter={formatChartDate}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: vars.color.text.muted }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <Tooltip
                      labelFormatter={(value) => `日期 ${formatVerboseDate(String(value))}`}
                      contentStyle={tooltipStyle}
                      cursor={{ stroke: vars.color.border.default, strokeDasharray: '4 4' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      name="WPM"
                      stroke={vars.color.brand.primary}
                      strokeWidth={2.6}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="raw_wpm"
                      name="Raw WPM"
                      stroke={vars.color.brand.secondary}
                      strokeWidth={1.8}
                      strokeDasharray="6 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartPanelState>
          </CardContent>
        </Card>

        <div className={css.secondaryStack}>
          <Card className={css.panelCard}>
            <CardHeader className={css.panelHeader}>
              <div className={css.panelHeaderRow}>
                <div>
                  <CardTitle>准确率走势</CardTitle>
                  <CardDescription>观察所选窗口内的稳定性变化，避免只追求速度。</CardDescription>
                </div>
                <span className={css.panelBadge}>精度优先</span>
              </div>
            </CardHeader>
            <CardContent className={css.chartContent}>
              <ChartPanelState
                queryState={trendQuery}
                hasData={chartData.length > 0}
                loadingTitle="正在生成准确率曲线"
                emptyTitle="当前窗口还没有准确率数据"
                emptyDescription="完成练习后，这里会显示最近表现是否更稳定。"
                errorTitle="准确率趋势加载失败"
              >
                <div className={css.chartCanvasSmall}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke={vars.color.border.soft} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: vars.color.text.muted }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={24}
                        tickFormatter={formatChartDate}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 12, fill: vars.color.text.muted }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        unit="%"
                      />
                      <Tooltip
                        labelFormatter={(value) => `日期 ${formatVerboseDate(String(value))}`}
                        formatter={(value) => `${Number(value).toFixed(1)}%`}
                        contentStyle={tooltipStyle}
                        cursor={{ stroke: vars.color.border.default, strokeDasharray: '4 4' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="准确率"
                        stroke={vars.color.brand.success}
                        strokeWidth={2.4}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartPanelState>
            </CardContent>
          </Card>

          <Card className={css.panelCard}>
            <CardHeader className={css.panelHeader}>
              <CardTitle>训练焦点</CardTitle>
              <CardDescription>从窗口走势里提取几个最值得关注的信号。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={css.focusList}>
                {focusItems.map((item) => (
                  <div key={item.label} className={css.focusItem}>
                    <div className={css.focusCopy}>
                      <span className={css.focusLabel}>{item.label}</span>
                      <span className={css.focusMeta}>{item.meta}</span>
                    </div>
                    <span className={clsx(css.focusValue, css.tone[item.tone])}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className={css.focusNote}>
                {chartData.length > 1
                  ? `最近 ${days} 天里，速度相较窗口起点 ${formatSigned(wpmDelta, 1)} WPM，准确率变化 ${formatSigned(accuracyDelta, 1)}%。`
                  : '当前样本不足以判断趋势，继续完成练习后这里会自动显示更可靠的分析结论。'}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className={css.panelCard}>
        <CardHeader className={css.panelHeader}>
          <div className={css.panelHeaderRow}>
            <div>
              <CardTitle>练习日历</CardTitle>
              <CardDescription>
                用类似 GitHub contribution graph 的方式查看过去 365 天的训练活跃度，快速识别你的训练节奏和峰值日。
              </CardDescription>
            </div>
            <span className={css.panelBadge}>365 天</span>
          </div>
        </CardHeader>
        <CardContent className={css.calendarContent}>
          <ChartPanelState
            queryState={activityQuery}
            hasData={activityQuery.data !== undefined}
            loadingTitle="正在生成练习日历"
            emptyTitle="练习日历暂时不可用"
            emptyDescription="数据准备完成后，这里会显示过去一年的练习活跃度分布。"
            errorTitle="练习日历加载失败"
          >
            <ActivityCalendarHeatmap data={activityQuery.data ?? []} days={365} />
          </ChartPanelState>
        </CardContent>
      </Card>

      <Card className={css.panelCard}>
        <CardHeader className={css.panelHeader}>
          <div className={css.panelHeaderRow}>
            <div>
              <CardTitle>键位热力图</CardTitle>
              <CardDescription>颜色越深代表错误率越高，用来定位近期最需要刻意练习的键位。</CardDescription>
            </div>
            <span className={css.panelBadge}>弱项定位</span>
          </div>
        </CardHeader>
        <CardContent className={css.heatmapContent}>
          <ChartPanelState
            queryState={keymapQuery}
            hasData={(keymapQuery.data?.length ?? 0) > 0}
            loadingTitle="正在整理键位表现"
            emptyTitle="还没有可展示的键位数据"
            emptyDescription="完成几次练习后，这里会显示哪些按键最容易出错。"
            errorTitle="键位热力图加载失败"
          >
            <div className={css.heatmapShell}>
              <KeyboardHeatmap data={keymapQuery.data ?? []} dark={dark} />
            </div>
          </ChartPanelState>
        </CardContent>
      </Card>
    </div>
  )
}

function HeroHighlight({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className={css.heroHighlight}>
      <span className={css.heroHighlightLabel}>{label}</span>
      <span className={css.heroHighlightValue}>{value}</span>
      <span className={css.heroHighlightHint}>{hint}</span>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  featured,
}: {
  icon: typeof BarChart3
  label: string
  value: string
  hint: string
  featured?: boolean
}) {
  return (
    <Card className={clsx(css.metricCard, featured && css.metricCardFeatured)} elevated={featured}>
      <CardContent className={css.metricCardContent}>
        <div className={css.metricTop}>
          <div className={css.metricCopy}>
            <span className={css.metricValue}>{value}</span>
            <span className={css.metricLabel}>{label}</span>
          </div>
          <span className={css.metricIconWrap}>
            <Icon className={css.metricIcon} strokeWidth={1.9} />
          </span>
        </div>
        <span className={css.metricHint}>{hint}</span>
      </CardContent>
    </Card>
  )
}

function SegmentedControl<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<SegmentedOption<T>>
}) {
  return (
    <div className={css.controlBlock}>
      <span className={css.controlLabel}>{label}</span>
      <div className={css.segmented}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <Button
              key={String(option.value)}
              type="button"
              variant={active ? 'default' : 'ghost'}
              size="sm"
              className={clsx(css.segmentButton, active && css.segmentButtonActive)}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function ChartPanelState({
  queryState,
  hasData,
  loadingTitle,
  emptyTitle,
  emptyDescription,
  errorTitle,
  children,
}: {
  queryState: { isLoading: boolean; isError: boolean; error: unknown }
  hasData: boolean
  loadingTitle: string
  emptyTitle: string
  emptyDescription: string
  errorTitle: string
  children: React.ReactNode
}) {
  if (queryState.isError) {
    return (
      <PanelState
        title={errorTitle}
        description={queryState.error instanceof Error ? queryState.error.message : '请稍后重试。'}
      />
    )
  }

  if (queryState.isLoading && !hasData) {
    return <PanelState title={loadingTitle} description="数据同步完成后会自动刷新，不需要手动操作。" />
  }

  if (!hasData) {
    return <PanelState title={emptyTitle} description={emptyDescription} />
  }

  return children
}

function PanelState({ title, description }: { title: string; description: string }) {
  return (
    <div className={css.panelState}>
      <p className={css.panelStateTitle}>{title}</p>
      <p className={css.panelStateDescription}>{description}</p>
    </div>
  )
}

function formatRatioPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function formatSigned(value: number, digits = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}`
}

function formatDuration(ms: number) {
  if (ms <= 0) return '0 分'

  const totalMinutes = Math.round(ms / 60000)
  if (totalMinutes < 60) {
    return `${totalMinutes} 分`
  }

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes === 0 ? `${hours} 小时` : `${hours} 小时 ${minutes} 分`
}

function resolveTone(value: number, threshold = 0.05): Tone {
  if (value > threshold) return 'positive'
  if (value < -threshold) return 'negative'
  return 'neutral'
}

function formatChartDate(value: string) {
  const parsed = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return `${parsed.getMonth() + 1}/${parsed.getDate()}`
}

function formatVerboseDate(value: string) {
  const parsed = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}