import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

export const root = style({
  display: 'grid',
  gap: vars.space.lg,
})

export const summaryRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const summaryPill = style({
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '2px',
  minWidth: '128px',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, ${vars.color.brand.secondary} 6%) 0%, ${vars.color.bg.panel} 100%)`,
})

export const summaryLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const summaryValue = style({
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const board = style({
  display: 'grid',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 70%, ${vars.color.bg.panel}) 0%, ${vars.color.bg.panel} 100%)`,
  boxShadow: vars.shadow.sm,
})

export const monthHeaderRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space.sm,
})

export const monthHeaderOffset = style({
  width: '28px',
  flexShrink: 0,
})

export const monthHeader = style({
  display: 'flex',
  gap: '4px',
  minWidth: 'max-content',
})

export const monthBlock = style({
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  lineHeight: 1,
  color: vars.color.text.muted,
})

export const gridRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
})

export const weekdayRail = style({
  width: '28px',
  flexShrink: 0,
  display: 'grid',
  gridTemplateRows: 'repeat(7, 14px)',
  rowGap: '4px',
})

export const weekdayLabel = style({
  display: 'flex',
  alignItems: 'center',
  height: '14px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const scrollViewport = style({
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: vars.space.xs,
  scrollbarWidth: 'thin',
})

export const weeksRow = style({
  display: 'flex',
  gap: '4px',
  minWidth: 'max-content',
})

export const weekColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flexShrink: 0,
})

export const dayCell = style({
  width: '14px',
  height: '14px',
  borderRadius: '4px',
  border: '1px solid transparent',
  transition: `transform ${vars.motion.fast} ${vars.motion.easing}, border-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      transform: 'scale(1.08)',
      boxShadow: vars.shadow.sm,
    },
  },
})

export const dayLevel = styleVariants({
  0: {
    background: `color-mix(in oklab, ${vars.color.border.soft} 55%, ${vars.color.bg.app})`,
    borderColor: `color-mix(in oklab, ${vars.color.border.soft} 62%, transparent)`,
  },
  1: {
    background: `color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 22%, transparent)`,
  },
  2: {
    background: `color-mix(in oklab, ${vars.color.brand.primary} 35%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 30%, transparent)`,
  },
  3: {
    background: `color-mix(in oklab, ${vars.color.brand.primary} 54%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 44%, transparent)`,
  },
  4: {
    background: `color-mix(in oklab, ${vars.color.brand.primaryHover} 84%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 62%, transparent)`,
  },
})

export const dayOutsideRange = style({
  opacity: 0.28,
})

export const dayToday = style({
  borderColor: vars.color.text.secondary,
})

export const footer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const note = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: 1.6,
})

export const noteMuted = style({
  color: vars.color.text.muted,
})

export const legend = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const legendScale = style({
  display: 'inline-flex',
  gap: '4px',
  alignItems: 'center',
})

export const legendSwatch = style({
  width: '14px',
  height: '14px',
  borderRadius: '4px',
  border: '1px solid transparent',
})