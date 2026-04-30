import { clsx } from 'clsx'
import type { TrendPoint } from '@/types/api'
import * as css from './ActivityCalendarHeatmap.css'

const DAYS_IN_YEAR = 365
const CELL_SIZE = 14
const CELL_GAP = 4
const WEEKDAY_LABELS = ['一', '', '三', '', '五', '', '日']
const HEAT_LEVELS = [0, 1, 2, 3, 4] as const

type CalendarDay = {
  date: Date
  key: string
  count: number
  averageWpm: number | null
  averageAccuracy: number | null
  outsideRange: boolean
}

interface Props {
  data: TrendPoint[]
  days?: number
}

export default function ActivityCalendarHeatmap({ data, days = DAYS_IN_YEAR }: Props) {
  const safeDays = Math.max(28, days)
  const today = startOfDay(new Date())
  const rangeStart = addDays(today, -(safeDays - 1))
  const gridStart = addDays(rangeStart, -getWeekdayIndex(rangeStart))
  const gridEnd = addDays(today, 6 - getWeekdayIndex(today))
  const trendMap = new Map(data.map((point) => [point.date, point]))

  const calendarDays: CalendarDay[] = []
  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    const key = formatDateKey(cursor)
    const point = trendMap.get(key)
    const outsideRange = cursor < rangeStart || cursor > today

    calendarDays.push({
      date: new Date(cursor),
      key,
      count: outsideRange ? 0 : point?.count ?? 0,
      averageWpm: outsideRange || !point ? null : point.wpm,
      averageAccuracy: outsideRange || !point ? null : point.accuracy,
      outsideRange,
    })
  }

  const weeks: CalendarDay[][] = []
  for (let index = 0; index < calendarDays.length; index += 7) {
    weeks.push(calendarDays.slice(index, index + 7))
  }

  const activeDays = calendarDays.filter((day) => !day.outsideRange && day.count > 0).length
  const totalSessions = calendarDays.reduce((total, day) => total + (day.outsideRange ? 0 : day.count), 0)
  const peakDay = calendarDays.reduce<CalendarDay | null>((peak, day) => {
    if (day.outsideRange || day.count === 0) return peak
    if (!peak || day.count > peak.count) return day
    return peak
  }, null)
  const maxCount = peakDay?.count ?? 0
  const monthBlocks = buildMonthBlocks(rangeStart, today, gridStart, weeks.length)
  const gridWidth = getWeekSpanWidth(weeks.length)

  return (
    <div className={css.root}>
      <div className={css.summaryRow}>
        <SummaryPill label="活跃天数" value={`${activeDays} / ${safeDays}`} />
        <SummaryPill label="累计练习" value={`${totalSessions} 次`} />
        <SummaryPill label="峰值日" value={peakDay ? `${formatMonthDay(peakDay.date)} · ${peakDay.count} 次` : '暂无记录'} />
      </div>

      <div className={css.board}>
        <div className={css.scrollViewport}>
          <div className={css.monthHeaderRow} style={{ minWidth: `${28 + 8 + gridWidth}px` }}>
            <div className={css.monthHeaderOffset} />
            <div className={css.monthHeader} style={{ width: `${gridWidth}px` }}>
              {monthBlocks.map((block) => (
                <span key={`${block.label}-${block.weekIndex}`} className={css.monthBlock} style={{ width: `${getWeekSpanWidth(block.span)}px` }}>
                  {block.label}
                </span>
              ))}
            </div>
          </div>

          <div className={css.gridRow}>
            <div className={css.weekdayRail}>
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={`${label}-${index}`} className={css.weekdayLabel}>
                  {label}
                </span>
              ))}
            </div>

            <div className={css.weeksRow} style={{ width: `${gridWidth}px` }} role="img" aria-label={`过去 ${safeDays} 天练习活跃度热力图`}>
              {weeks.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className={css.weekColumn}>
                  {week.map((day) => {
                    const level = resolveLevel(day.count, maxCount)
                    const isToday = day.key === formatDateKey(today)

                    return (
                      <div
                        key={day.key}
                        className={clsx(
                          css.dayCell,
                          css.dayLevel[level],
                          day.outsideRange && css.dayOutsideRange,
                          isToday && css.dayToday,
                        )}
                        aria-label={buildDayAriaLabel(day)}
                        title={buildDayAriaLabel(day)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={css.footer}>
          <p className={clsx(css.note, activeDays === 0 && css.noteMuted)}>
            {activeDays > 0
              ? `过去 ${safeDays} 天里有 ${activeDays} 天完成了练习，颜色越深代表当天练习次数越多。`
              : `过去 ${safeDays} 天还没有练习记录，完成一次训练后这里会像 GitHub contribution graph 一样逐步点亮。`}
          </p>

          <div className={css.legend}>
            <span>少</span>
            <div className={css.legendScale}>
              {HEAT_LEVELS.map((level) => (
                <span key={level} className={clsx(css.legendSwatch, css.dayLevel[level])} />
              ))}
            </div>
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className={css.summaryPill}>
      <span className={css.summaryLabel}>{label}</span>
      <span className={css.summaryValue}>{value}</span>
    </div>
  )
}

function resolveLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || maxCount <= 0) return 0
  const normalized = count / maxCount
  if (normalized >= 0.9) return 4
  if (normalized >= 0.6) return 3
  if (normalized >= 0.3) return 2
  return 1
}

function buildMonthBlocks(rangeStart: Date, today: Date, gridStart: Date, totalWeeks: number) {
  const markers = [{ label: formatMonth(rangeStart), weekIndex: 0 }]
  let monthCursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + 1, 1)

  while (monthCursor <= today) {
    markers.push({
      label: formatMonth(monthCursor),
      weekIndex: Math.floor(diffInDays(gridStart, monthCursor) / 7),
    })
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1)
  }

  const deduped = markers.reduce<Array<{ label: string; weekIndex: number }>>((acc, marker) => {
    const last = acc.at(-1)
    if (last && last.weekIndex === marker.weekIndex) {
      acc[acc.length - 1] = marker
      return acc
    }
    acc.push(marker)
    return acc
  }, [])

  return deduped
    .map((marker, index) => {
      const next = deduped[index + 1]
      return {
        ...marker,
        span: Math.max(1, (next?.weekIndex ?? totalWeeks) - marker.weekIndex),
      }
    })
    .filter((marker) => marker.weekIndex < totalWeeks)
}

function buildDayAriaLabel(day: CalendarDay) {
  if (day.outsideRange) {
    return `${formatAccessibleDate(day.date)}，不在当前统计范围内`
  }

  if (day.count === 0) {
    return `${formatAccessibleDate(day.date)}，当天没有练习记录`
  }

  const detail = [
    `${formatAccessibleDate(day.date)}，${day.count} 次练习`,
    day.averageWpm !== null ? `平均 ${day.averageWpm.toFixed(1)} WPM` : null,
    day.averageAccuracy !== null ? `准确率 ${(day.averageAccuracy * 100).toFixed(1)}%` : null,
  ].filter(Boolean)

  return detail.join('，')
}

function getWeekSpanWidth(weeks: number) {
  return weeks * CELL_SIZE + Math.max(0, weeks - 1) * CELL_GAP
}

function addDays(date: Date, offset: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + offset)
  return startOfDay(next)
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function getWeekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function diffInDays(start: Date, end: Date) {
  const startTime = startOfDay(start).getTime()
  const endTime = startOfDay(end).getTime()
  return Math.round((endTime - startTime) / 86400000)
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatMonth(date: Date) {
  return `${date.getMonth() + 1}月`
}

function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatAccessibleDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}