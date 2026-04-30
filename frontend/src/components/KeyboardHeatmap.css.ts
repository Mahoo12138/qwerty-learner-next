import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

export const root = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'visible',
})

export const canvas = style({
  position: 'relative',
  width: '100%',
  overflow: 'visible',
})

export const svg = style({
  display: 'block',
  width: '100%',
  height: 'auto',
})

export const keyGroup = style({
  cursor: 'pointer',
  outline: 'none',
})

export const keyRect = style({
  transition: `fill ${vars.motion.normal} ${vars.motion.easing}, stroke ${vars.motion.fast} ${vars.motion.easing}, filter ${vars.motion.fast} ${vars.motion.easing}`,
})

globalStyle(`${keyGroup}:hover ${keyRect}`, {
  filter: 'drop-shadow(0 6px 12px rgb(0 0 0 / 0.08))',
})

globalStyle(`${keyGroup}:focus-visible ${keyRect}`, {
  stroke: vars.color.border.focus,
  strokeWidth: '1.5px',
  filter: 'drop-shadow(0 8px 16px rgb(0 0 0 / 0.12))',
})

export const tooltip = style({
  position: 'absolute',
  zIndex: 2,
  width: '168px',
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.accent} 6%) 0%, ${vars.color.bg.panel} 100%)`,
  boxShadow: vars.shadow.md,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  pointerEvents: 'none',
})

export const tooltipTop = style({
  transform: 'translateY(calc(-100% - 16px))',
})

export const tooltipBottom = style({
  transform: 'translateY(16px)',
})

export const tooltipArrow = style({
  position: 'absolute',
  width: '12px',
  height: '12px',
  transform: 'translateX(-50%) rotate(45deg)',
})

export const tooltipArrowTop = style({
  bottom: '-7px',
  background: vars.color.bg.panel,
  borderRight: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  borderBottom: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
})

export const tooltipArrowBottom = style({
  top: '-7px',
  background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.accent} 6%)`,
  borderLeft: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  borderTop: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
})

export const tooltipHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  marginBottom: vars.space.sm,
})

export const tooltipTitle = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  color: vars.color.text.muted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
})

export const tooltipKey = style({
  minWidth: '28px',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${vars.space.sm}`,
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.primary} 24%, ${vars.color.border.soft})`,
  background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const tooltipStats = style({
  display: 'grid',
  gap: vars.space.xs,
})

export const tooltipStat = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space.md,
})

export const tooltipLabel = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const tooltipValue = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
  color: vars.color.text.secondary,
  fontVariantNumeric: 'tabular-nums',
})

export const legend = style({
  marginTop: vars.space.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  fontSize: vars.fontSize.xs,
  color: vars.color.text.muted,
})

export const legendText = style({
  whiteSpace: 'nowrap',
  color: vars.color.text.secondary,
  fontWeight: '600',
})

export const legendScale = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  padding: '3px',
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.soft}`,
  background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 78%, ${vars.color.bg.panel})`,
})

export const legendSwatch = style({
  width: '24px',
  height: '10px',
  flexShrink: 0,
  border: `1px solid color-mix(in oklab, ${vars.color.border.soft} 72%, transparent)`,
})
