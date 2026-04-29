import { style, keyframes } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

// ─── Keyframes ────────────────────────────────────────────────────────────────

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const baseAnimation = {
  animationName: fadeUp,
  animationDuration: vars.motion.slow,
  animationTimingFunction: vars.motion.easing,
  animationFillMode: 'both',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms',
    },
  },
} as const

// ─── Page layout ──────────────────────────────────────────────────────────────

export const page = style({
  maxWidth: '960px',
  margin: '0 auto',
  padding: `${vars.space['2xl']} ${vars.space['2xl']}`,
  '@media': {
    '(max-width: 640px)': {
      padding: vars.space.xl,
    },
  },
})

export const header = style({
  marginBottom: vars.space.xl,
  ...baseAnimation,
  animationDelay: '0ms',
})

export const contentStack = style({
  display: 'grid',
  gap: vars.space['2xl'],
  '@media': {
    '(max-width: 640px)': {
      gap: vars.space.xl,
    },
  },
})

export const sectionTight = style({
  display: 'grid',
  gap: vars.space.md,
})

export const sectionNormal = style({
  display: 'grid',
  gap: vars.space.lg,
})

export const sectionLoose = style({
  display: 'grid',
  gap: vars.space.xl,
})

export const headerTitle = style({
  fontSize: 'clamp(20px, 3.5vw, 28px)',
  fontWeight: '700',
  letterSpacing: '-0.025em',
  lineHeight: '1.15',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
  marginBottom: vars.space.xs,
})

export const headerSubtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const section = style({
  marginBottom: vars.space['2xl'],
})

export const sectionHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const sectionHeadCompact = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const sectionLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

// ─── Today bento grid ─────────────────────────────────────────────────────────
// Mobile:   2-col; streak spans full row, practice+duration below, review spans full row
// Desktop:  3-col; streak spans col-1 rows 1–2, practice/duration top-right, review bottom-right

export const todayGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.lg,
  ...baseAnimation,
  animationDelay: '60ms',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: '1.15fr 1fr 1fr',
    },
  },
})

export const streakCard = style({
  gridColumn: '1 / 3',
  gridRow: '1',
  borderRadius: vars.radius.xl,
  background: `linear-gradient(145deg,
    ${vars.color.brand.primary},
    color-mix(in oklab, ${vars.color.brand.primary} 60%, ${vars.color.brand.warning} 40%))`,
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: vars.space.lg,
  boxShadow: vars.shadow.md,
  position: 'relative',
  overflow: 'hidden',

  '::after': {
    content: '""',
    position: 'absolute',
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    background: 'oklch(1 0 0 / 0.07)',
    right: '-24px',
    bottom: '-36px',
    pointerEvents: 'none',
  },

  '@media': {
    '(min-width: 640px)': {
      gridColumn: '1',
      gridRow: '1 / 3',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 0,
      justifyContent: 'space-between',
    },
  },
})

export const streakEmoji = style({
  fontSize: '28px',
  lineHeight: '1',
  flexShrink: 0,
  '@media': {
    '(min-width: 640px)': {
      fontSize: '32px',
      marginBottom: vars.space.sm,
    },
  },
})

export const streakNumber = style({
  fontSize: 'clamp(36px, 7vw, 52px)',
  fontWeight: '800',
  lineHeight: '1',
  letterSpacing: '-0.04em',
  color: 'oklch(1 0 0)',
})

export const streakUnit = style({
  fontSize: vars.fontSize.sm,
  color: 'oklch(1 0 0 / 0.72)',
  marginTop: '2px',
})

export const streakBottomLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'oklch(1 0 0 / 0.6)',
  '@media': {
    '(max-width: 639px)': {
      display: 'none',
    },
  },
})

export const statCard = style({
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.bg.panel,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  boxShadow: vars.shadow.sm,
  transitionProperty: 'box-shadow, border-color',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,

  ':hover': {
    boxShadow: vars.shadow.md,
    borderColor: vars.color.border.default,
  },
})

