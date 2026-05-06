import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '../theme.css'

export const pageRoot = style({
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'grid',
  gap: 'clamp(14px, 1.8vw, 20px)',
  padding: 'clamp(16px, 2.4vw, 32px)',
})

export const pageBar = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  marginTop: 'calc(-1 * clamp(16px, 2.4vw, 32px))',
  marginInline: 'calc(-1 * clamp(16px, 2.4vw, 32px))',
  paddingTop: 'clamp(12px, 1.6vw, 20px)',
  paddingBottom: 'clamp(12px, 1.6vw, 18px)',
  paddingInline: 'clamp(16px, 2.4vw, 32px)',
  borderBottom: `2px solid color-mix(in oklab, ${vars.color.brand.primary} 28%, ${vars.color.border.default})`,
  background: `color-mix(in oklab, ${vars.color.bg.app} 88%, transparent)`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  flexWrap: 'wrap',
})

export const pageBarTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
  fontSize: 'clamp(32px, 4vw, 46px)',
  fontWeight: '900',
  letterSpacing: '-0.04em',
  lineHeight: 1,
})

export const pageBarTabs = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
})

export const pageBarTab = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  minHeight: '38px',
  padding: '0 16px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.default}`,
  background: 'transparent',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  cursor: 'pointer',
  transition: `all ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    color: vars.color.text.primary,
    borderColor: vars.color.border.focus,
    background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, ${vars.color.brand.secondary} 20%)`,
  },
})

export const pageBarTabActive = style([
  pageBarTab,
  {
    background: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, color-mix(in oklab, ${vars.color.brand.secondary} 74%, ${vars.color.brand.primary} 26%) 100%)`,
    borderColor: 'transparent',
    color: vars.color.text.inverse,
    boxShadow: vars.shadow.sm,
  },
])

export const workbenchStack = style({
  display: 'grid',
  gap: 'clamp(12px, 1.6vw, 18px)',
})

export const workspaceGrid = style({
  display: 'grid',
  gap: 'clamp(16px, 2vw, 24px)',
  gridTemplateColumns: 'minmax(280px, 340px) minmax(0, 1.35fr)',
  alignItems: 'start',

  '@media': {
    'screen and (max-width: 1080px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const listPane = style({
  display: 'grid',
  gap: vars.space.lg,
  padding: 'clamp(18px, 2.4vw, 24px)',
  borderRadius: '28px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.secondary} 12%) 0%, ${vars.color.bg.panel} 100%)`,
  boxShadow: `inset 0 3px 0 color-mix(in oklab, ${vars.color.brand.secondary} 70%, transparent), ${vars.shadow.sm}`,

  '@media': {
    'screen and (min-width: 1081px)': {
      position: 'sticky',
      top: '20px',
      maxHeight: 'calc(100vh - 40px)',
      overflow: 'auto',
    },
  },
})

export const detailPane = style({
  display: 'grid',
  gap: vars.space.lg,
  minHeight: '540px',
  padding: 'clamp(18px, 2.8vw, 30px)',
  borderRadius: '32px',
  border: `1px solid ${vars.color.border.default}`,
  background: `linear-gradient(180deg, ${vars.color.bg.panelElevated} 0%, color-mix(in oklab, ${vars.color.bg.panel} 92%, ${vars.color.brand.accent} 8%) 100%)`,
  boxShadow: `inset 0 3px 0 ${vars.color.brand.primary}, ${vars.shadow.md}`,
})

export const columnHeader = style({
  display: 'grid',
  gap: vars.space.md,
})

export const columnEyebrow = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const columnTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: 'clamp(22px, 2.6vw, 28px)',
  fontWeight: '800',
  letterSpacing: '-0.025em',
})

export const columnDescription = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
})

export const stageRail = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const stageCard = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  height: '44px',
  paddingLeft: '12px',
  paddingRight: '14px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.soft}`,
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  transition: `border-color ${vars.motion.normal} ${vars.motion.easing}, background-color ${vars.motion.normal} ${vars.motion.easing}, box-shadow ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.focus,
    background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 80%, ${vars.color.brand.secondary} 20%)`,
  },
})

export const stageCardActive = style({
  background: `linear-gradient(135deg, color-mix(in oklab, ${vars.color.brand.primary} 32%, ${vars.color.bg.panelElevated}) 0%, color-mix(in oklab, ${vars.color.brand.secondary} 26%, ${vars.color.bg.panel}) 100%)`,
  borderColor: vars.color.brand.primary,
  boxShadow: vars.shadow.md,
})

