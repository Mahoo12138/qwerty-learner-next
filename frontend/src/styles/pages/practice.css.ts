import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

/* ── Entrance animation ────────────────────────────────────── */

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const pulseShake = keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '20%': { transform: 'translateX(-4px)' },
  '40%': { transform: 'translateX(4px)' },
  '60%': { transform: 'translateX(-3px)' },
  '80%': { transform: 'translateX(3px)' },
})

/* ── Page root ─────────────────────────────────────────────── */

export const pageRoot = style({
  maxWidth: '1260px',
  margin: '0 auto',
  padding: 'clamp(18px, 3vw, 40px)',
  display: 'grid',
  gap: 'clamp(20px, 3vw, 34px)',
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing}`,
})

/* ── Page header ───────────────────────────────────────────── */

export const pageHeader = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '32px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.soft})`,
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
      gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
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

export const sectionHeaderRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const pageTitle = style({
  margin: 0,
  display: 'grid',
  gap: '4px',
  fontSize: 'clamp(40px, 7vw, 82px)',
  fontWeight: 900,
  letterSpacing: '-0.06em',
  lineHeight: '0.92',
  color: vars.color.text.primary,
})

export const pageTitleAccent = style({
  fontSize: 'clamp(22px, 4vw, 40px)',
  lineHeight: '1',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 88%, ${vars.color.text.primary})`,
})

export const pageSubtitle = style({
  margin: 0,
  maxWidth: '48ch',
  fontSize: 'clamp(15px, 1.6vw, 18px)',
  lineHeight: '1.75',
  color: vars.color.text.secondary,
})

export const coachNote = style({
  display: 'grid',
  gap: '6px',
  maxWidth: '40ch',
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

export const heroBoard = style({
  display: 'grid',
  gap: vars.space.md,
  alignSelf: 'stretch',
})

export const scorePrimary = style({
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

export const heroMiniMetric = style({
  borderRadius: '22px',
  border: '1px solid transparent',
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '6px',
  boxShadow: vars.shadow.sm,
})

export const heroMiniMetricTone = styleVariants({
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

export const heroMiniTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const heroMiniLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const heroMiniIcon = style({
  color: vars.color.text.secondary,
})

export const heroMiniValue = style({
  fontSize: 'clamp(28px, 3.6vw, 42px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const heroMiniCaption = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

/* ── Status callouts ───────────────────────────────────────── */

export const resumingNotice = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 30%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.primary} 85%, ${vars.color.text.primary})`,
})

export const errorCallout = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 25%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 8%, ${vars.color.bg.panel})`,
  padding: `${vars.space.sm} ${vars.space.md}`,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 85%, ${vars.color.text.primary})`,
})

/* ── Config card ───────────────────────────────────────────── */

export const configCard = style({
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 94%, ${vars.color.brand.warning} 6%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.secondary} 2%))`,
  padding: 'clamp(20px, 2.8vw, 30px)',
  boxShadow: vars.shadow.md,
})

export const lobbyGrid = style({
  display: 'grid',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    '(min-width: 980px)': {
      gridTemplateColumns: 'minmax(0, 1.16fr) minmax(320px, 0.84fr)',
    },
  },
})

export const panelEyebrow = style({
  margin: '0 0 6px',
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const panelSubtitle = style({
  margin: '8px 0 0',
  maxWidth: '44ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const configTitle = style({
  margin: 0,
  fontSize: 'clamp(26px, 3vw, 36px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const configGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: vars.space.md,
  '@media': {
    '(min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
  },
})

export const configLabel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontSize: vars.fontSize.sm,
})

export const configLabelText = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const startRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  marginTop: vars.space.xl,
  flexWrap: 'wrap',
})

/* ── Practice arena ────────────────────────────────────────── */

export const arenaRoot = style({
  display: 'grid',
  gap: 'clamp(18px, 2.6vw, 28px)',
})

export const arenaLayout = style({
  display: 'grid',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: 'minmax(0, 1fr) 320px',
    },
  },
})

export const mainColumn = style({
  display: 'grid',
  gap: vars.space.lg,
})

export const sideColumn = style({
  display: 'grid',
  gap: vars.space.lg,
})

/* ── Progress strip ────────────────────────────────────────── */

export const progressStrip = style({
  borderRadius: '26px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 22%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.secondary} 8%),
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.warning} 5%))`,
  padding: `${vars.space.lg} ${vars.space.xl}`,
  boxShadow: vars.shadow.sm,
})

export const progressMeta = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginBottom: vars.space.md,
  flexWrap: 'wrap',
})

export const progressHeading = style({
  display: 'grid',
  gap: '4px',
})

export const progressValueRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space.xs,
  flexWrap: 'wrap',
})

export const progressValue = style({
  fontSize: 'clamp(34px, 5vw, 52px)',
  lineHeight: '0.92',
  fontWeight: 800,
  letterSpacing: '-0.06em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const progressTotal = style({
  paddingBottom: '6px',
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: vars.color.text.secondary,
})

