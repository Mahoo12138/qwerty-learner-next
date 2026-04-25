import { style } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const avatarRoot = style({
  position: 'relative',
  display: 'flex',
  width: '36px',
  height: '36px',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: vars.radius.pill,
})

export const avatarImage = style({
  aspectRatio: '1 / 1',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const avatarFallback = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.pill,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 15%, ${vars.color.bg.panel})`,
  color: vars.color.brand.primary,
  fontSize: vars.fontSize.sm,
  fontWeight: '600',
})