export const stageCardIconWrap = style({
  display: 'grid',
  placeItems: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '8px',
  background: `color-mix(in oklab, ${vars.color.brand.accent} 22%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.primary,
  flexShrink: 0,
  transition: `background ${vars.motion.normal} ${vars.motion.easing}, color ${vars.motion.fast} ${vars.motion.easing}`,
})

globalStyle(`${stageCardActive} ${stageCardIconWrap}`, {
  background: vars.color.brand.primary,
  color: vars.color.text.inverse,
})

export const stageCardBody = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const stageCardTopline = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const stageCardLabel = style({
  color: vars.color.text.primary,
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})

export const libraryStack = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const libraryCard = style({
  display: 'grid',
  gap: vars.space.sm,
  width: '100%',
  padding: vars.space.lg,
  borderRadius: '22px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panelElevated,
  textAlign: 'left',
  cursor: 'pointer',
  transition: `transform ${vars.motion.normal} ${vars.motion.easing}, border-color ${vars.motion.normal} ${vars.motion.easing}, box-shadow ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    transform: 'translateY(-1px)',
    borderColor: vars.color.border.focus,
    boxShadow: vars.shadow.sm,
  },
})

export const libraryCardSelected = style({
  borderColor: vars.color.brand.primary,
  background: `linear-gradient(135deg, color-mix(in oklab, ${vars.color.brand.primary} 14%, ${vars.color.bg.panelElevated}) 0%, color-mix(in oklab, ${vars.color.brand.secondary} 16%, ${vars.color.bg.panelElevated}) 100%)`,
  boxShadow: `inset 3px 0 0 ${vars.color.brand.primary}, ${vars.shadow.sm}`,
})

export const libraryCardTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',
  minWidth: 0,
})

export const libraryCardTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  lineHeight: 1.3,
  overflowWrap: 'anywhere',
})

export const libraryCardCaption = style({
  margin: `${vars.space.xs} 0 0 0`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.5,
})

export const libraryCardMeta = style({
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})

export const libraryCardBadges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
})

export const emptyCard = style({
  padding: '22px 18px',
  borderRadius: '22px',
  border: `1px dashed ${vars.color.border.default}`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
  background: `color-mix(in oklab, ${vars.color.bg.panel} 90%, ${vars.color.brand.accent} 10%)`,
})

export const detailHero = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  alignItems: 'flex-start',
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border.soft}`,

  '@media': {
    'screen and (max-width: 760px)': {
      flexDirection: 'column',
    },
  },
})

export const detailHeroText = style({
  display: 'grid',
  gap: vars.space.sm,
  minWidth: 0,
})

export const detailEyebrow = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const detailTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: 'clamp(26px, 3.5vw, 42px)',
  fontWeight: '900',
  lineHeight: 1.0,
  letterSpacing: '-0.04em',
  overflowWrap: 'anywhere',
})

export const detailDescription = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
  maxWidth: '52rem',
})

export const detailMetaRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const detailActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  justifyContent: 'flex-end',
})

export const detailBody = style({
  display: 'grid',
  gap: vars.space.lg,
})

export const emptyDetail = style({
  display: 'grid',
  placeItems: 'center',
  gap: vars.space.sm,
  minHeight: '320px',
  padding: vars.space['2xl'],
  borderRadius: '28px',
  border: `1px dashed ${vars.color.border.default}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panel} 90%, ${vars.color.brand.secondary} 10%) 0%, transparent 100%)`,
  textAlign: 'center',
})

export const emptyDetailTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
})

export const emptyDetailText = style({
  margin: 0,
  maxWidth: '34rem',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
})

export const permissionBanner = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
  alignItems: 'center',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: '18px',
  background: `color-mix(in oklab, ${vars.color.brand.warning} 10%, ${vars.color.bg.panelElevated})`,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 20%, ${vars.color.border.soft})`,
})

export const permissionText = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
})

export const unavailableCard = style({
  display: 'grid',
  gap: vars.space.md,
  padding: 'clamp(18px, 2.4vw, 24px)',
  borderRadius: '24px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 30%, ${vars.color.border.default})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.brand.warning} 12%, ${vars.color.bg.panelElevated}) 0%, ${vars.color.bg.panel} 100%)`,
})

export const unavailableTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
})

export const unavailableText = style({
  margin: `${vars.space.sm} 0 0 0`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
})

export const unavailableActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const sectionCard = style({
  display: 'grid',
  gap: vars.space.lg,
  boxShadow: `inset 3px 0 0 ${vars.color.brand.accent}, ${vars.shadow.sm}`,
  padding: 'clamp(16px, 2.2vw, 22px)',
  borderRadius: '22px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.secondary} 16%) 0%, transparent 100%)`,
})

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',

  '@media': {
    'screen and (max-width: 680px)': {
      flexDirection: 'column',
    },
  },
})

