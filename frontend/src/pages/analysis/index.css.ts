import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const fadeSlideUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
})

export const page = style({
  maxWidth: '1180px',
  margin: '0 auto',
  padding: `${vars.space['2xl']} ${vars.space['2xl']} calc(${vars.space['2xl']} + ${vars.space.lg})`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  '@media': {
    '(max-width: 1024px)': {
      padding: `${vars.space.xl} ${vars.space.lg} calc(${vars.space['2xl']} + ${vars.space.lg})`,
    },
    '(max-width: 640px)': {
      gap: vars.space.lg,
      padding: `${vars.space.lg} ${vars.space.md} calc(${vars.space['2xl']} + ${vars.space.md})`,
    },
  },
})

export const hero = style({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  borderRadius: vars.radius.xl,
  padding: vars.space['2xl'],
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 22%, ${vars.color.border.soft})`,
  background: `linear-gradient(140deg, color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.bg.panelElevated}) 0%, color-mix(in oklab, ${vars.color.brand.secondary} 14%, ${vars.color.bg.panel}) 48%, color-mix(in oklab, ${vars.color.brand.accent} 12%, ${vars.color.bg.panel}) 100%)`,
  boxShadow: vars.shadow.md,
  '::before': {
    content: '',
    position: 'absolute',
    top: '-16%',
    right: '-4%',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: `radial-gradient(circle, color-mix(in oklab, ${vars.color.brand.accent} 36%, transparent) 0%, transparent 72%)`,
    opacity: 0.95,
    pointerEvents: 'none',
  },
  '::after': {
    content: '',
    position: 'absolute',
    bottom: '-34%',
    left: '-8%',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: `radial-gradient(circle, color-mix(in oklab, ${vars.color.brand.secondary} 30%, transparent) 0%, transparent 72%)`,
    opacity: 0.92,
    pointerEvents: 'none',
  },
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.xl,
    },
  },
})

export const heroBody = style({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.45fr) minmax(280px, 0.9fr)',
  gap: vars.space.xl,
  alignItems: 'start',
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const heroText = style({
  maxWidth: '620px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const eyebrow = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: `6px ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, transparent)`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.border.soft})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
})

export const title = style({
  margin: 0,
  fontFamily: vars.font.heading,
  fontSize: 'clamp(32px, 5vw, 48px)',
  lineHeight: 1,
  letterSpacing: '-0.045em',
  color: vars.color.text.primary,
})

export const subtitle = style({
  margin: 0,
  maxWidth: '58ch',
  fontSize: vars.fontSize.md,
  lineHeight: 1.65,
  color: vars.color.text.secondary,
})

export const heroHighlights = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const heroHighlight = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  minHeight: '108px',
  padding: vars.space.lg,
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, transparent), color-mix(in oklab, ${vars.color.bg.panel} 94%, transparent))`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
})

export const heroHighlightLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const heroHighlightValue = style({
  fontSize: vars.fontSize.xl,
  fontWeight: '700',
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const heroHighlightHint = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: 1.45,
})

export const controlDeck = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
})

export const controlBlock = style({
  minWidth: '220px',
  flex: '1 1 260px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const controlLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  color: vars.color.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const segmented = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  padding: '4px',
  borderRadius: vars.radius.pill,
  border: `1px solid color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, ${vars.color.border.soft})`,
  background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, transparent)`,
})

export const segmentButton = style({
  flex: '1 1 0',
  minWidth: '74px',
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
})

export const segmentButtonActive = style({
  boxShadow: vars.shadow.sm,
})

export const metricsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: vars.space.md,
})

export const metricCard = style({
  animation: `${fadeSlideUp} ${vars.motion.slow} ${vars.motion.easing} both`,
})

export const metricCardFeatured = style({
  borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.default})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panelElevated}) 0%, ${vars.color.bg.panel} 100%)`,
})

export const metricCardContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const metricTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const metricCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  minWidth: 0,
})

export const metricValue = style({
  fontSize: 'clamp(24px, 3vw, 30px)',
  fontWeight: '700',
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const metricLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.secondary,
})

export const metricHint = style({
  fontSize: vars.fontSize.sm,
  lineHeight: 1.5,
  color: vars.color.text.muted,
})

export const metricIcon = style({
  width: '18px',
  height: '18px',
  flexShrink: 0,
  color: vars.color.brand.primary,
})

export const metricIconWrap = style({
  width: '38px',
  height: '38px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.md,
  background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panel})`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
})

export const analyticsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.42fr) minmax(300px, 0.88fr)',
  gap: vars.space.xl,
  alignItems: 'start',
  '@media': {
    '(max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const secondaryStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
})

export const panelCard = style({
  borderColor: `color-mix(in oklab, ${vars.color.border.default} 72%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, ${vars.color.bg.panel}) 0%, ${vars.color.bg.panel} 100%)`,
})

export const panelHeader = style({
  gap: vars.space.md,
})

export const panelHeaderRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  '@media': {
    '(max-width: 520px)': {
      flexDirection: 'column',
    },
  },
})

export const panelBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: `6px ${vars.space.md}`,
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panel})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  whiteSpace: 'nowrap',
})

export const chartContent = style({
  paddingTop: vars.space.md,
})

export const calendarContent = style({
  paddingTop: vars.space.md,
})

export const chartCanvasLarge = style({
  height: '340px',
  '@media': {
    '(max-width: 640px)': {
      height: '280px',
    },
  },
})

export const chartCanvasSmall = style({
  height: '250px',
  '@media': {
    '(max-width: 640px)': {
      height: '220px',
    },
  },
})

export const panelState = style({
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.xl,
  textAlign: 'center',
  borderRadius: vars.radius.lg,
  border: `1px dashed ${vars.color.border.default}`,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 6%, ${vars.color.bg.panel})`,
})

export const panelStateTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  color: vars.color.text.secondary,
})

export const panelStateDescription = style({
  maxWidth: '34ch',
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
  color: vars.color.text.muted,
})

export const focusList = style({
  display: 'flex',
  flexDirection: 'column',
})

export const focusItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: vars.space.md,
  padding: `${vars.space.md} 0`,
  selectors: {
    '&:not(:first-child)': {
      borderTop: `1px solid ${vars.color.border.soft}`,
    },
  },
})

export const focusCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  minWidth: 0,
})

export const focusLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.secondary,
})

export const focusMeta = style({
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
  color: vars.color.text.muted,
})

export const focusValue = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  lineHeight: 1,
  letterSpacing: '-0.02em',
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

export const tone = styleVariants({
  positive: {
    color: vars.color.brand.success,
  },
  neutral: {
    color: vars.color.text.secondary,
  },
  negative: {
    color: vars.color.brand.danger,
  },
})

export const focusNote = style({
  marginTop: vars.space.lg,
  padding: vars.space.lg,
  borderRadius: vars.radius.lg,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 8%, ${vars.color.bg.panel})`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.border.soft})`,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
})

export const heatmapContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const heatmapShell = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, ${vars.color.bg.panel}) 0%, ${vars.color.bg.panel} 100%)`,
  padding: vars.space.xl,
  '@media': {
    '(max-width: 640px)': {
      padding: vars.space.lg,
    },
  },
})