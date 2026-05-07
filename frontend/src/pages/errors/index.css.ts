import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const page = style({
  maxWidth: '1260px',
  margin: '0 auto',
  padding: 'clamp(18px, 3vw, 40px)',
  display: 'grid',
  gap: 'clamp(20px, 3vw, 32px)',
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing}`,
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.lg,
    },
  },
})

export const header = style({
  position: 'relative',
  overflow: 'hidden',
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
  fontSize: 'clamp(72px, 16vw, 210px)',
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
      gridTemplateColumns: 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
      alignItems: 'end',
    },
  },
})

export const heroCopy = style({
  display: 'grid',
  gap: vars.space.lg,
  maxWidth: '58ch',
})

export const ribbonRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const heroEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const title = style({
  margin: 0,
  display: 'grid',
  gap: '6px',
  fontSize: 'clamp(38px, 7vw, 78px)',
  fontWeight: 900,
  letterSpacing: '-0.06em',
  lineHeight: '0.92',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const titleAccent = style({
  fontSize: 'clamp(20px, 3vw, 34px)',
  lineHeight: '1',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 88%, ${vars.color.text.primary})`,
})

export const subtitle = style({
  margin: 0,
  maxWidth: '48ch',
  fontSize: 'clamp(15px, 1.6vw, 18px)',
  lineHeight: '1.75',
  color: vars.color.text.secondary,
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
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
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
  maxWidth: '30ch',
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

export const miniGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    '(max-width: 979px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const miniStat = style({
  borderRadius: '22px',
  border: '1px solid transparent',
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '6px',
  boxShadow: vars.shadow.sm,
})

export const miniTone = styleVariants({
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

export const miniLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const miniValue = style({
  fontSize: 'clamp(28px, 3.8vw, 40px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const miniCaption = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

const panelBase = style({
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.secondary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.secondary} 5%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  padding: 'clamp(18px, 2.6vw, 28px)',
  boxShadow: vars.shadow.md,
})

export const queuePanel = style([panelBase, {
  display: 'grid',
  gap: vars.space.lg,
}])

export const archivePanel = style([panelBase, {
  display: 'grid',
  gap: vars.space.lg,
}])

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const sectionTitleBlock = style({
  display: 'grid',
  gap: '6px',
  maxWidth: '56ch',
})

export const sectionEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const sectionTitle = style({
  margin: 0,
  fontSize: 'clamp(24px, 3vw, 34px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const sectionSubtitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const sectionMeta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const loadingState = style({
  padding: `${vars.space['2xl']} ${vars.space.lg}`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const feedbackCard = style({
  borderRadius: '24px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.secondary} 12%))`,
  boxShadow: vars.shadow.sm,
})

export const queueGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    '(min-width: 860px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

export const queueCard = style({
  borderRadius: '22px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.warning} 12%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: vars.space.sm,
  boxShadow: vars.shadow.sm,
})

export const queueCardTop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const queueContent = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  lineHeight: '1.5',
  color: vars.color.text.primary,
})

export const queueFoot = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const queueMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.secondary,
})

export const recordGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    '(min-width: 900px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const recordCard = style({
  borderRadius: '24px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.warning} 12%))`,
  padding: `${vars.space.lg} ${vars.space.xl}`,
  display: 'grid',
  gap: vars.space.md,
  boxShadow: vars.shadow.sm,
  transitionProperty: 'transform, box-shadow, border-color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: vars.shadow.md,
    borderColor: vars.color.border.default,
  },
})

export const recordTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const recordText = style({
  display: 'grid',
  gap: vars.space.sm,
  minWidth: 0,
})

export const recordTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const recordContent = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.primary,
  fontWeight: 700,
})

export const recordMeta = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.secondary,
})

export const recordScore = style({
  display: 'grid',
  justifyItems: 'end',
  gap: '4px',
  minWidth: '92px',
})

export const recordScoreValue = style({
  fontSize: 'clamp(34px, 5vw, 54px)',
  lineHeight: '0.9',
  fontWeight: 800,
  letterSpacing: '-0.06em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const recordScoreLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const recordMetrics = style({
  display: 'grid',
  gap: vars.space.sm,
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    '(min-width: 620px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

export const metricTile = style({
  borderRadius: '18px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 55%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 84%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.secondary} 12%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '6px',
})

export const metricTileLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const metricValueWrap = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  lineHeight: '1.5',
  color: vars.color.text.primary,
})

/* ── Review time ───────────────────────────────────────────── */

export const reviewTimeDue = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontWeight: '500',
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
})

export const reviewTimeUpcoming = style({
  color: vars.color.text.muted,
})

export const clockIcon = style({
  width: '13px',
  height: '13px',
})

/* ── Difficulty badges ─────────────────────────────────────── */

const diffBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `4px 10px`,
  borderRadius: vars.radius.pill,
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
})

export const diffEasy = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 13%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.success} 88%, ${vars.color.text.primary})`,
}])

export const diffMedium = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 12%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
}])

export const diffHard = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 12%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
}])

/* ── Pagination ────────────────────────────────────────────── */

export const pagination = style({
  marginTop: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  '@media': {
    '(max-width: 640px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})

export const paginationInfo = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const paginationButtons = style({
  display: 'flex',
  gap: vars.space.sm,
})

/* ── Icon helpers ──────────────────────────────────────────── */

export const buttonIcon = style({
  width: '15px',
  height: '15px',
})

/* ── Empty state ───────────────────────────────────────────── */

export const emptyStateWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space['2xl']} ${vars.space.lg}`,
  borderRadius: '24px',
  border: `1px dashed color-mix(in oklab, ${vars.color.border.default} 70%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.app} 40%, transparent)`,
})

export const emptyIcon = style({
  width: '44px',
  height: '44px',
  color: vars.color.text.muted,
  marginBottom: vars.space.xs,
  opacity: 0.45,
})

export const emptyTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  color: vars.color.text.secondary,
})

export const emptyDesc = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  textAlign: 'center',
})
