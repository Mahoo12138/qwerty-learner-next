import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

export const page = style({
  maxWidth: '900px',
  margin: '0 auto',
  padding: vars.space['2xl'],
  '@media': {
    '(max-width: 768px)': {
      padding: vars.space.lg,
    },
  },
})

export const header = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginBottom: vars.space['2xl'],
  flexWrap: 'wrap',
})

export const headerText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const title = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: '700',
  letterSpacing: '-0.02em',
  lineHeight: '1.2',
  color: vars.color.text.primary,
  fontFamily: vars.font.heading,
})

export const subtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

/* ── Review banner ─────────────────────────────────────────── */

export const reviewBanner = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.xl,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 28%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 8%, ${vars.color.bg.panel})`,
})

export const bannerIcon = style({
  width: '15px',
  height: '15px',
  flexShrink: 0,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
})

export const bannerText = style({
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 72%, ${vars.color.text.primary})`,
})

/* ── States ────────────────────────────────────────────────── */

export const loadingState = style({
  padding: `${vars.space['2xl']} 0`,
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

/* ── Table ─────────────────────────────────────────────────── */

export const tableWrapper = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  overflow: 'hidden',
  backgroundColor: vars.color.bg.panelElevated,
  boxShadow: vars.shadow.sm,
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: vars.fontSize.sm,
})

export const th = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  fontWeight: '500',
  color: vars.color.text.muted,
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.04em',
  borderBottom: `1px solid ${vars.color.border.soft}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.app} 55%, ${vars.color.bg.panel})`,
  whiteSpace: 'nowrap',
})

export const tr = style({
  borderBottom: `1px solid color-mix(in oklab, ${vars.color.border.soft} 65%, transparent)`,
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: `color-mix(in oklab, ${vars.color.bg.surfaceTintA} 35%, transparent)`,
    },
  },
})

export const tdContent = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  fontFamily: vars.font.mono,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
  fontWeight: '500',
  maxWidth: '260px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const td = style({
  padding: `${vars.space.sm} ${vars.space.lg}`,
  color: vars.color.text.secondary,
  whiteSpace: 'nowrap',
})

/* ── Review time ───────────────────────────────────────────── */

export const reviewTimeDue = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontWeight: '500',
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
})

export const reviewTimeUpcoming = style({
  color: vars.color.text.muted,
})

export const clockIcon = style({
  width: '13px',
  height: '13px',
})

/* ── Difficulty badges ─────────────────────────────────────── */

const diffBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `2px 8px`,
  borderRadius: vars.radius.xs,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
})

export const diffEasy = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 13%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.success} 88%, ${vars.color.text.primary})`,
}])

export const diffMedium = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 12%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
}])

export const diffHard = style([diffBase, {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 12%, ${vars.color.bg.panelElevated})`,
  color: `color-mix(in oklab, ${vars.color.brand.danger} 82%, ${vars.color.text.primary})`,
}])

/* ── Pagination ────────────────────────────────────────────── */

export const pagination = style({
  marginTop: vars.space.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${vars.color.border.soft}`,
  paddingTop: vars.space.lg,
  gap: vars.space.md,
})

export const paginationInfo = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const paginationButtons = style({
  display: 'flex',
  gap: vars.space.sm,
})

/* ── Icon helpers ──────────────────────────────────────────── */

export const buttonIcon = style({
  width: '15px',
  height: '15px',
})

/* ── Empty state ───────────────────────────────────────────── */

export const emptyStateWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: `${vars.space['2xl']} ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  border: `1px dashed color-mix(in oklab, ${vars.color.border.default} 70%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.app} 40%, transparent)`,
})

export const emptyIcon = style({
  width: '44px',
  height: '44px',
  color: vars.color.text.muted,
  marginBottom: vars.space.xs,
  opacity: 0.45,
})

export const emptyTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '500',
  color: vars.color.text.secondary,
})

export const emptyDesc = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
  textAlign: 'center',
})
