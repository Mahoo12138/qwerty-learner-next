import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const fadeSlideUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const page = style({
  maxWidth: '900px',
  margin: '0 auto',
  padding: vars.space['2xl'],
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.lg,
    },
  },
})

export const pageHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  marginBottom: vars.space['2xl'],
  '@media': {
    '(max-width: 480px)': {
      flexDirection: 'column',
    },
  },
})

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: '700',
  letterSpacing: '-0.02em',
  lineHeight: '1.15',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const subtitle = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const statsBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.xl,
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const statCount = style({
  fontWeight: '600',
  color: vars.color.text.secondary,
})

export const iconSm = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
})

export const iconXs = style({
  width: '13px',
  height: '13px',
  flexShrink: 0,
})

export const actionError = style({
  marginBottom: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 25%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
})

export const loadingState = style({
  padding: `${vars.space['2xl']} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const emptyState = style({
  padding: `${vars.space['2xl']} 0`,
  textAlign: 'center',
})

export const emptyTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '600',
  color: vars.color.text.secondary,
  marginBottom: vars.space.xs,
})

export const emptyDesc = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: vars.space.xl,
})

export const entry = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space.md,
  padding: `${vars.space.lg} ${vars.space.xl} ${vars.space.lg} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  borderLeft: '3px solid transparent',
  position: 'relative',
  animation: `${fadeSlideUp} ${vars.motion.slow} ${vars.motion.easing} both`,
  transition: `background ${vars.motion.fast} ${vars.motion.easing}`,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'minmax(0, 1fr) auto auto',
      alignItems: 'center',
      gap: vars.space.xl,
    },
  },
  selectors: {
    '&:first-child': {
      borderTop: `1px solid ${vars.color.border.soft}`,
    },
    '&:hover': {
      background: `color-mix(in oklab, ${vars.color.brand.primary} 4%, transparent)`,
    },
  },
})

export const entryComplete = style({
  borderLeftColor: vars.color.brand.primary,
})

export const entryPending = style({
  borderLeftColor: vars.color.brand.warning,
})

export const entryInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  minWidth: 0,
})

export const entryTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panel})`,
  color: `color-mix(in oklab, ${vars.color.brand.primary} 75%, ${vars.color.text.primary})`,
})

export const tagCount = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `2px ${vars.space.sm}`,
  borderRadius: vars.radius.pill,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  background: `color-mix(in oklab, ${vars.color.border.default} 30%, ${vars.color.bg.panel})`,
  color: vars.color.text.muted,
})

export const entryDate = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const entryMetrics = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xl,
  '@media': {
    '(min-width: 768px)': {
      justifyContent: 'flex-end',
    },
  },
})

export const metricWpm = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const metricWpmValue = style({
  fontSize: vars.fontSize.xl,
  fontWeight: '700',
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.02em',
  lineHeight: '1',
  color: vars.color.text.primary,
})

export const metricWpmLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  marginTop: '2px',
})

export const metricItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const metricValue = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text.secondary,
  lineHeight: '1.2',
})

export const metricDuration = style({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.secondary,
  lineHeight: '1.2',
})

export const metricLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  marginTop: '2px',
})

export const entryActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  '@media': {
    '(min-width: 768px)': {
      justifyContent: 'flex-end',
    },
  },
})

export const pager = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.lg} 0`,
  gap: vars.space.md,
  '@media': {
    '(max-width: 640px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})

export const pagerText = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const pagerButtons = style({
  display: 'flex',
  gap: vars.space.sm,
})
