import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '../theme.css'

export const pageRoot = style({
  maxWidth: '1280px',
  margin: '0 auto',
  display: 'grid',
  gap: 'clamp(18px, 2vw, 24px)',
  padding: 'clamp(18px, 2.8vw, 34px)',
  // backgroundImage: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.brand.secondary} 10%, ${vars.color.bg.app}) 0%, color-mix(in oklab, ${vars.color.brand.accent} 6%, ${vars.color.bg.app}) 52%, transparent 100%)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  backgroundSize: '100% 220px',
})

export const pageBar = style({
  position: 'sticky',
  top: '10px',
  zIndex: 10,
  display: 'grid',
  gap: 'clamp(10px, 1.4vw, 14px)',
  padding: 'clamp(14px, 2vw, 18px) clamp(16px, 2vw, 20px)',
  borderRadius: '26px',
  border: `1px solid color-mix(in oklab, ${vars.color.border.soft} 80%, transparent)`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 94%, ${vars.color.brand.secondary} 6%) 0%, color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.accent} 4%) 100%)`,
  boxShadow: `0 1px 0 color-mix(in oklab, ${vars.color.text.inverse} 55%, transparent), ${vars.shadow.sm}`,
})

export const pageBarTop = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,

  '@media': {
    'screen and (max-width: 720px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
})

export const pageBarHeading = style({
  display: 'grid',
  gap: '4px',
  minWidth: 0,
})

export const pageBarTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
  fontSize: 'clamp(26px, 3.2vw, 34px)',
  fontWeight: '850',
  letterSpacing: '-0.035em',
  lineHeight: 1,
})

export const pageBarActions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space.xs,
  flexWrap: 'wrap',
})

export const pageBarCreateButton = style({
  minWidth: '120px',
  borderRadius: '16px',
  boxShadow: 'none',
})

export const pageBarTabs = style({
  display: 'flex',
  gap: vars.space.md,
  flexWrap: 'wrap',
  paddingTop: '4px',
  borderTop: `1px solid color-mix(in oklab, ${vars.color.border.soft} 72%, transparent)`,
})

export const pageBarTab = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  minHeight: '36px',
  padding: '0 4px',
  borderRadius: '0',
  border: 'none',
  borderBottom: `3px solid transparent`,
  background: 'transparent',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  fontWeight: '650',
  cursor: 'pointer',
  transition: `color ${vars.motion.normal} ${vars.motion.easing}, border-color ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    color: vars.color.text.primary,
  },
})

export const pageBarTabActive = style([
  pageBarTab,
  {
    borderBottomColor: vars.color.brand.primary,
    color: vars.color.brand.primary,
  },
])

export const workbenchStack = style({
  display: 'grid',
  gap: 'clamp(12px, 1.6vw, 18px)',
})

export const libraryWorkspaceStack = style({
  display: 'grid',
  gap: 'clamp(18px, 2.4vw, 28px)',
})

export const libraryShowcase = style({
  display: 'grid',
  gap: 'clamp(18px, 2.4vw, 24px)',
  padding: 'clamp(18px, 2.4vw, 26px)',
  borderRadius: '30px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 95%, ${vars.color.brand.secondary} 5%) 0%, ${vars.color.bg.panel} 100%)`,
  boxShadow: vars.shadow.sm,
})

export const libraryShowcaseHeader = style({
  display: 'grid',
  gap: vars.space.lg,
})

export const libraryShowcaseIntro = style({
  display: 'grid',
  gap: vars.space.xs,
})

export const libraryShowcaseEyebrow = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const libraryShowcaseTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: 'clamp(24px, 3vw, 32px)',
  fontWeight: '800',
  letterSpacing: '-0.03em',
})

export const libraryShowcaseDescription = style({
  margin: 0,
  maxWidth: '52rem',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
})

export const libraryStagePills = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const libraryStagePill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: '40px',
  padding: '0 14px',
  borderRadius: '16px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panelElevated,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  cursor: 'pointer',
  transition: `all ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.focus,
    color: vars.color.text.primary,
  },
})

export const libraryStagePillActive = style([
  libraryStagePill,
  {
    borderColor: vars.color.brand.primary,
    background: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panelElevated})`,
    color: vars.color.brand.primary,
    boxShadow: vars.shadow.sm,
  },
])

export const libraryStagePillCount = style({
  display: 'inline-grid',
  placeItems: 'center',
  minWidth: '22px',
  height: '22px',
  paddingInline: '6px',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.bg.app} 70%, ${vars.color.bg.panel})`,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
})

globalStyle(`${libraryStagePillActive} ${libraryStagePillCount}`, {
  background: vars.color.brand.primary,
  color: vars.color.text.inverse,
})

export const libraryCatalogGrid = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: 'minmax(230px, 262px)',
  gap: 'clamp(14px, 1.8vw, 18px)',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingTop: '2px',
  paddingBottom: vars.space.sm,
  scrollSnapType: 'x proximity',
  overscrollBehaviorX: 'contain',
  WebkitOverflowScrolling: 'touch',
})

globalStyle(`${libraryCatalogGrid}::-webkit-scrollbar`, {
  height: '10px',
})

globalStyle(`${libraryCatalogGrid}::-webkit-scrollbar-track`, {
  background: 'transparent',
})

globalStyle(`${libraryCatalogGrid}::-webkit-scrollbar-thumb`, {
  borderRadius: '999px',
  background: `color-mix(in oklab, ${vars.color.border.default} 74%, transparent)`,
})

export const libraryCatalogCard = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: '230px',
  minHeight: '172px',
  padding: 'clamp(16px, 2vw, 20px)',
  borderRadius: '24px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panelElevated,
  textAlign: 'left',
  cursor: 'pointer',
  scrollSnapAlign: 'start',
  transition: `border-color ${vars.motion.normal} ${vars.motion.easing}, box-shadow ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.border.focus,
    boxShadow: vars.shadow.md,
  },
})

