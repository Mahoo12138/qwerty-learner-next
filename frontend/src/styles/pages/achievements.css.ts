import { style, keyframes } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

/* ── Progress bar ─────────────────────────────────────────── */

export const progressSection = style({
  marginBottom: vars.space['2xl'],
})

export const progressTrack = style({
  height: '5px',
  borderRadius: vars.radius.pill,
  backgroundColor: `color-mix(in oklab, ${vars.color.border.default} 55%, ${vars.color.bg.app})`,
  overflow: 'hidden',
})

export const progressFill = style({
  height: '100%',
  borderRadius: vars.radius.pill,
  background: `linear-gradient(90deg, ${vars.color.brand.warning}, ${vars.color.brand.primary})`,
  transitionProperty: 'width',
  transitionDuration: vars.motion.slow,
  transitionTimingFunction: vars.motion.easing,
})

/* ── Section wrappers ──────────────────────────────────────── */

export const unlockedSection = style({
  marginBottom: vars.space['2xl'],
})

/* ── Section headers ───────────────────────────────────────── */

export const unlockedSectionTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.lg,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.brand.success,
  '::before': {
    content: '""',
    display: 'block',
    width: '6px',
    height: '6px',
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.brand.success,
    boxShadow: `0 0 0 3px color-mix(in oklab, ${vars.color.brand.success} 22%, transparent)`,
    flexShrink: 0,
  },
})

export const lockedSectionTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.lg,
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
  '::before': {
    content: '""',
    display: 'block',
    width: '6px',
    height: '6px',
    borderRadius: vars.radius.pill,
    backgroundColor: vars.color.border.strong,
    flexShrink: 0,
  },
})

/* ── Cards ─────────────────────────────────────────────────── */

const cardBase = style({
  position: 'relative',
  padding: '20px',
  borderRadius: vars.radius.lg,
  animationName: fadeUp,
  animationDuration: vars.motion.slow,
  animationTimingFunction: vars.motion.easing,
  animationFillMode: 'both',
})

export const unlockedCard = style([cardBase, {
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 28%, transparent)`,
  background: `linear-gradient(145deg,
    color-mix(in oklab, ${vars.color.brand.warning} 9%, ${vars.color.bg.panel}),
    color-mix(in oklab, ${vars.color.brand.primary} 5%, ${vars.color.bg.panel}))`,
  boxShadow: vars.shadow.sm,
  transitionProperty: 'box-shadow, transform',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    boxShadow: vars.shadow.md,
    transform: 'translateY(-2px)',
  },
}])

export const lockedCard = style([cardBase, {
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  opacity: 0.62,
}])

/* ── Card icon row ─────────────────────────────────────────── */

export const iconRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: vars.space.md,
})

export const unlockedIconBox = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 18%, ${vars.color.bg.panel})`,
  color: `color-mix(in oklab, ${vars.color.brand.warning} 88%, ${vars.color.text.primary})`,
  boxShadow: `inset 0 1.5px 0 color-mix(in oklab, ${vars.color.brand.warning} 40%, transparent)`,
  flexShrink: 0,
})

export const lockedIconBox = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.sm,
  backgroundColor: `color-mix(in oklab, ${vars.color.border.default} 30%, ${vars.color.bg.panel})`,
  color: vars.color.text.muted,
  flexShrink: 0,
})

export const lockIcon = style({
  width: '15px',
  height: '15px',
  color: vars.color.text.muted,
  flexShrink: 0,
  marginTop: '2px',
})

export const unlockedIconSvg = style({
  width: '22px',
  height: '22px',
})

export const lockedIconSvg = style({
  width: '19px',
  height: '19px',
})

/* ── Card text ─────────────────────────────────────────────── */

export const unlockedTitle = style({
  marginBottom: vars.space.xs,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  lineHeight: '1.3',
  color: vars.color.text.primary,
})

export const lockedTitle = style({
  marginBottom: vars.space.xs,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  lineHeight: '1.3',
  color: vars.color.text.muted,
})

export const unlockedDesc = style({
  fontSize: vars.fontSize.xs,
  lineHeight: '1.55',
  color: vars.color.text.secondary,
})

export const lockedDesc = style({
  fontSize: vars.fontSize.xs,
  lineHeight: '1.55',
  color: vars.color.text.muted,
})

export const unlockDate = style({
  marginTop: vars.space.sm,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.secondary})`,
})

/* ── Empty state icon ──────────────────────────────────────── */

export const emptyIcon = style({
  display: 'block',
  margin: '0 auto 12px',
  width: '40px',
  height: '40px',
  color: vars.color.text.muted,
})