export const progressPills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const progressEyebrow = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const progressLabel = style({
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const connectionBadge = styleVariants({
  online: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    borderRadius: vars.radius.pill,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.success} 30%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 10%, transparent)`,
    padding: '2px 10px',
    fontSize: vars.fontSize.xs,
    fontWeight: '500',
    color: vars.color.brand.success,
  },
  offline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    borderRadius: vars.radius.pill,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 30%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, transparent)`,
    padding: '2px 10px',
    fontSize: vars.fontSize.xs,
    fontWeight: '500',
    color: vars.color.brand.danger,
  },
})

export const progressTrack = style({
  height: '10px',
  borderRadius: vars.radius.pill,
  backgroundColor: `color-mix(in oklab, ${vars.color.border.default} 55%, ${vars.color.bg.app})`,
  overflow: 'hidden',
})

export const progressFill = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  background: `linear-gradient(90deg, ${vars.color.brand.warning}, ${vars.color.brand.primary})`,
  transitionProperty: 'width',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,
})

export const progressFootRow = style({
  marginTop: vars.space.md,
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const progressFootnote = style({
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.secondary,
})

/* ── Typing stage ──────────────────────────────────────────── */

export const typingStage = style({
  position: 'relative',
  borderRadius: '30px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.warning} 8%),
    color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.secondary} 4%))`,
  padding: 'clamp(24px, 4vw, 46px)',
  overflow: 'hidden',
  boxShadow: vars.shadow.md,
  minHeight: '280px',
  display: 'grid',
  gap: vars.space.lg,
  alignContent: 'start',
})

export const pauseOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 60%, transparent)`,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  borderRadius: 'inherit',
})

export const pauseHint = style({
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.default}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 92%, ${vars.color.brand.warning} 8%)`,
  padding: `${vars.space.sm} ${vars.space.xl}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  boxShadow: vars.shadow.sm,
})

export const stageHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
})

export const stageEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const stageTitle = style({
  margin: '6px 0 0',
  fontSize: 'clamp(24px, 3vw, 34px)',
  lineHeight: '1',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const stageBadgeRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const contextRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.md,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const contextWord = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  maxWidth: '180px',
  overflow: 'hidden',
})

export const contextWordText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  opacity: 0.65,
})

/* ── Word panel ────────────────────────────────────────────── */

export const wordDisplay = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '160px',
})

export const letterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  textAlign: 'center',
})

export const letterRowWrong = style({
  animation: `${pulseShake} 280ms ${vars.motion.easing}`,
})

export const letterBase = style({
  borderRadius: vars.radius.xs,
  padding: '6px 9px',
  fontSize: 'clamp(38px, 6vw, 70px)',
  fontWeight: 800,
  lineHeight: '1',
  letterSpacing: '0.02em',
  transitionProperty: 'background-color, color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
})

export const letterVariants = styleVariants({
  normal: {
    color: vars.color.text.primary,
    backgroundColor: 'transparent',
    opacity: 0.85,
  },
  correct: {
    color: vars.color.brand.success,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 14%, transparent)`,
    opacity: 1,
  },
  wrong: {
    color: vars.color.brand.danger,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 18%, transparent)`,
    opacity: 1,
  },
  hidden: {
    color: vars.color.text.muted,
    backgroundColor: `color-mix(in oklab, ${vars.color.border.default} 30%, transparent)`,
    opacity: 0.55,
  },
})

/* ── Word info (pronunciation/definition) ──────────────────── */

export const wordInfoGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
  marginTop: vars.space.xl,
  '@media': {
    '(max-width: 640px)': { gridTemplateColumns: '1fr' },
  },
})

export const wordActionRow = style({
  marginTop: vars.space.md,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const inlineNotice = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
})

export const infoBlock = style({
  borderRadius: '18px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.secondary} 16%)`,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const infoBlockLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
  marginBottom: '4px',
})

export const infoBlockValue = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '2',
})

/* ── Stats dock ────────────────────────────────────────────── */

export const statsDock = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.md,
  '@media': {
    '(min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(6, 1fr)' },
  },
})

export const statTile = style({
  borderRadius: '20px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 55%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.secondary} 8%),
    color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.warning} 4%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'grid',
  gap: '8px',
  boxShadow: vars.shadow.sm,
})

export const statTileLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const statTileValue = style({
  fontSize: 'clamp(20px, 2.6vw, 32px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const wsError = style({
  gridColumn: '1 / -1',
  fontSize: vars.fontSize.xs,
  color: vars.color.brand.danger,
})

/* ── Quick settings ────────────────────────────────────────── */

export const quickSettingsCard = style({
  borderRadius: '26px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 94%, ${vars.color.brand.secondary} 6%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  padding: 'clamp(18px, 2.2vw, 24px)',
  boxShadow: vars.shadow.sm,
})

export const quickSettingsTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  margin: '0 0 16px',
  fontSize: vars.fontSize.md,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: vars.color.text.secondary,
})

export const toggleGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.sm,
  '@media': {
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
  },
})

export const quickSettingButton = style({
  width: '100%',
  justifyContent: 'space-between',
  borderRadius: vars.radius.pill,
})