export const libraryCatalogCardSelected = style([
  libraryCatalogCard,
  {
    borderColor: vars.color.brand.primary,
    background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.brand.primary} 9%, ${vars.color.bg.panelElevated}) 0%, ${vars.color.bg.panelElevated} 100%)`,
    boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${vars.color.brand.primary} 18%, transparent), ${vars.shadow.md}`,
  },
])

export const libraryCatalogCardTop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const libraryCatalogCardIcon = style({
  display: 'grid',
  placeItems: 'center',
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panel})`,
  color: vars.color.brand.primary,
})

globalStyle(`${libraryCatalogCardSelected} ${libraryCatalogCardIcon}`, {
  background: vars.color.brand.primary,
  color: vars.color.text.inverse,
})

export const libraryCatalogCardCount = style({
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
})

export const libraryCatalogCardBody = style({
  display: 'grid',
  gap: vars.space.sm,
  minWidth: 0,
})

export const libraryCatalogCardTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  lineHeight: 1.35,
  overflowWrap: 'anywhere',
})

export const libraryCatalogCardCaption = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.65,
  overflowWrap: 'anywhere',
})

export const libraryCatalogCardBadges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
})

export const libraryCatalogCardDate = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
})

export const libraryCatalogCreateCard = style({
  display: 'grid',
  placeItems: 'center',
  gap: vars.space.xs,
  minHeight: '172px',
  padding: 'clamp(16px, 2vw, 20px)',
  borderRadius: '24px',
  border: `1px dashed ${vars.color.border.default}`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panel} 88%, ${vars.color.brand.secondary} 12%) 0%, transparent 100%)`,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  cursor: 'pointer',
  transition: `all ${vars.motion.normal} ${vars.motion.easing}`,

  ':hover': {
    borderColor: vars.color.brand.primary,
    color: vars.color.brand.primary,
  },
})

export const libraryCatalogCreateHint = style({
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
})

export const libraryCatalogEmpty = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  padding: 'clamp(18px, 2.2vw, 24px)',
  borderRadius: '24px',
  border: `1px dashed ${vars.color.border.default}`,
  background: `color-mix(in oklab, ${vars.color.bg.panel} 90%, ${vars.color.brand.accent} 10%)`,

  '@media': {
    'screen and (max-width: 720px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})

export const libraryCatalogEmptyTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
})

export const libraryCatalogEmptyText = style({
  margin: `${vars.space.xs} 0 0 0`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.7,
})

export const libraryDetailSurface = style({
  display: 'grid',
  gap: 'clamp(18px, 2.4vw, 24px)',
  padding: 'clamp(20px, 2.6vw, 30px)',
  borderRadius: '32px',
  border: `1px solid ${vars.color.border.default}`,
  background: `linear-gradient(180deg, ${vars.color.bg.panelElevated} 0%, color-mix(in oklab, ${vars.color.bg.panel} 94%, ${vars.color.brand.secondary} 6%) 100%)`,
  boxShadow: `inset 0 3px 0 ${vars.color.brand.primary}, ${vars.shadow.md}`,
})

export const libraryDetailHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  alignItems: 'flex-start',
  paddingBottom: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border.soft}`,

  '@media': {
    'screen and (max-width: 860px)': {
      flexDirection: 'column',
    },
  },
})

export const libraryDetailHeading = style({
  display: 'grid',
  gap: vars.space.sm,
  minWidth: 0,
})

export const libraryDetailEyebrow = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

export const libraryDetailTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minWidth: 0,
})

export const libraryDetailTitle = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: 'clamp(26px, 3.2vw, 38px)',
  fontWeight: '900',
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  overflowWrap: 'anywhere',
})

export const libraryTitleEditButton = style({
  borderRadius: '14px',
  color: vars.color.text.secondary,
})

export const libraryDetailMetaLine = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
})

export const libraryDetailDescription = style({
  margin: 0,
  maxWidth: '54rem',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.75,
})

export const libraryDetailHeaderActions = style({
  display: 'grid',
  justifyItems: 'end',
  gap: vars.space.md,

  '@media': {
    'screen and (max-width: 860px)': {
      justifyItems: 'start',
    },
  },
})

export const libraryDetailBadges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
})

export const libraryDetailButtons = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
})

export const libraryTableToolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const libraryTableToolbarActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const libraryFilterControl = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: '38px',
  paddingLeft: vars.space.md,
  paddingRight: vars.space.xs,
  borderRadius: '16px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
})

export const libraryFilterIcon = style({
  color: vars.color.text.muted,
  flexShrink: 0,
})

export const libraryFilterTrigger = style({
  minWidth: '132px',
  border: 'none',
  background: 'transparent',
  boxShadow: 'none',
  paddingLeft: 0,

  ':focus': {
    boxShadow: 'none',
  },
})

export const libraryAddWordButton = style({
  borderRadius: '16px',
})

export const libraryTableCard = style({
  display: 'grid',
  gap: vars.space.md,
  overflow: 'hidden',
  borderRadius: '24px',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panelElevated,
  boxShadow: vars.shadow.sm,
})

export const libraryTableFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: `${vars.space.sm} ${vars.space.lg} ${vars.space.lg}`,
  flexWrap: 'wrap',
})

export const libraryTableSummary = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
})

export const libraryPagination = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
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

export const tableTagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
})

export const tableTagBadge = style({
  fontWeight: '600',
})

export const tableActionIconGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.xs,
})

export const tableActionIconButton = style({
  borderRadius: '12px',
  color: vars.color.text.secondary,

  ':hover': {
    color: vars.color.brand.primary,
  },
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