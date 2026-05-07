import { globalStyle, keyframes, style, styleVariants } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const riseIn = keyframes({
  from: { opacity: 0, transform: 'translateY(18px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const pageRoot = style({
  maxWidth: '1260px',
  margin: '0 auto',
  padding: 'clamp(18px, 3vw, 42px)',
  display: 'grid',
  gap: 'clamp(20px, 3vw, 34px)',
  animation: `${riseIn} ${vars.motion.slow} ${vars.motion.easing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})

export const hero = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '32px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.soft})`,
  background: `linear-gradient(145deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 70%, ${vars.color.brand.warning} 30%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, ${vars.color.brand.primary} 18%))`,
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
  opacity: 0.5,
  pointerEvents: 'none',
})

export const heroBackdrop = style({
  position: 'absolute',
  right: 'clamp(18px, 4vw, 42px)',
  bottom: '-26px',
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
      gridTemplateColumns: 'minmax(0, 1.24fr) minmax(320px, 0.76fr)',
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

export const heroTitleStack = style({
  display: 'grid',
  gap: '8px',
})

export const heroEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontWeight: 800,
  color: vars.color.text.muted,
})

export const heroTitle = style({
  margin: 0,
  display: 'grid',
  gap: '4px',
  fontSize: 'clamp(40px, 7vw, 86px)',
  lineHeight: '0.92',
  letterSpacing: '-0.065em',
  fontWeight: 900,
  color: vars.color.text.primary,
})

export const heroTitleAccent = style({
  fontSize: 'clamp(22px, 4vw, 42px)',
  lineHeight: '1',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 88%, ${vars.color.text.primary})`,
})

export const heroSubtitle = style({
  margin: 0,
  maxWidth: '46ch',
  fontSize: 'clamp(15px, 1.5vw, 18px)',
  lineHeight: '1.75',
  color: vars.color.text.secondary,
})

export const coachNote = style({
  display: 'grid',
  gap: '6px',
  maxWidth: '40ch',
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  backgroundColor: 'color-mix(in oklab, white 48%, transparent)',
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

export const heroScoreboard = style({
  display: 'grid',
  gap: vars.space.md,
  alignSelf: 'stretch',
})

export const scorePrimary = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '28px',
  minHeight: '250px',
  padding: 'clamp(20px, 3vw, 28px)',
  display: 'grid',
  alignContent: 'space-between',
  gap: vars.space.md,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.brand.warning} 52%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.primary} 22%, ${vars.color.bg.panelElevated}))`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, transparent)`,
  boxShadow: vars.shadow.md,
  animation: `${riseIn} ${vars.motion.normal} ${vars.motion.easing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
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
  fontSize: 'clamp(72px, 10vw, 136px)',
  fontWeight: '700',
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
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  maxWidth: '28ch',
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

export const scoreSecondaryGrid = style({
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

export const miniMetric = style({
  borderRadius: '22px',
  border: '1px solid transparent',
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '6px',
  boxShadow: vars.shadow.sm,
  animation: `${riseIn} ${vars.motion.normal} ${vars.motion.easing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})

export const miniMetricTone = styleVariants({
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

export const miniMetricTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const miniMetricLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const miniMetricIcon = style({
  color: vars.color.text.secondary,
})

export const miniMetricValue = style({
  fontSize: 'clamp(28px, 3.5vw, 42px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const miniMetricCaption = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const controlStrip = style({
  borderRadius: '28px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.secondary} 5%),
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.warning} 5%))`,
  padding: 'clamp(18px, 2.4vw, 28px)',
  boxShadow: vars.shadow.sm,
  display: 'grid',
  gap: vars.space.lg,
})

export const controlHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
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
  margin: '6px 0 0',
  fontSize: 'clamp(28px, 4vw, 44px)',
  lineHeight: '0.96',
  letterSpacing: '-0.05em',
  fontWeight: 900,
  color: vars.color.text.primary,
})

export const sectionSub = style({
  margin: '8px 0 0',
  maxWidth: '56ch',
  lineHeight: '1.7',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const filterRail = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const filterButton = style({
  minWidth: '118px',
  borderRadius: vars.radius.pill,
  fontWeight: 700,
  letterSpacing: '0.02em',
})

export const filterButtonActive = style({
  boxShadow: vars.shadow.md,
})

export const searchBlock = style({
  display: 'grid',
  gap: vars.space.sm,
  '@media': {
    '(min-width: 760px)': {
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'center',
    },
  },
})

export const searchInput = style({
  height: '50px',
  borderRadius: '20px',
  borderColor: `color-mix(in oklab, ${vars.color.border.strong} 76%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.warning} 14%)`,
  boxShadow: vars.shadow.sm,
  fontSize: vars.fontSize.sm,
})

export const searchMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const searchMetaStrong = style({
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const boardSection = style({
  display: 'grid',
  gap: vars.space.md,
})

export const boardHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
})

export const boardEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const boardTitle = style({
  margin: '6px 0 0',
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const boardSub = style({
  margin: '6px 0 0',
  fontSize: vars.fontSize.sm,
  maxWidth: '60ch',
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const tableFrame = style({
  borderRadius: '30px',
  overflow: 'hidden',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.secondary} 4%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  boxShadow: vars.shadow.md,
})

export const tableShell = style({
  overflowX: 'auto',
})

export const boardTable = style({
  width: '100%',
  minWidth: '980px',
  borderCollapse: 'separate',
  borderSpacing: 0,
})

export const boardHeadCell = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  textAlign: 'left',
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.secondary} 14%)`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
})

export const boardRow = style({
  selectors: {},
})

globalStyle(`${boardRow}:hover td`, {
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 90%, ${vars.color.brand.warning} 10%)`,
})

export const boardCell = style({
  padding: `${vars.space.lg} ${vars.space.lg}`,
  borderBottom: `1px solid color-mix(in oklab, ${vars.color.border.soft} 76%, transparent)`,
  verticalAlign: 'middle',
  backgroundColor: 'transparent',
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing}`,
})

export const wordCell = style({
  position: 'relative',
  display: 'grid',
  gap: '6px',
  minWidth: '180px',
  paddingLeft: '14px',
})

export const wordCellTone = styleVariants({
  learning: {
    selectors: {
      '&::before': {
        backgroundColor: vars.color.border.strong,
      },
    },
  },
  pre_mastered: {
    selectors: {
      '&::before': {
        backgroundColor: vars.color.brand.warning,
      },
    },
  },
  mastered: {
    selectors: {
      '&::before': {
        backgroundColor: vars.color.brand.success,
      },
    },
  },
})

globalStyle(`${wordCell}::before`, {
  content: '""',
  position: 'absolute',
  left: 0,
  top: '2px',
  bottom: '2px',
  width: '5px',
  borderRadius: '999px',
})

export const wordValue = style({
  fontWeight: '700',
  fontSize: vars.fontSize.md,
  color: vars.color.text.primary,
})

export const wordMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
})

export const numericCell = style({
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text.primary,
})

export const numericPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '44px',
  padding: '6px 10px',
  borderRadius: vars.radius.pill,
  fontWeight: 800,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text.primary,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 14%, ${vars.color.bg.panelElevated})`,
})

export const dateCell = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const statusBadge = style({
  width: 'fit-content',
})

export const promoteButton = style({
  borderRadius: vars.radius.pill,
  fontWeight: 700,
})

export const emptyState = style({
  borderRadius: '24px',
  margin: vars.space.lg,
  border: `1px dashed ${vars.color.border.strong}`,
  padding: `${vars.space['2xl']} ${vars.space.xl}`,
  textAlign: 'center',
  color: vars.color.text.secondary,
  backgroundImage: `repeating-linear-gradient(
    120deg,
    color-mix(in oklab, ${vars.color.brand.warning} 8%, transparent) 0 18px,
    transparent 18px 34px
  )`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, transparent)`,
})

export const emptyTitle = style({
  margin: '0 0 6px',
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const emptyText = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
})

export const paginationRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.lg,
  flexWrap: 'wrap',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderTop: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.secondary} 16%)`,
})

export const paginationInfo = style({
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
})

export const paginationButtons = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const paginationButton = style({
  borderRadius: vars.radius.pill,
})

export const loadingText = style({
  margin: 0,
  padding: `${vars.space['2xl']} ${vars.space.xl}`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
})