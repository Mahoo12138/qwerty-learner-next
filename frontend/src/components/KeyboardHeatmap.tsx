import { clsx } from 'clsx'
import { useRef, useState } from 'react'
import type { KeymapStat } from '@/types/api'
import { vars } from '@/styles/theme.css'
import * as css from './KeyboardHeatmap.css'

const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const KEY_W = 44
const KEY_H = 44
const GAP = 4
const RADIUS = 8
const TOOLTIP_WIDTH = 168

const HEATMAP_COLORS = [
  {
    threshold: 0,
    color: `color-mix(in oklab, ${vars.color.border.soft} 54%, ${vars.color.bg.panelElevated})`,
  },
  {
    threshold: 0.02,
    color: `color-mix(in oklab, ${vars.color.brand.accent} 24%, ${vars.color.bg.panelElevated})`,
  },
  {
    threshold: 0.05,
    color: `color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.bg.panelElevated})`,
  },
  {
    threshold: 0.1,
    color: `color-mix(in oklab, ${vars.color.brand.primary} 52%, ${vars.color.bg.panelElevated})`,
  },
  {
    threshold: 0.2,
    color: `color-mix(in oklab, ${vars.color.brand.warning} 72%, ${vars.color.bg.panelElevated})`,
  },
  {
    threshold: 0.35,
    color: `color-mix(in oklab, ${vars.color.brand.danger} 78%, ${vars.color.bg.panelElevated})`,
  },
] as const

const EMPTY_KEY_COLOR = `color-mix(in oklab, ${vars.color.border.soft} 36%, ${vars.color.bg.panel})`

interface Props {
  data: KeymapStat[]
  dark?: boolean
}

interface TooltipState {
  keyChar: string
  hits: number
  errorRate: number | null
  left: number
  top: number
  arrowLeft: number
  placement: 'top' | 'bottom'
}

