import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

/* ── Entrance animation ────────────────────────────────────── */

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

/* ── Page Root — two-column on desktop ─────────────────────── */

export const pageRoot = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: 'clamp(16px, 3vw, 32px)',
  gap: vars.space.lg,
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing} both`,
  '@media': {
    '(min-width: 800px)': {
      gridTemplateColumns: '216px 1fr',
      gap: vars.space['2xl'],
      alignItems: 'start',
    },
  },
})

/* ── Sidebar ────────────────────────────────────────────────── */

export const sidebar = style({
  display: 'flex',
  flexDirection: 'row',
  gap: vars.space.xs,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '@media': {
    '(min-width: 800px)': {
      flexDirection: 'column',
      overflowX: 'visible',
      position: 'sticky',
      top: vars.space.xl,
      gap: vars.space.xs,
    },
  },
})

/* ── Sidebar brand heading (desktop only) ───────────────────── */

export const sidebarBrand = style({
  display: 'none',
  '@media': {
    '(min-width: 800px)': {
      display: 'block',
      paddingLeft: vars.space.md,
      paddingBottom: vars.space.md,
      marginBottom: vars.space.xs,
      borderBottom: `1px solid ${vars.color.border.soft}`,
    },
  },
})

export const sidebarBrandTitle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  color: vars.color.text.primary,
  letterSpacing: '-0.02em',
})

export const sidebarBrandSub = style({
  margin: 0,
  marginTop: '2px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.4',
})

/* ── Nav item base ──────────────────────────────────────────── */

export const navItem = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: vars.space.sm,
  flexShrink: 0,
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  border: '1.5px solid transparent',
  cursor: 'pointer',
  background: 'none',
  fontFamily: vars.font.body,
  textAlign: 'left',
  transition: [
    `background-color ${vars.motion.fast} ${vars.motion.easing}`,
    `border-color ${vars.motion.fast} ${vars.motion.easing}`,
    `color ${vars.motion.fast} ${vars.motion.easing}`,
  ].join(', '),
  '@media': {
    '(min-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      padding: `${vars.space.md} ${vars.space.md}`,
    },
  },
})

/* ── Nav item variants ──────────────────────────────────────── */

export const navItemState = styleVariants({
  active: {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 32%, transparent)`,
    color: vars.color.text.primary,
    boxShadow: vars.shadow.sm,
  },
  inactive: {
    color: vars.color.text.secondary,
    selectors: {
      '&:hover': {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 6%, ${vars.color.bg.panelElevated})`,
        borderColor: vars.color.border.soft,
        color: vars.color.text.primary,
      },
    },
  },
})

/* ── Nav item inner parts ───────────────────────────────────── */

export const navItemTopRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
})

export const navIcon = style({
  flexShrink: 0,
  width: '16px',
  height: '16px',
  selectors: {
    [`${navItemState.active} &`]: {
      color: vars.color.brand.primary,
    },
  },
})

export const navLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  lineHeight: '1.2',
  whiteSpace: 'nowrap',
})

export const navDesc = style({
  marginTop: '3px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.3',
  '@media': {
    '(max-width: 799px)': {
      display: 'none',
    },
  },
})

export const navAdminBadge = style({
  marginLeft: 'auto',
  fontSize: '9px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '1px 6px',
  borderRadius: vars.radius.pill,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 38%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 12%, ${vars.color.bg.panel})`,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
  flexShrink: 0,
})

/* ── Content area ───────────────────────────────────────────── */

export const contentArea = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  minWidth: 0,
})

export const overviewSection = style({
  borderRadius: vars.radius.xl,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  background: `linear-gradient(135deg, color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panelElevated}) 0%, color-mix(in oklab, ${vars.color.brand.secondary} 12%, ${vars.color.bg.panelElevated}) 56%, ${vars.color.bg.panelElevated} 100%)`,
  padding: vars.space.xl,
  boxShadow: vars.shadow.md,
})

export const overviewHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  flexWrap: 'wrap',
  marginBottom: vars.space.lg,
})

export const overviewKicker = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: vars.color.brand.primary,
})

export const overviewTitle = style({
  margin: 0,
  marginTop: vars.space.xs,
  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
  lineHeight: '1.05',
  letterSpacing: '-0.04em',
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const overviewLead = style({
  margin: 0,
  marginTop: vars.space.sm,
  maxWidth: '44rem',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const overviewBadgeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const overviewStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

export const overviewStat = style({
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 14%, ${vars.color.border.soft})`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.accent} 16%)`,
  padding: vars.space.lg,
})

export const overviewStatLabel = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.4',
})

export const overviewStatValue = style({
  margin: 0,
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: vars.color.text.primary,
})

/* ── Breadcrumb line ────────────────────────────────────────── */

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

/* ── Section panel ──────────────────────────────────────────── */

export const section = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  padding: vars.space.xl,
  boxShadow: vars.shadow.sm,
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: vars.space.md,
  marginBottom: vars.space.lg,
})