export const soundSelectRow = style({
  marginTop: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const soundSelectLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

/* ── Action bar ────────────────────────────────────────────── */

export const actionBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
})

export const actionButtons = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const panelButton = style({
  width: '100%',
  justifyContent: 'flex-start',
  borderRadius: vars.radius.pill,
})

/* ── Result card ───────────────────────────────────────────── */

export const resultCard = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.soft})`,
  background: `linear-gradient(140deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, ${vars.color.brand.warning} 22%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.primary} 14%))`,
  padding: 'clamp(20px, 2.8vw, 32px)',
  boxShadow: vars.shadow.lg,
  animation: `${fadeUp} ${vars.motion.normal} ${vars.motion.easing}`,
})

export const resultTopRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const resultEyebrow = style({
  margin: '0 0 8px',
  fontSize: vars.fontSize.xs,
  fontWeight: 800,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const resultHeading = style({
  margin: 0,
  fontSize: 'clamp(28px, 4vw, 42px)',
  lineHeight: '0.96',
  fontWeight: 800,
  letterSpacing: '-0.05em',
  color: vars.color.text.primary,
})

export const resultSub = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const resultBoard = style({
  marginTop: vars.space.lg,
  display: 'grid',
  gap: vars.space.md,
  '@media': {
    '(min-width: 960px)': {
      gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)',
      alignItems: 'stretch',
    },
  },
})

export const resultPrimary = style({
  position: 'relative',
  overflow: 'hidden',
  minHeight: '220px',
  borderRadius: '26px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.brand.warning} 56%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.primary} 20%, ${vars.color.bg.panelElevated}))`,
  padding: 'clamp(18px, 2.6vw, 28px)',
  display: 'grid',
  alignContent: 'space-between',
  gap: vars.space.md,
})

export const resultValueRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const resultValue = style({
  fontSize: 'clamp(68px, 10vw, 122px)',
  lineHeight: '0.9',
  fontWeight: 800,
  letterSpacing: '-0.08em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const resultValueSuffix = style({
  paddingBottom: '12px',
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.secondary,
})

export const resultCaption = style({
  margin: 0,
  maxWidth: '28ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: `color-mix(in oklab, ${vars.color.text.primary} 82%, ${vars.color.brand.primary})`,
})

export const resultMiniGrid = style({
  display: 'grid',
  gap: vars.space.md,
  alignContent: 'start',
})

export const resultFoot = style({
  marginTop: vars.space.lg,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const resultMessage = style({
  margin: 0,
  maxWidth: '40ch',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.primary,
})

export const resultRecommend = style({
  marginTop: vars.space.lg,
  paddingTop: vars.space.lg,
  borderTop: `1px dashed color-mix(in oklab, ${vars.color.brand.primary} 30%, transparent)`,
  display: 'grid',
  gap: vars.space.md,
  justifyItems: 'start',
})

export const resultRecommendHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const resultWeakKeys = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const resultWeakKeyChip = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  borderRadius: vars.radius.pill,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 35%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 8%, ${vars.color.bg.panel})`,
  padding: `${vars.space.xs} ${vars.space.md}`,
})

export const resultWeakKeyChar = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '800',
  lineHeight: '1',
  color: vars.color.text.primary,
  textTransform: 'uppercase',
  fontFamily: vars.font.mono,
})

export const resultWeakKeyMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const resultGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.sm,
  marginBottom: vars.space.lg,
  '@media': {
    '(min-width: 640px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
  },
})

export const resultStat = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 55%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 70%, transparent)`,
  padding: `${vars.space.sm} ${vars.space.md}`,
})

export const resultStatLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  marginBottom: '4px',
})

export const resultStatValue = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

/* ── Recent sessions ───────────────────────────────────────── */

export const recentCard = style({
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.secondary} 20%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panel} 95%, ${vars.color.brand.secondary} 5%),
    color-mix(in oklab, ${vars.color.bg.panel} 98%, ${vars.color.brand.warning} 2%))`,
  padding: 'clamp(18px, 2.2vw, 24px)',
  boxShadow: vars.shadow.md,
})

export const recentTitle = style({
  margin: 0,
  fontSize: 'clamp(24px, 2.8vw, 32px)',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const sessionList = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const sessionItem = style({
  borderRadius: '22px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 58%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, transparent),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.warning} 14%))`,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  '@media': {
    '(min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  transitionProperty: 'background-color, border-color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    backgroundColor: vars.color.bg.panelElevated,
    borderColor: vars.color.border.default,
  },
})

export const sessionMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: '1 1 auto',
  minWidth: 0,
})

export const sessionName = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 700,
  color: vars.color.text.primary,
})

export const sessionDate = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const sessionWpm = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.secondary,
})

export const sessionActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  flexShrink: 0,
})

export const emptyText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
  padding: `${vars.space.lg} 0`,
})

/* ── Icon sizes ────────────────────────────────────────────── */

export const iconSm = style({ width: '16px', height: '16px' })
export const iconXs = style({ width: '14px', height: '14px' })