export const sectionTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
})

export const sectionDescription = style({
  margin: `${vars.space.xs} 0 0 0`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
})

export const sectionBody = style({
  display: 'grid',
  gap: vars.space.md,
})

export const dialogStack = style({
  display: 'grid',
  gap: vars.space.md,
})

export const formGrid = style({
  display: 'grid',
  gap: vars.space.md,
})

export const formGridTwo = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',

  '@media': {
    'screen and (max-width: 760px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const formGridThree = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',

  '@media': {
    'screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
  alignItems: 'center',
})

export const toolbarGrow = style({
  flex: '1 1 240px',
})

export const searchField = style({
  position: 'relative',
  minWidth: '220px',
})

export const searchFieldIcon = style({
  position: 'absolute',
  top: '50%',
  left: vars.space.md,
  transform: 'translateY(-50%)',
  color: vars.color.text.muted,
  pointerEvents: 'none',
})

export const searchInput = style({
  paddingLeft: '40px',
})

export const switchRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 10%, ${vars.color.bg.panel})`,
})

export const switchText = style({
  display: 'grid',
  gap: vars.space.xs,
})

export const switchTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
})

export const switchDescription = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
})

export const textarea = style({
  minHeight: '132px',
  width: '100%',
  resize: 'vertical',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.bg.panel,
  color: vars.color.text.primary,
  padding: vars.space.lg,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.65,
  outline: 'none',
  transition: `border-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}`,

  ':focus': {
    borderColor: vars.color.border.focus,
    boxShadow: vars.shadow.focusRing,
  },
})

export const compactTextarea = style([textarea, { minHeight: '96px' }])

globalStyle(`${textarea}::placeholder, ${compactTextarea}::placeholder`, {
  color: vars.color.text.muted,
})

export const fileInputLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: '36px',
  padding: '0 14px',
  borderRadius: vars.radius.pill,
  border: `1px dashed ${vars.color.border.default}`,
  color: vars.color.text.secondary,
  cursor: 'pointer',
  transition: `all ${vars.motion.fast} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.focus,
    color: vars.color.brand.primary,
  },
})

export const hiddenFileInput = style({
  display: 'none',
})

export const tableWrapper = style({
  overflowX: 'auto',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
  boxShadow: vars.shadow.sm,
})

export const dataTable = style({
  width: '100%',
  minWidth: '720px',
  borderCollapse: 'collapse',
  textAlign: 'left',
})

export const tableHeadCell = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border.soft}`,
  background: `color-mix(in oklab, ${vars.color.bg.app} 50%, ${vars.color.bg.panel})`,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
})

export const tableRow = style({
  borderBottom: `1px solid color-mix(in oklab, ${vars.color.border.soft} 70%, transparent)`,
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing}`,

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      background: `color-mix(in oklab, ${vars.color.brand.secondary} 8%, ${vars.color.bg.panelElevated})`,
    },
  },
})

export const tableCell = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  verticalAlign: 'top',
})

export const tableCellStack = style({
  display: 'grid',
  gap: vars.space.xs,
  minWidth: 0,
})

export const tablePrimaryText = style({
  color: vars.color.text.primary,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  lineHeight: 1.5,
  overflowWrap: 'anywhere',
})

export const tableSecondaryText = style({
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.6,
  overflowWrap: 'anywhere',
})

export const tableActionGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
})

export const rowList = style({
  display: 'grid',
  gap: vars.space.md,
})

export const rowCard = style({
  display: 'grid',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: '20px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
})

export const rowCardReadOnly = style({
  background: `color-mix(in oklab, ${vars.color.bg.panel} 84%, ${vars.color.brand.accent} 16%)`,
})

export const rowHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'flex-start',
})

export const rowTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
})

export const rowText = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
})

export const rowMeta = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const rowActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const helperText = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  lineHeight: 1.6,
})

export const metricsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const articleSentenceList = style({
  display: 'grid',
  gap: vars.space.md,
})

export const articleSentenceCard = style({
  display: 'grid',
  gap: vars.space.sm,
  padding: vars.space.lg,
  borderRadius: '20px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panel} 88%, ${vars.color.brand.secondary} 12%) 0%, ${vars.color.bg.panelElevated} 100%)`,
})

export const progressList = style({
  display: 'grid',
  gap: vars.space.sm,
})

export const progressRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'center',
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  background: `color-mix(in oklab, ${vars.color.brand.accent} 12%, ${vars.color.bg.panel})`,

  '@media': {
    'screen and (max-width: 640px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})