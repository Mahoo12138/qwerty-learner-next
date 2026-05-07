import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const pageRoot = style({
  maxWidth: '1040px',
  margin: '0 auto',
  padding: 'clamp(16px, 2.4vw, 32px)',
  display: 'grid',
  gap: vars.space.xl,
})

export const hero = style({
  position: 'relative',
  borderRadius: vars.radius.xl,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.soft})`,
  background: `linear-gradient(140deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, ${vars.color.brand.warning} 20%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, ${vars.color.brand.secondary} 18%))`,
  padding: 'clamp(18px, 3vw, 30px)',
  overflow: 'hidden',
  boxShadow: vars.shadow.md,
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing}`,
})

export const heroGlow = style({
  position: 'absolute',
  right: '-90px',
  top: '-70px',
  width: '240px',
  height: '240px',
  borderRadius: '50%',
  background: `radial-gradient(circle,
    color-mix(in oklab, ${vars.color.brand.warning} 42%, transparent) 0%,
    transparent 72%)`,
  pointerEvents: 'none',
})

export const heroTopRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  marginBottom: vars.space.lg,
  '@media': {
    '(max-width: 720px)': {
      flexDirection: 'column',
    },
  },
})

export const heroEyebrow = style({
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  color: vars.color.text.muted,
})

export const heroTitle = style({
  margin: '6px 0 0',
  fontSize: 'clamp(28px, 4.2vw, 46px)',
  lineHeight: '1.03',
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
  fontWeight: 800,
  fontFamily: vars.font.heading,
})

export const heroSubtitle = style({
  margin: '10px 0 0',
  maxWidth: '48ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.6',
  color: vars.color.text.secondary,
})

export const addButton = style({
  flexShrink: 0,
})

export const heroStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const statCard = style({
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 54%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, transparent)`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: vars.space.xs,
})

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const statValue = style({
  fontSize: 'clamp(24px, 3vw, 34px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
})

export const formCard = style({
  borderRadius: vars.radius.lg,
  borderColor: `color-mix(in oklab, ${vars.color.brand.secondary} 28%, ${vars.color.border.soft})`,
  background: `color-mix(in oklab, ${vars.color.bg.panel} 90%, ${vars.color.brand.secondary} 10%)`,
  animation: `${fadeUp} ${vars.motion.normal} ${vars.motion.easing}`,
})

export const formHeader = style({
  paddingBottom: vars.space.sm,
})

export const formGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: '1fr 1fr auto',
  alignItems: 'end',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
      alignItems: 'stretch',
    },
  },
})

export const fieldGroup = style({
  display: 'grid',
  gap: vars.space.xs,
})

export const fieldLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  color: vars.color.text.secondary,
})

export const selectTrigger = style({
  width: '100%',
})

export const actionsRow = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const loadingText = style({
  margin: 0,
  padding: '64px 0',
  textAlign: 'center',
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
})

export const goalGrid = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  '@media': {
    '(min-width: 760px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

const goalCardBase = style({
  borderRadius: vars.radius.lg,
  transition: `border-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}, transform ${vars.motion.fast} ${vars.motion.easing}`,
  animation: `${fadeUp} ${vars.motion.normal} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: vars.shadow.md,
    },
  },
})

export const goalCardActive = style([goalCardBase, {
  borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  background: `linear-gradient(160deg,
    color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.primary} 8%),
    color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.warning} 4%))`,
}])

export const goalCardPaused = style([goalCardBase, {
  borderColor: vars.color.border.soft,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 85%, transparent)`,
  opacity: 0.68,
}])

export const goalCardContent = style({
  display: 'grid',
  gap: vars.space.md,
})

export const goalCardTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const goalHeadingWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const goalIcon = style({
  width: '32px',
  height: '32px',
  borderRadius: vars.radius.sm,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.brand.primary,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 16%, transparent)`,
  flexShrink: 0,
})

export const goalIconDone = style([goalIcon, {
  color: vars.color.brand.success,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 18%, transparent)`,
}])

export const goalName = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.3',
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const goalMeta = style({
  margin: '3px 0 0',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const goalActionsRow = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
})

export const goalValuesRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: vars.space.md,
})

export const currentValue = style({
  fontSize: 'clamp(26px, 3vw, 34px)',
  lineHeight: '1',
  letterSpacing: '-0.03em',
  fontWeight: 800,
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const targetHint = style({
  marginTop: '5px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const percentBadge = style({
  borderRadius: vars.radius.pill,
  padding: '4px 10px',
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  color: vars.color.text.secondary,
  backgroundColor: `color-mix(in oklab, ${vars.color.border.default} 26%, ${vars.color.bg.panel})`,
})

export const emptyState = style({
  borderRadius: vars.radius.xl,
  border: `1.5px dashed ${vars.color.border.default}`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 78%, transparent),
    color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.warning} 8%))`,
  padding: '56px 20px',
  textAlign: 'center',
  display: 'grid',
  gap: vars.space.sm,
  justifyItems: 'center',
})

export const emptyIcon = style({
  width: '40px',
  height: '40px',
  color: vars.color.text.muted,
})

export const emptyTitle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const emptyText = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
})

export const emptyAction = style({
  marginTop: vars.space.sm,
})
