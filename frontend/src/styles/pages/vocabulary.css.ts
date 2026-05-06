import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const floatIn = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const pageRoot = style({
  maxWidth: '1180px',
  margin: '0 auto',
  padding: 'clamp(18px, 2.8vw, 36px)',
  display: 'grid',
  gap: vars.space.xl,
  animation: `${floatIn} ${vars.motion.slow} ${vars.motion.easing}`,
})

export const hero = style({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: vars.radius.xl,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 22%, ${vars.color.border.soft})`,
  background: `linear-gradient(140deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, ${vars.color.brand.warning} 22%),
    color-mix(in oklab, ${vars.color.bg.panelElevated} 84%, ${vars.color.brand.secondary} 16%))`,
  padding: 'clamp(22px, 3vw, 34px)',
  boxShadow: vars.shadow.md,
})

export const heroGlow = style({
  position: 'absolute',
  inset: 'auto -120px -120px auto',
  width: '280px',
  height: '280px',
  borderRadius: '50%',
  background: `radial-gradient(circle, color-mix(in oklab, ${vars.color.brand.primary} 28%, transparent), transparent 68%)`,
  pointerEvents: 'none',
})

export const heroTopRow = style({
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  alignItems: 'flex-start',
})

export const heroEyebrow = style({
  margin: '0 0 8px',
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: vars.color.text.muted,
})

export const heroTitle = style({
  margin: 0,
  fontSize: 'clamp(28px, 4vw, 40px)',
  lineHeight: '1.02',
  letterSpacing: '-0.04em',
  color: vars.color.text.primary,
})

export const heroSubtitle = style({
  margin: '10px 0 0',
  maxWidth: '620px',
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
  color: vars.color.text.secondary,
})

export const heroHint = style({
  display: 'grid',
  gap: vars.space.sm,
  minWidth: '220px',
})

export const heroHintCard = style({
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 55%, transparent)`,
  backgroundColor: 'color-mix(in oklab, white 52%, transparent)',
  padding: `${vars.space.md} ${vars.space.lg}`,
})

export const heroHintLabel = style({
  display: 'block',
  marginBottom: '4px',
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.text.muted,
})

export const heroHintValue = style({
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const statsGrid = style({
  position: 'relative',
  marginTop: vars.space.xl,
  display: 'grid',
  gap: vars.space.md,
  '@media': {
    '(min-width: 720px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
})

export const statCard = style({
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 52%, transparent)`,
  backgroundColor: 'color-mix(in oklab, white 60%, transparent)',
  padding: `${vars.space.lg} ${vars.space.xl}`,
  display: 'grid',
  gap: '6px',
})

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.text.muted,
})

export const statValue = style({
  fontSize: 'clamp(24px, 3vw, 34px)',
  fontWeight: '700',
  lineHeight: '1',
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

export const statCaption = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const controlsCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(16px, 2vw, 24px)',
  boxShadow: vars.shadow.sm,
  display: 'grid',
  gap: vars.space.md,
})

export const controlsTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: vars.space.md,
  alignItems: 'center',
  flexWrap: 'wrap',
})

export const controlsTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const controlsHint = style({
  margin: '4px 0 0',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const filterRow = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
})

export const searchRow = style({
  display: 'grid',
  gap: vars.space.sm,
  '@media': {
    '(min-width: 720px)': {
      gridTemplateColumns: 'minmax(220px, 320px) auto',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
})

export const searchInput = style({
  width: '100%',
})

export const searchMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
})

export const tableCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  padding: 'clamp(16px, 2vw, 24px)',
  boxShadow: vars.shadow.sm,
  display: 'grid',
  gap: vars.space.md,
})

export const tableHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const tableTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const tableSub = style({
  margin: '4px 0 0',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const wordCell = style({
  display: 'grid',
  gap: '4px',
})

export const wordValue = style({
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const wordMeta = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const numericCell = style({
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.text.primary,
})

export const emptyState = style({
  borderRadius: vars.radius.lg,
  border: `1px dashed ${vars.color.border.default}`,
  padding: `${vars.space['2xl']} ${vars.space.xl}`,
  textAlign: 'center',
  color: vars.color.text.secondary,
  backgroundColor: `color-mix(in oklab, ${vars.color.bg.panelElevated} 72%, transparent)`,
})

export const emptyTitle = style({
  margin: '0 0 6px',
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const emptyText = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
})

export const paginationRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.md,
  flexWrap: 'wrap',
})

export const paginationInfo = style({
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
})

export const paginationButtons = style({
  display: 'flex',
  gap: vars.space.sm,
})

export const loadingText = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.fontSize.sm,
})