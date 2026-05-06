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
  maxWidth: '1100px',
  margin: '0 auto',
  padding: 'clamp(16px, 2.4vw, 32px)',
  display: 'grid',
  gap: vars.space.xl,
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing}`,
})

/* ── Page header ───────────────────────────────────────────── */

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const sectionHeaderRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const pageTitle = style({
  margin: 0,
  fontSize: 'clamp(22px, 3vw, 28px)',
  fontWeight: '700',
  letterSpacing: '-0.025em',
  lineHeight: '1.15',
  color: vars.color.text.primary,
})

export const pageSubtitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
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
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(18px, 2.4vw, 28px)',
  boxShadow: vars.shadow.sm,
})

export const lobbyGrid = style({
  display: 'grid',
  gap: vars.space.lg,
  alignItems: 'start',
  '@media': {
    '(min-width: 980px)': {
      gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)',
    },
  },
})

export const configTitle = style({
  margin: '0 0 18px',
  fontSize: vars.fontSize.lg,
  fontWeight: '600',
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
  marginTop: vars.space.lg,
  flexWrap: 'wrap',
})

/* ── Practice arena ────────────────────────────────────────── */

export const arenaRoot = style({
  display: 'grid',
  gap: vars.space.lg,
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
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const progressMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.sm,
})

export const progressLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
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
  height: '6px',
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

/* ── Typing stage ──────────────────────────────────────────── */

export const typingStage = style({
  position: 'relative',
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(24px, 4vw, 48px)',
  overflow: 'hidden',
  boxShadow: vars.shadow.md,
  minHeight: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
  backgroundColor: vars.color.bg.panelElevated,
  padding: `${vars.space.sm} ${vars.space.xl}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  boxShadow: vars.shadow.sm,
})

export const contextRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.lg,
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
  minHeight: '120px',
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
  padding: '4px 7px',
  fontSize: 'clamp(32px, 5vw, 52px)',
  fontWeight: '600',
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
  color: vars.color.text.secondary,
})

export const infoBlock = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, transparent)`,
  padding: `${vars.space.sm} ${vars.space.md}`,
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
  gap: vars.space.sm,
  '@media': {
    '(min-width: 640px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(6, 1fr)' },
  },
})

export const statTile = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: `${vars.space.sm} ${vars.space.md}`,
  display: 'grid',
  gap: '5px',
})

export const statTileLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const statTileValue = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
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
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(16px, 2vw, 24px)',
  boxShadow: vars.shadow.sm,
})

export const quickSettingsTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  margin: '0 0 16px',
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
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
})

/* ── Result card ───────────────────────────────────────────── */

export const resultCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.soft})`,
  background: `linear-gradient(140deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.warning} 16%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.primary} 14%))`,
  padding: 'clamp(20px, 2.8vw, 32px)',
  boxShadow: vars.shadow.md,
  animation: `${fadeUp} ${vars.motion.normal} ${vars.motion.easing}`,
})

export const resultHeading = style({
  margin: '0 0 4px',
  fontSize: vars.fontSize.xl,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const resultSub = style({
  margin: '0 0 20px',
  fontSize: vars.fontSize.sm,
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
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(16px, 2vw, 24px)',
  boxShadow: vars.shadow.sm,
})

export const recentTitle = style({
  margin: '0 0 16px',
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const sessionList = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const sessionItem = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 70%, transparent)`,
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
  fontWeight: '500',
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