export const sectionTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const sectionTitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const sectionIcon = style({
  color: vars.color.brand.primary,
  flexShrink: 0,
  width: '16px',
  height: '16px',
})

/* ── Feedback banners ───────────────────────────────────────── */

export const feedback = styleVariants({
  success: {
    borderRadius: vars.radius.sm,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.success} 28%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 10%, ${vars.color.bg.panel})`,
    padding: `${vars.space.sm} ${vars.space.md}`,
    fontSize: vars.fontSize.sm,
    color: vars.color.brand.success,
    lineHeight: '1.5',
    marginBottom: vars.space.lg,
  },
  error: {
    borderRadius: vars.radius.sm,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 28%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panel})`,
    padding: `${vars.space.sm} ${vars.space.md}`,
    fontSize: vars.fontSize.sm,
    color: vars.color.brand.danger,
    lineHeight: '1.5',
    marginBottom: vars.space.md,
  },
})

/* ── Setting field card ─────────────────────────────────────── */

export const fieldCard = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.md,
})

export const fieldHeadRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginBottom: vars.space.sm,
})

export const fieldLabel = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
  lineHeight: '1.4',
})

export const fieldDesc = style({
  margin: 0,
  marginTop: '2px',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.5',
})

export const fieldLockedBadge = style({
  fontSize: '10px',
  fontWeight: '500',
  padding: '1px 7px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panel,
  color: vars.color.text.muted,
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const fieldStatus = style({
  fontSize: '10px',
  fontWeight: '500',
  lineHeight: '1.4',
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const fieldStatusTone = styleVariants({
  muted: {
    color: vars.color.text.muted,
  },
  success: {
    color: vars.color.brand.success,
  },
  error: {
    color: vars.color.brand.danger,
  },
})

export const checkbox = style({
  width: '15px',
  height: '15px',
  borderRadius: vars.radius.xs,
  accentColor: vars.color.brand.primary,
  cursor: 'pointer',
  flexShrink: 0,
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: '0.5',
    },
  },
})

export const checkboxLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  cursor: 'pointer',
})

export const settingControlRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const settingControlStatus = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.5',
})

export const switchControl = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const switchControlText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: '1.4',
  whiteSpace: 'nowrap',
})

/* ── Stack helpers ──────────────────────────────────────────── */

export const stack = styleVariants({
  xs: { display: 'flex', flexDirection: 'column', gap: vars.space.xs },
  sm: { display: 'flex', flexDirection: 'column', gap: vars.space.sm },
  md: { display: 'flex', flexDirection: 'column', gap: vars.space.md },
  lg: { display: 'flex', flexDirection: 'column', gap: vars.space.lg },
  xl: { display: 'flex', flexDirection: 'column', gap: vars.space.xl },
})

export const row = styleVariants({
  sm: { display: 'flex', alignItems: 'center', gap: vars.space.sm, flexWrap: 'wrap' },
  md: { display: 'flex', alignItems: 'center', gap: vars.space.md, flexWrap: 'wrap' },
  lg: { display: 'flex', alignItems: 'center', gap: vars.space.lg, flexWrap: 'wrap' },
  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space.md,
    flexWrap: 'wrap',
  },
})

/* ── Profile section ────────────────────────────────────────── */

export const profileRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space['2xl'],
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

export const profileLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xl,
  flexWrap: 'wrap',
})

export const infoGrid = style({
  display: 'flex',
  gap: vars.space.xl,
  flexWrap: 'wrap',
})

export const infoItem = style({
  minWidth: '120px',
})

export const infoItemWide = style({
  minWidth: '200px',
})

export const infoLabel = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  lineHeight: '1.4',
})

export const infoValue = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
  lineHeight: '1.5',
})

export const avatarLarge = style({
  width: '56px',
  height: '56px',
})

export const avatarXl = style({
  width: '64px',
  height: '64px',
})

export const avatarFallbackLarge = style({
  fontSize: vars.fontSize.md,
})

export const avatarFallbackXl = style({
  fontSize: vars.fontSize.lg,
})

/* ── API token list ─────────────────────────────────────────── */

export const tokenEmptyState = style({
  borderRadius: vars.radius.md,
  border: `1.5px dashed ${vars.color.border.default}`,
  padding: `${vars.space['2xl']} ${vars.space.xl}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
})

export const tokenEmptyIcon = style({
  opacity: 0.2,
  width: '32px',
  height: '32px',
})

export const tokenList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const tokenCardBase = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.md,
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.md,
  transition: `opacity ${vars.motion.fast} ${vars.motion.easing}`,
  '@media': {
    '(min-width: 560px)': {
      alignItems: 'center',
    },
  },
})

export const tokenCardState = styleVariants({
  active: {
    backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 92%, ${vars.color.brand.primary} 8%)`,
  },
  inactive: {
    backgroundColor: vars.color.bg.panel,
    opacity: '0.65',
  },
})

export const tokenBody = style({
  flex: 1,
  minWidth: 0,
})

export const tokenNameRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: '4px',
  flexWrap: 'wrap',
})

export const tokenName = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const tokenScopeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexWrap: 'wrap',
})

