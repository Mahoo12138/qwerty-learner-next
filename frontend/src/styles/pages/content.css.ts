import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

/* ── Entrance animation ────────────────────────────────────── */

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

/* ── Page scaffold ─────────────────────────────────────────── */

export const pageRoot = style({
  maxWidth: '1160px',
  margin: '0 auto',
  padding: 'clamp(16px, 2.4vw, 32px)',
  display: 'grid',
  gap: vars.space.xl,
  animation: `${fadeUp} ${vars.motion.slow} ${vars.motion.easing}`,
})

/* ── Page hero / header ────────────────────────────────────── */

export const pageHero = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  flexWrap: 'wrap',
})

export const pageTitleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
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

export const pageIconWrap = style({
  width: '44px',
  height: '44px',
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 30%, ${vars.color.border.soft})`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.brand.primary,
  flexShrink: 0,
})

/* ── Tab rail ──────────────────────────────────────────────── */

export const tabRail = style({
  display: 'inline-flex',
  gap: vars.space.xs,
  padding: '5px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 75%, ${vars.color.bg.app})`,
})

export const tabBtn = style({
  padding: '7px 18px',
  borderRadius: vars.radius.md,
  border: '1.5px solid transparent',
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  cursor: 'pointer',
  color: vars.color.text.muted,
  backgroundColor: 'transparent',
  transition: `all ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    color: vars.color.text.primary,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, transparent)`,
  },
})

export const tabBtnActive = style([tabBtn, {
  color: vars.color.text.primary,
  backgroundColor: vars.color.bg.panelElevated,
  borderColor: vars.color.border.default,
  boxShadow: vars.shadow.sm,
}])

/* ── Two-column panel layout ───────────────────────────────── */

export const panelGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.space.xl,

  '@media': {
    '(min-width: 900px)': {
      gridTemplateColumns: '300px 1fr',
    },
  },
})

/* ── Sidebar (bank list) ───────────────────────────────────── */

export const sidebarCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  boxShadow: vars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const sidebarHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const sidebarTitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
  letterSpacing: '-0.01em',
})

export const sidebarBody = style({
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  flex: 1,
  overflowY: 'auto',
})

export const bankListEmpty = style({
  padding: `${vars.space.lg} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.app} 60%, transparent)`,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  textAlign: 'center',
  lineHeight: '1.5',
})

export const bankBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  width: '100%',
  padding: '8px 12px',
  borderRadius: vars.radius.md,
  border: '1.5px solid transparent',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  transition: `all ${vars.motion.fast} ${vars.motion.easing}`,
  color: vars.color.text.secondary,

  ':hover': {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panelElevated})`,
    color: vars.color.text.primary,
  },
})

export const bankBtnActive = style([bankBtn, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 28%, transparent)`,
  color: vars.color.brand.primary,
}])

export const bankBtnName = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
})

export const bankBtnCount = style({
  fontSize: vars.fontSize.xs,
  opacity: 0.65,
  flexShrink: 0,
})

export const sidebarDivider = style({
  margin: `${vars.space.sm} 0`,
  height: '1px',
  backgroundColor: vars.color.border.soft,
})

export const sidebarCreateForm = style({
  padding: `${vars.space.md} ${vars.space.lg} ${vars.space.lg}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  borderTop: `1px solid ${vars.color.border.soft}`,
})

/* ── Main content card ─────────────────────────────────────── */

export const mainCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  boxShadow: vars.shadow.sm,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const mainCardHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const mainCardTitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
  letterSpacing: '-0.01em',
})

export const mainCardActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const mainCardBody = style({
  padding: vars.space.xl,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

/* ── Meta / edit-bank bar ──────────────────────────────────── */

export const editBankBar = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr auto auto',
  gap: vars.space.sm,
  alignItems: 'center',

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

/* ── Filter bar ────────────────────────────────────────────── */

export const filterBar = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: vars.space.sm,
  alignItems: 'center',

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const searchWrap = style({
  position: 'relative',
})

export const searchIcon = style({
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: vars.color.text.muted,
  width: '15px',
  height: '15px',
})

export const searchInput = style({
  paddingLeft: '36px',
})

/* ── Add-item row ──────────────────────────────────────────── */

export const addWordRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 120px auto',
  gap: vars.space.sm,
  alignItems: 'center',

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const addSentenceRows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const addSentenceTop = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const addSentenceBottom = style({
  display: 'grid',
  gridTemplateColumns: '1fr 120px auto',
  gap: vars.space.sm,
  alignItems: 'center',

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

/* ── Item list ─────────────────────────────────────────────── */

export const itemList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const wordRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 2fr auto',
  alignItems: 'center',
  gap: vars.space.md,
  padding: '8px 12px',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  transition: `border-color ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.default,
  },

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const wordRowTerm = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  overflow: 'hidden',
})

export const wordTermIcon = style({
  flexShrink: 0,
  color: vars.color.brand.primary,
  opacity: 0.7,
  width: '15px',
  height: '15px',
})

export const wordTermText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
})

export const wordDefText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const rowActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
})

/* ── Sentence row ──────────────────────────────────────────── */

