import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

export const page = style({
  maxWidth: '1140px',
  margin: '0 auto',
  padding: vars.space['2xl'],
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.lg,
    },
  },
})

export const header = style({
  marginBottom: vars.space.xl,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const backWrap = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const subtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const iconSm = style({
  width: '16px',
  height: '16px',
})

export const loadingPanel = style({
  paddingTop: vars.space['2xl'],
  paddingBottom: vars.space['2xl'],
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const errorPanel = style({
  paddingTop: vars.space['2xl'],
  paddingBottom: vars.space['2xl'],
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
})

export const stack = style({
  display: 'grid',
  gap: vars.space.xl,
})

export const cardHeaderSplit = style({
  gap: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
  },
})

export const sessionTitleWrap = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const pendingActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const metrics = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const actionError = style({
  marginTop: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 25%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
})

export const warningPanel = style({
  marginTop: vars.space.lg,
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 28%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 10%, ${vars.color.bg.panel})`,
  padding: `${vars.space.md} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
})

export const warningIcon = style({
  marginTop: '2px',
  width: '16px',
  height: '16px',
  flexShrink: 0,
})

export const splitGrid = style({
  display: 'grid',
  gap: vars.space.xl,
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: '1.3fr 1fr',
    },
  },
})

export const mutedText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const list = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const keyStatRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 65%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
})

export const keyChar = style({
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const keyInterval = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const hitErrorGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.md,
  textAlign: 'right',
  fontSize: vars.fontSize.sm,
})

export const hitErrorLabel = style({
  color: vars.color.text.muted,
})

export const hitErrorValue = style({
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const errorItemCard = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 65%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
})

export const errorItemHeader = style({
  marginBottom: vars.space.xs,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const errorItemContent = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const errorItemReview = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const contentGrid = style({
  display: 'grid',
  gap: vars.space.sm,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const contentStack = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const contentItem = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 65%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  padding: `${vars.space.md} ${vars.space.md}`,
})

export const contentItemHeader = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const contentItemTitle = style({
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const contentItemMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const contentItemBody = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const metricTile = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 65%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  padding: `${vars.space.md} ${vars.space.md}`,
})

export const metricLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const metricValue = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  color: vars.color.text.primary,
})
