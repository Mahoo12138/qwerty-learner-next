import { style, globalStyle } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

/* ── Outer shell ───────────────────────────────────────────── */

export const loggedOutShell = style({
  minHeight: '100vh',
  backgroundColor: 'transparent',
})

export const loggedInShell = style({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: 'transparent',
})

/* ── Mobile top bar ────────────────────────────────────────── */

export const mobileHeader = style({
  position: 'fixed',
  insetInline: 0,
  top: 0,
  zIndex: 40,
  display: 'flex',
  height: '56px',
  alignItems: 'center',
  gap: vars.space.sm,
  borderBottom: `1px solid color-mix(in oklab, ${vars.color.border.soft} 70%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 70%, transparent)`,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  '@media': {
    '(min-width: 768px)': { display: 'none' },
  },
})

export const mobileHeaderLogo = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: vars.color.text.primary,
})

/* ── Desktop sidebars ──────────────────────────────────────── */

const sidebarBase = {
  height: '100vh',
  overflowY: 'auto' as const,
  borderRight: `1px solid color-mix(in oklab, ${vars.color.border.soft} 70%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 70%, transparent)`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  display: 'none' as const,
  flexDirection: 'column' as const,
  flexShrink: 0,
  transitionProperty: 'width',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,
}

export const sidebar = style({
  ...sidebarBase,
  '@media': {
    '(min-width: 768px)': { display: 'flex', width: '272px' },
  },
})

export const sidebarCollapsed = style({
  ...sidebarBase,
  '@media': {
    '(min-width: 768px)': { display: 'flex', width: '80px' },
  },
})

/* ── Practice ghost sidebar (hover reveal) ─────────────────── */

export const practiceSidebarWrapper = style({
  display: 'none',
  '@media': {
    '(min-width: 768px)': { display: 'block' },
  },
})

export const practiceHitArea = style({
  position: 'fixed',
  insetBlock: 0,
  left: 0,
  zIndex: 30,
  width: '20px',
})

export const practiceSidebar = style({
  pointerEvents: 'none',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 40,
  display: 'none',
  height: '100vh',
  width: '272px',
  overflowY: 'auto',
  transform: 'translateX(-24px)',
  borderRight: `1px solid color-mix(in oklab, ${vars.color.border.soft} 70%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 70%, transparent)`,
  opacity: 0,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  transitionProperty: 'transform, opacity',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,
  '@media': {
    '(min-width: 768px)': { display: 'flex', flexDirection: 'column' },
  },
})

/* Can't use :hover on a parent selector in VE easily; use globalStyle */
globalStyle(`.practice-sidebar-group:hover ${practiceSidebar}, .practice-sidebar-group:focus-within ${practiceSidebar}`, {
  pointerEvents: 'auto',
  transform: 'translateX(0)',
  opacity: 1,
})

/* ── Sidebar internals ─────────────────────────────────────── */

export const sidebarLogoRow = style({
  display: 'flex',
  height: '64px',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.md,
  flexShrink: 0,
})

export const sidebarLogoText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: vars.color.text.primary,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

export const sidebarNav = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: vars.space.md,
})

export const sidebarFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.md,
})

export const userCard = style({
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 12%, ${vars.color.bg.panel})`,
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
})

export const userCardCentered = style({
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 12%, ${vars.color.bg.panel})`,
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
})

export const userName = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.primary,
})

export const userEmail = style({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const navActionsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.sm,
})

export const navActionsColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

/* ── Nav link button ───────────────────────────────────────── */

export const navLinkBase = style({
  display: 'flex',
  alignItems: 'center',
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  height: '36px',
  width: '100%',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  color: vars.color.text.secondary,
  transitionProperty: 'background-color, color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panel})`,
    color: vars.color.text.primary,
  },
})

export const navLinkExpanded = style([navLinkBase, {
  justifyContent: 'flex-start',
  gap: '10px',
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
}])

export const navLinkCollapsed = style([navLinkBase, {
  justifyContent: 'center',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.sm,
}])

export const navLinkActive = style({
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panel})`,
  color: vars.color.brand.primary,
})

/* ── Main content area ─────────────────────────────────────── */

export const mainContent = style({
  flex: 1,
  overflowY: 'auto',
  height: '100vh',
  paddingTop: '56px',
  '@media': {
    '(min-width: 768px)': { paddingTop: 0 },
  },
})

export const mainContentGuest = style({
  minHeight: '100vh',
})