export const tokenPrefix = style({
  appearance: 'none',
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  backgroundColor: vars.color.bg.panel,
  border: `1px solid ${vars.color.border.soft}`,
  color: vars.color.text.secondary,
  padding: '2px 7px',
  borderRadius: vars.radius.xs,
  cursor: 'pointer',
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.bg.app,
    },
  },
})

export const tokenMetaCol = style({
  display: 'grid',
  gap: '4px',
  flexShrink: 0,
  '@media': {
    '(min-width: 560px)': {
      width: '224px',
    },
  },
})

export const tokenMetaRow = style({
  display: 'grid',
  gridTemplateColumns: '64px minmax(0, 1fr)',
  alignItems: 'center',
  columnGap: vars.space.sm,
})

export const tokenMetaLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '11px',
  color: vars.color.text.muted,
  whiteSpace: 'nowrap',
})

export const tokenMetaValue = style({
  minWidth: 0,
  fontSize: '11px',
  color: vars.color.text.secondary,
  textAlign: 'right',
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
})

export const tokenActions = style({
  marginLeft: 'auto',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  '@media': {
    '(max-width: 559px)': {
      marginTop: vars.space.sm,
    },
  },
})

/* ── Token status badges ────────────────────────────────────── */

export const tokenStatusBadge = styleVariants({
  ok: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '500',
    padding: '1px 7px',
    borderRadius: vars.radius.pill,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.success} 28%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 10%, ${vars.color.bg.panel})`,
    color: vars.color.brand.success,
    whiteSpace: 'nowrap',
  },
  expired: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '500',
    padding: '1px 7px',
    borderRadius: vars.radius.pill,
    border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 28%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panel})`,
    color: vars.color.brand.danger,
    whiteSpace: 'nowrap',
  },
  disabled: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '500',
    padding: '1px 7px',
    borderRadius: vars.radius.pill,
    border: `1px solid ${vars.color.border.default}`,
    backgroundColor: vars.color.bg.panel,
    color: vars.color.text.muted,
    whiteSpace: 'nowrap',
  },
})

/* ── Dialog helpers ─────────────────────────────────────────── */

export const dialogForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  marginTop: vars.space.md,
})

export const dialogFormField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const dialogFormLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.secondary,
})

export const dialogSuccessTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  color: vars.color.brand.success,
})

export const tokenResultBox = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.app,
  padding: vars.space.lg,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.primary,
  wordBreak: 'break-all',
  lineHeight: '1.7',
  margin: `${vars.space.md} 0`,
})

export const scopeGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.md,
  maxHeight: '220px',
  overflowY: 'auto',
  backgroundColor: vars.color.bg.panel,
  '@media': {
    '(min-width: 480px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const scopeItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.sm,
})

export const scopeItemText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const scopeItemLabel = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.secondary,
  lineHeight: '1.3',
  cursor: 'pointer',
})

export const scopeItemDesc = style({
  fontSize: '10px',
  color: vars.color.text.muted,
  lineHeight: '1.4',
})

/* ── User control table ─────────────────────────────────────── */

export const controlRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.md,
  '@media': {
    '(min-width: 480px)': {
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'center',
    },
  },
})

export const controlKey = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontFamily: vars.font.mono,
  color: vars.color.text.muted,
})

export const controlLabel = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
})

export const controlToggleLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

/* ── System setting input row ───────────────────────────────── */

export const systemFieldRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const systemInput = style({
  flex: 1,
  minWidth: '200px',
})

/* ── Save footer ────────────────────────────────────────────── */

export const saveFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.border.soft}`,
  marginTop: vars.space.md,
})

/* ── Sound section ──────────────────────────────────────────── */

export const soundSection = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  padding: vars.space.md,
})

export const soundSectionHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginBottom: vars.space.md,
})

export const uploadRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
  marginTop: vars.space.sm,
})

export const uploadHint = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

/* ── Spin animation (for Loader2 icons) ─────────────────────── */

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const spinner = style({
  animation: `${spin} 1s linear infinite`,
  flexShrink: 0,
})

/* ── Icon-only ghost button (dropdown trigger) ──────────────── */

export const iconGhostButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  padding: 0,
  borderRadius: vars.radius.sm,
  border: '1.5px solid transparent',
  background: 'none',
  cursor: 'pointer',
  color: vars.color.text.muted,
  transition: `color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}`,
  ':hover': {
    color: vars.color.text.primary,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.app})`,
  },
  ':focus-visible': {
    outline: 'none',
    boxShadow: vars.shadow.focusRing,
  },
  selectors: {
    '&:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
})

/* ── Sub-heading for preference groups within a section ─────── */

export const preferenceGroupTitle = style({
  margin: 0,
  marginBottom: vars.space.md,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.secondary,
  letterSpacing: '-0.01em',
})

/* ── Centered loading wrapper ───────────────────────────────── */

export const loadingWrapper = style({
  paddingTop: vars.space['2xl'],
  paddingBottom: vars.space['2xl'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: vars.color.text.muted,
})