export const sentenceCard = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  transition: `border-color ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.default,
  },
})

export const sentenceCardTop = style({
  display: 'flex',
  gap: vars.space.sm,
  alignItems: 'flex-start',
})

export const sentenceIcon = style({
  marginTop: '10px',
  flexShrink: 0,
  color: vars.color.brand.secondary,
  width: '15px',
  height: '15px',
})

export const sentenceInputGroup = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const sentenceCardBottom = style({
  display: 'grid',
  gridTemplateColumns: '1fr 100px auto auto',
  gap: vars.space.sm,
  alignItems: 'center',
  paddingLeft: '23px',

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

/* ── Empty state ───────────────────────────────────────────── */

export const emptyState = style({
  borderRadius: vars.radius.lg,
  border: `1.5px dashed ${vars.color.border.soft}`,
  padding: `${vars.space['2xl']} ${vars.space.xl}`,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const emptyStateIcon = style({
  width: '40px',
  height: '40px',
  opacity: 0.18,
  color: vars.color.text.muted,
})

export const emptyStateText = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
  lineHeight: '1.5',
})

/* ── No bank selected placeholder ─────────────────────────── */

export const noBankPlaceholder = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  flexDirection: 'column',
  gap: vars.space.md,
  color: vars.color.text.muted,
})

export const noBankPlaceholderIcon = style({
  width: '48px',
  height: '48px',
  opacity: 0.15,
})

/* ── Pagination ────────────────────────────────────────────── */

export const paginationRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: vars.space.lg,
  borderTop: `1px solid ${vars.color.border.soft}`,
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const paginationLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const paginationBtns = style({
  display: 'flex',
  gap: vars.space.sm,
})

/* ── Import file label button ──────────────────────────────── */

export const fileLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: '7px 14px',
  borderRadius: vars.radius.md,
  border: `1.5px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panelElevated,
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: `all ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.focus,
    color: vars.color.brand.primary,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panelElevated})`,
  },
})

/* ── Article panel ─────────────────────────────────────────── */

export const breadcrumb = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
  flexWrap: 'wrap',
})

export const breadcrumbLink = style({
  cursor: 'pointer',
  transition: `color ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    color: vars.color.text.primary,
  },
})

export const breadcrumbActive = style({
  fontWeight: '500',
  color: vars.color.text.primary,
})

export const breadcrumbSep = style({
  width: '14px',
  height: '14px',
  flexShrink: 0,
  opacity: 0.4,
})

export const articleCardBtn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '3px',
  width: '100%',
  padding: '10px 12px',
  borderRadius: vars.radius.md,
  border: '1.5px solid transparent',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  transition: `all ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panelElevated})`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 20%, transparent)`,
  },
})

export const articleCardBtnTitle = style({
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
})

export const articleCardBtnMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

/* ── Article detail ────────────────────────────────────────── */

export const articleDetailStack = style({
  display: 'grid',
  gap: vars.space.xl,
})

export const articleInfoCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  boxShadow: vars.shadow.sm,
  overflow: 'hidden',
})

export const articleInfoHeader = style({
  padding: `${vars.space.xl} ${vars.space.xl} 0`,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const articleInfoMeta = style({
  padding: `${vars.space.lg} ${vars.space.xl} ${vars.space.xl}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const articleMetaRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const progressSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const progressLabel = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: vars.fontSize.sm,
})

export const progressLabelLeft = style({
  color: vars.color.text.muted,
})

export const progressLabelRight = style({
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const paragraphCard = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  overflow: 'hidden',
})

export const paragraphHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 50%, ${vars.color.bg.panelElevated})`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const paragraphText = style({
  padding: vars.space.md,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.primary,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.accent} 5%, ${vars.color.bg.panelElevated})`,
  margin: 0,
})

export const sentenceEditWrap = style({
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const articleSentenceRow = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: `${vars.space.sm} ${vars.space.md}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const articleSentenceContent = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const articleSentenceEditRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: vars.space.sm,
  alignItems: 'center',
})

/* ── All-progress section ──────────────────────────────────── */

export const allProgressCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  boxShadow: vars.shadow.sm,
  overflow: 'hidden',
})

export const allProgressHeader = style({
  padding: `${vars.space.lg} ${vars.space.xl}`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 60%, ${vars.color.bg.panel})`,
})

export const allProgressBody = style({
  padding: vars.space.xl,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
})

export const progressItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

/* ── Article create form ─────────────────────────────────────*/

export const createFormStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const createFormGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.sm,

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const createFormTextarea = style({
  width: '100%',
  borderRadius: vars.radius.md,
  border: `1.5px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panelElevated,
  padding: vars.space.md,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
  fontFamily: vars.font.body,
  resize: 'vertical',
  outline: 'none',
  lineHeight: '1.6',
  transition: `border-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}`,
  boxSizing: 'border-box',

  '::placeholder': {
    color: vars.color.text.muted,
  },

  ':focus': {
    borderColor: vars.color.border.focus,
    boxShadow: vars.shadow.focusRing,
  },
})

export const createFormFooter = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  justifyContent: 'flex-end',
})

/* ── Destructive action button tint ───────────────────────── */

export const dangerBtn = style({
  color: vars.color.brand.danger,

  ':hover': {
    color: vars.color.brand.danger,
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.app})`,
  },
})

/* ── Article settings form ─────────────────────────────────── */

export const bankSettingsForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const bankSettingsTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.primary,
  marginBottom: vars.space.xs,
})

export const bankSettingsActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

/* ── SentenceBank save/delete buttons in header ─────────────── */
export const bankActionVariants = styleVariants({
  normal: {},
  danger: {
    color: vars.color.brand.danger,
    ':hover': {
      color: vars.color.brand.danger,
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.app})`,
    },
  },
})
