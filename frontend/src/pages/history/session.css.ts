import { style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

export const page = style({
  maxWidth: '1260px',
  margin: '0 auto',
  padding: 'clamp(18px, 3vw, 40px)',
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.lg,
    },
  },
})

export const header = style({
  position: 'relative',
  overflow: 'hidden',
  marginBottom: 'clamp(20px, 3vw, 32px)',
  borderRadius: '32px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 26%, ${vars.color.border.soft})`,
  background: `linear-gradient(145deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, ${vars.color.brand.warning} 28%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.primary} 16%))`,
  padding: 'clamp(24px, 4vw, 40px)',
  boxShadow: vars.shadow.lg,
})

export const heroTexture = style({
  position: 'absolute',
  inset: 0,
  backgroundImage: `repeating-linear-gradient(
    118deg,
    transparent 0 26px,
    color-mix(in oklab, ${vars.color.brand.primary} 12%, transparent) 26px 30px
  )`,
  opacity: 0.45,
  pointerEvents: 'none',
})

export const heroBackdrop = style({
  position: 'absolute',
  right: 'clamp(18px, 4vw, 42px)',
  bottom: '-24px',
  fontSize: 'clamp(76px, 18vw, 220px)',
  lineHeight: '0.78',
  letterSpacing: '-0.08em',
  fontWeight: 900,
  color: `color-mix(in oklab, ${vars.color.text.primary} 12%, transparent)`,
  userSelect: 'none',
  pointerEvents: 'none',
})

export const heroLayout = style({
  position: 'relative',
  display: 'grid',
  gap: 'clamp(20px, 3vw, 36px)',
  '@media': {
    '(min-width: 980px)': {
      gridTemplateColumns: 'minmax(0, 1.08fr) minmax(320px, 0.92fr)',
      alignItems: 'end',
    },
  },
})

export const heroCopy = style({
  display: 'grid',
  gap: vars.space.lg,
  maxWidth: '58ch',
})

export const backWrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const ribbonRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const title = style({
  margin: 0,
  fontSize: 'clamp(38px, 7vw, 78px)',
  fontWeight: 900,
  lineHeight: '0.94',
  letterSpacing: '-0.06em',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const subtitle = style({
  margin: 0,
  maxWidth: '48ch',
  fontSize: 'clamp(15px, 1.6vw, 18px)',
  lineHeight: '1.75',
  color: vars.color.text.secondary,
})

export const iconSm = style({
  width: '16px',
  height: '16px',
})

export const coachNote = style({
  display: 'grid',
  gap: '6px',
  maxWidth: '42ch',
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  backgroundColor: 'color-mix(in oklab, white 46%, transparent)',
  padding: `${vars.space.md} ${vars.space.lg}`,
  boxShadow: vars.shadow.sm,
})

export const coachLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const coachValue = style({
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.primary,
})

export const heroActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const heroBoard = style({
  display: 'grid',
  gap: vars.space.md,
  alignSelf: 'stretch',
})

export const primaryScore = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '28px',
  minHeight: '248px',
  padding: 'clamp(20px, 3vw, 28px)',
  display: 'grid',
  alignContent: 'space-between',
  gap: vars.space.md,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.brand.warning} 52%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.primary} 22%, ${vars.color.bg.panelElevated}))`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, transparent)`,
  boxShadow: vars.shadow.md,
})

export const scoreLabel = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.text.primary} 76%, ${vars.color.brand.primary})`,
})

export const scoreValueRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const scoreValue = style({
  fontSize: 'clamp(72px, 10vw, 132px)',
  fontWeight: 800,
  lineHeight: '0.9',
  letterSpacing: '-0.08em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const scoreSuffix = style({
  paddingBottom: '12px',
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.secondary,
})

export const scoreCaption = style({
  margin: 0,
  maxWidth: '28ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: `color-mix(in oklab, ${vars.color.text.primary} 82%, ${vars.color.brand.primary})`,
})

export const scoreLane = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '18px',
  backgroundImage: `repeating-linear-gradient(
    90deg,
    color-mix(in oklab, ${vars.color.text.primary} 10%, transparent) 0 24px,
    transparent 24px 36px
  )`,
})

export const snapshotGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const snapshotTile = style({
  borderRadius: '22px',
  border: '1px solid transparent',
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '6px',
  boxShadow: vars.shadow.sm,
})

export const snapshotTone = styleVariants({
  warning: {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 22%, ${vars.color.bg.panel})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.warning} 32%, transparent)`,
  },
  neutral: {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panel})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.secondary} 28%, transparent)`,
  },
  success: {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 20%, ${vars.color.bg.panel})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.success} 28%, transparent)`,
  },
})

export const snapshotTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const snapshotLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const snapshotIcon = style({
  color: vars.color.text.secondary,
})

export const snapshotValue = style({
  fontSize: 'clamp(26px, 3.8vw, 40px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const snapshotCaption = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const loadingPanel = style({
  paddingTop: vars.space['2xl'],
  paddingBottom: vars.space['2xl'],
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const errorPanel = style({
  paddingTop: vars.space['2xl'],
  paddingBottom: vars.space['2xl'],
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
})

export const stateCard = style({
  borderRadius: '26px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.secondary} 5%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  boxShadow: vars.shadow.sm,
})

export const stack = style({
  display: 'grid',
  gap: 'clamp(18px, 2.6vw, 28px)',
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

export const summaryCard = style({
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 94%, ${vars.color.brand.warning} 6%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.secondary} 2%))`,
  boxShadow: vars.shadow.md,
})

export const sectionCard = style({
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.secondary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.secondary} 5%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  boxShadow: vars.shadow.md,
})

export const sessionTitleWrap = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const panelEyebrow = style({
  margin: '0 0 6px',
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const panelTitle = style({
  margin: 0,
  fontSize: 'clamp(24px, 3vw, 34px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const panelDescription = style({
  margin: '8px 0 0',
  maxWidth: '46ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
})

export const summaryBadges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const summaryBody = style({
  display: 'grid',
  gap: vars.space.lg,
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
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
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
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 28%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 10%, ${vars.color.bg.panel})`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
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
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const list = style({
  display: 'grid',
  gap: vars.space.md,
})

export const keyStatRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.warning} 12%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const keyChar = style({
  fontSize: vars.fontSize.md,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
})

export const keyInterval = style({
  marginTop: '4px',
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
  marginTop: '4px',
  fontWeight: 800,
  fontSize: vars.fontSize.md,
  color: vars.color.text.primary,
})

export const errorItemCard = style({
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.warning} 14%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const errorItemHeader = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const errorItemContent = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const errorItemReview = style({
  fontSize: vars.fontSize.xs,
  lineHeight: '1.6',
  color: vars.color.text.secondary,
})

export const warningIcon = style({
  marginTop: '2px',
  width: '16px',
  height: '16px',
  flexShrink: 0,
})

export const contentGrid = style({
  display: 'grid',
  gap: vars.space.md,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const contentStack = style({
  display: 'grid',
  gap: vars.space.md,
})

export const contentItem = style({
  borderRadius: '22px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.secondary} 12%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const contentItemHeader = style({
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const contentItemTitle = style({
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const contentItemMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.secondary,
})

export const contentItemBody = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const metricTile = style({
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 55%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 90%, ${vars.color.brand.secondary} 10%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const metricLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const metricValue = style({
  marginTop: vars.space.sm,
  fontSize: 'clamp(20px, 2.6vw, 30px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})