export const practiceCard = style([statCard, {
  gridColumn: '1',
  gridRow: '2',
  '@media': {
    '(min-width: 640px)': {
      gridColumn: '2',
      gridRow: '1',
    },
  },
}])

export const durationCard = style([statCard, {
  gridColumn: '2',
  gridRow: '2',
  '@media': {
    '(min-width: 640px)': {
      gridColumn: '3',
      gridRow: '1',
    },
  },
}])

export const reviewCard = style([statCard, {
  gridColumn: '1 / 3',
  gridRow: '3',
  '@media': {
    '(min-width: 640px)': {
      gridColumn: '2 / 4',
      gridRow: '2',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
}])

export const reviewCardAlert = style([statCard, {
  gridColumn: '1 / 3',
  gridRow: '3',
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 9%, ${vars.color.bg.panel})`,
  borderColor: `color-mix(in oklab, ${vars.color.brand.warning} 30%, transparent)`,
  ':hover': {
    boxShadow: vars.shadow.md,
    borderColor: `color-mix(in oklab, ${vars.color.brand.warning} 50%, transparent)`,
  },
  '@media': {
    '(min-width: 640px)': {
      gridColumn: '2 / 4',
      gridRow: '2',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
}])

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  fontWeight: '500',
})

export const statValue = style({
  fontSize: vars.fontSize.xl,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  lineHeight: '1.1',
})

export const statAccentDot = style({
  width: '20px',
  height: '3px',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.brand.primary,
  marginTop: vars.space.xs,
})

export const statAccentDotSuccess = style({
  width: '20px',
  height: '3px',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.brand.success,
  marginTop: vars.space.xs,
})

export const statAccentDotWarning = style({
  width: '20px',
  height: '3px',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.brand.warning,
  marginTop: vars.space.xs,
})

// ─── Goals ────────────────────────────────────────────────────────────────────

export const goalsSection = style({
  ...baseAnimation,
  animationDelay: '120ms',
})

export const goalsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: vars.space.lg,
})

export const goalItem = style({
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.bg.panel,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.lg,
  boxShadow: vars.shadow.sm,
})

export const goalItemHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.sm,
})

export const goalType = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  color: vars.color.text.muted,
})

export const goalValues = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  marginBottom: vars.space.sm,
})

export const goalTrack = style({
  height: '4px',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.border.soft,
  overflow: 'hidden',
})

export const goalFill = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.brand.primary,
  transitionProperty: 'width',
  transitionDuration: vars.motion.slow,
  transitionTimingFunction: vars.motion.easing,
})

export const goalFillDone = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.brand.success,
  transitionProperty: 'width',
  transitionDuration: vars.motion.slow,
  transitionTimingFunction: vars.motion.easing,
})

// ─── Summary data strip ───────────────────────────────────────────────────────

export const summarySection = style({
  ...baseAnimation,
  animationDelay: '180ms',
})

export const summaryStrip = style({
  display: 'flex',
  gap: 0,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.bg.panel,
  border: `1px solid ${vars.color.border.soft}`,
  boxShadow: vars.shadow.sm,
  overflow: 'hidden',
  flexWrap: 'wrap',
})

export const summaryItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: `${vars.space.lg} ${vars.space.xl}`,
  flex: '1 1 0',
  minWidth: '100px',
  position: 'relative',

  selectors: {
    '& + &::before': {
      content: '""',
      position: 'absolute',
      left: '0',
      top: vars.space.lg,
      bottom: vars.space.lg,
      width: '1px',
      backgroundColor: vars.color.border.soft,
    },
  },
})

export const summaryValue = style({
  fontSize: vars.fontSize.xl,
  fontWeight: '700',
  letterSpacing: '-0.025em',
  color: vars.color.text.primary,
  lineHeight: '1.1',
})

export const summaryLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

// ─── Quick actions ────────────────────────────────────────────────────────────

export const actionsSection = style({
  ...baseAnimation,
  animationDelay: '240ms',
})

export const actionsRow = style({
  display: 'flex',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const statGroup = style({
  display: 'grid',
  gap: vars.space.xs,
})
