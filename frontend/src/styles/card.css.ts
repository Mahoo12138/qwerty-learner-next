import { style } from '@vanilla-extract/css'

import { vars } from './theme.css'

export const card = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panel,
  color: vars.color.text.primary,
  boxShadow: vars.shadow.sm,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  transitionProperty: 'box-shadow, border-color',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,
})

export const cardElevated = style([card, {
  boxShadow: vars.shadow.md,
  borderColor: vars.color.border.default,
}])

export const cardHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.xl,
  paddingBottom: '0',
})

export const cardTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  lineHeight: '1.2',
  letterSpacing: '-0.015em',
  color: vars.color.text.primary,
})

export const cardDescription = style({
  fontSize: vars.fontSize.sm,
  lineHeight: '1.5',
  color: vars.color.text.muted,
})

export const cardContent = style({
  padding: vars.space.xl,
  paddingTop: vars.space.lg,
})

export const cardFooter = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.xl,
  paddingTop: '0',
})