export default function KeyboardHeatmap({ data, dark = false }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const lookup = new Map(data.map((item) => [item.key_char.toLowerCase(), item]))

  const rowOffsets = [0, 0.5, 1]
  const totalW = 10 * KEY_W + 9 * GAP
  const totalH = 3 * KEY_H + 2 * GAP

  function showTooltip(keyChar: string, stat: KeymapStat | undefined, x: number, y: number) {
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return

    const centerX = ((x + KEY_W / 2) / totalW) * svgRect.width
    const centerY = ((y + KEY_H / 2) / totalH) * svgRect.height
    const bubbleLeft = clamp(centerX - TOOLTIP_WIDTH / 2, 0, Math.max(0, svgRect.width - TOOLTIP_WIDTH))

    setTooltip({
      keyChar,
      hits: stat?.total_hits ?? 0,
      errorRate: stat && stat.total_hits > 0 ? stat.error_rate : null,
      left: bubbleLeft,
      top: Math.max(centerY, 18),
      arrowLeft: clamp(centerX - bubbleLeft, 20, TOOLTIP_WIDTH - 20),
      placement: y <= KEY_H ? 'bottom' : 'top',
    })
  }

  return (
    <div className={css.root}>
      <div className={css.canvas}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${totalW} ${totalH}`}
          className={css.svg}
          role="img"
          aria-label="键位热力图，颜色越深表示错误率越高"
        >
          {ROWS.map((row, rowIndex) => {
            const offsetX = rowOffsets[rowIndex] * (KEY_W + GAP)

            return row.map((keyChar, keyIndex) => {
              const stat = lookup.get(keyChar)
              const errorRate = stat?.error_rate ?? 0
              const hasHits = Boolean(stat && stat.total_hits > 0)
              const fill = hasHits ? getColor(errorRate) : EMPTY_KEY_COLOR
              const x = offsetX + keyIndex * (KEY_W + GAP)
              const y = rowIndex * (KEY_H + GAP)
              const active = tooltip?.keyChar === keyChar
              const label = buildTooltipLabel(keyChar, stat)
              const textColor = getTextColor(errorRate, hasHits, dark)

              return (
                <g
                  key={keyChar}
                  className={css.keyGroup}
                  tabIndex={0}
                  role="img"
                  aria-label={label}
                  onMouseEnter={() => showTooltip(keyChar, stat, x, y)}
                  onFocus={() => showTooltip(keyChar, stat, x, y)}
                  onMouseLeave={() => setTooltip((current) => (current?.keyChar === keyChar ? null : current))}
                  onBlur={() => setTooltip((current) => (current?.keyChar === keyChar ? null : current))}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setTooltip(null)
                    }
                  }}
                >
                  <title>{label}</title>
                  <rect
                    x={x}
                    y={y}
                    width={KEY_W}
                    height={KEY_H}
                    rx={RADIUS}
                    fill={fill}
                    stroke={active ? vars.color.text.secondary : 'transparent'}
                    strokeWidth={active ? 1.5 : 1}
                    filter={active ? 'drop-shadow(0 10px 16px rgb(0 0 0 / 0.14))' : undefined}
                    className={css.keyRect}
                  />
                  <text
                    x={x + KEY_W / 2}
                    y={y + KEY_H / 2 - 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    {keyChar.toUpperCase()}
                  </text>
                  {hasHits && (
                    <text
                      x={x + KEY_W / 2}
                      y={y + KEY_H / 2 + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textColor}
                      fontSize="9"
                      opacity={0.66}
                      fontFamily="system-ui, sans-serif"
                    >
                      {(errorRate * 100).toFixed(0)}%
                    </text>
                  )}
                </g>
              )
            })
          })}
        </svg>

        {tooltip && (
          <div
            className={clsx(css.tooltip, tooltip.placement === 'top' ? css.tooltipTop : css.tooltipBottom)}
            style={{
              left: `${tooltip.left}px`,
              top: `${tooltip.top}px`,
            }}
          >
            <span
              className={clsx(
                css.tooltipArrow,
                tooltip.placement === 'top' ? css.tooltipArrowTop : css.tooltipArrowBottom,
              )}
              style={{ left: `${tooltip.arrowLeft}px` }}
            />
            <div className={css.tooltipHeader}>
              <span className={css.tooltipTitle}>键位详情</span>
              <span className={css.tooltipKey}>{tooltip.keyChar.toUpperCase()}</span>
            </div>
            <div className={css.tooltipStats}>
              <div className={css.tooltipStat}>
                <span className={css.tooltipLabel}>命中次数</span>
                <span className={css.tooltipValue}>{tooltip.hits} 次</span>
              </div>
              <div className={css.tooltipStat}>
                <span className={css.tooltipLabel}>错误率</span>
                <span className={css.tooltipValue}>
                  {tooltip.errorRate === null ? '—' : `${(tooltip.errorRate * 100).toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={css.legend}>
        <span className={css.legendText}>低错误率</span>
        <div className={css.legendScale}>
          {HEATMAP_COLORS.map((step, index) => (
            <div
              key={index}
              className={css.legendSwatch}
              style={{
                backgroundColor: step.color,
                borderRadius:
                  index === 0
                    ? '999px 0 0 999px'
                    : index === HEATMAP_COLORS.length - 1
                      ? '0 999px 999px 0'
                      : undefined,
              }}
            />
          ))}
        </div>
        <span className={css.legendText}>高错误率</span>
      </div>
    </div>
  )
}

function getColor(rate: number) {
  let color: string = HEATMAP_COLORS[0].color
  for (const step of HEATMAP_COLORS) {
    if (rate >= step.threshold) {
      color = step.color
    }
  }
  return color
}

function getTextColor(rate: number, hasHits: boolean, dark: boolean) {
  if (!hasHits) {
    return vars.color.text.muted
  }

  if (rate >= (dark ? 0.18 : 0.24)) {
    return vars.color.text.inverse
  }

  if (rate >= 0.1) {
    return vars.color.text.primary
  }

  return vars.color.text.secondary
}

function buildTooltipLabel(keyChar: string, stat: KeymapStat | undefined) {
  const hits = stat?.total_hits ?? 0
  const errorRate = stat && stat.total_hits > 0 ? `${(stat.error_rate * 100).toFixed(1)}%` : '—'
  return `键位 ${keyChar.toUpperCase()}，命中 ${hits} 次，错误率 ${errorRate}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
