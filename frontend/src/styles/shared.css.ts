/**
 * Shared layout & utility styles used across multiple routes.
 * All token values come from vars (theme.css.ts).
 */
import { style } from '@vanilla-extract/css'
import { vars } from './theme.css'

/* ── Page scaffold ─────────────────────────────────────────── */

export const pageWrapper = style({
  maxWidth: '72rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: vars.space['2xl'],
  '@media': {
    '(max-width: 640px)': { padding: vars.space.xl },
  },
})

export const pageWrapperMd = style({
  maxWidth: '56rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: vars.space['2xl'],
})

export const pageWrapperSm = style({
  maxWidth: '40rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: vars.space['2xl'],
})

/* ── Page header ───────────────────────────────────────────── */

export const pageHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginBottom: vars.space['2xl'],
  flexWrap: 'wrap',
})

export const pageTitle = style({
  fontSize: vars.fontSize['2xl'],
  fontWeight: '600',
  letterSpacing: '-0.02em',
  lineHeight: '1.2',
  color: vars.color.text.primary,
})

export const pageSubtitle = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

/* ── Common grid/flex helpers ──────────────────────────────── */

export const flexRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const flexBetween = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
})

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.lg,
})

export const grid4 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: vars.space.lg,
  '@media': {
    '(min-width: 640px)':  { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
})

export const grid3 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(min-width: 640px)':  { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '(min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
})

/* ── Text helpers ──────────────────────────────────────────── */

export const textPrimary   = style({ color: vars.color.text.primary })
export const textSecondary = style({ color: vars.color.text.secondary })
export const textMuted     = style({ color: vars.color.text.muted })
export const textSmall     = style({ fontSize: vars.fontSize.sm })
export const textXs        = style({ fontSize: vars.fontSize.xs })
export const fontMedium    = style({ fontWeight: '500' })
export const fontSemibold  = style({ fontWeight: '600' })
export const fontMono      = style({ fontFamily: vars.font.mono })

/* ── Inline-level chips / callout boxes ────────────────────── */

export const calloutInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 30%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 10%, ${vars.color.bg.panel})`,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  paddingTop: vars.space.md,
  paddingBottom: vars.space.md,
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 85%, ${vars.color.text.primary})`,
})

export const calloutError = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 25%, transparent)`,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 8%, ${vars.color.bg.panel})`,
  paddingLeft: '14px',
  paddingRight: '14px',
  paddingTop: '10px',
  paddingBottom: '10px',
  fontSize: vars.fontSize.sm,
  color: vars.color.brand.danger,
})

/* ── Row / item panels ─────────────────────────────────────── */

export const itemRow = style({
  display: 'grid',
  gap: vars.space.md,
  gridTemplateColumns: '1fr',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  paddingTop: vars.space.md,
  paddingBottom: vars.space.md,
  transitionProperty: 'background-color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    backgroundColor: vars.color.bg.panelElevated,
  },
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'minmax(0,1fr) 120px 140px 90px',
      alignItems: 'center',
    },
  },
})

export const tilePanel = style({
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  paddingTop: vars.space.md,
  paddingBottom: vars.space.md,
})

/* ── Empty states ──────────────────────────────────────────── */

export const emptyState = style({
  borderRadius: vars.radius.xl,
  border: `1.5px dashed ${vars.color.border.default}`,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 60%, transparent)`,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  paddingTop: '48px',
  paddingBottom: '48px',
  textAlign: 'center',
})

/* ── Loading placeholder ───────────────────────────────────── */

export const loadingText = style({
  paddingTop: '80px',
  paddingBottom: '80px',
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

/* ── Pagination row ────────────────────────────────────────── */

export const paginationRow = style({
  marginTop: vars.space.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: `1px solid ${vars.color.border.soft}`,
  paddingTop: vars.space.lg,
})

/* ── Section heading inside a page ────────────────────────── */

export const sectionTitle = style({
  marginBottom: vars.space.lg,
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const sectionTitleSm = style({
  marginBottom: vars.space.lg,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

/* ── Space helpers ─────────────────────────────────────────── */

export const spaceY1 = style({ display: 'flex', flexDirection: 'column', gap: vars.space.xs })
export const spaceY2 = style({ display: 'flex', flexDirection: 'column', gap: vars.space.sm })
export const spaceY3 = style({ display: 'flex', flexDirection: 'column', gap: vars.space.md })
export const spaceY4 = style({ display: 'flex', flexDirection: 'column', gap: vars.space.lg })
export const spaceY6 = style({ display: 'flex', flexDirection: 'column', gap: vars.space.xl })
export const spaceY8 = style({ display: 'flex', flexDirection: 'column', gap: vars.space['2xl'] })
