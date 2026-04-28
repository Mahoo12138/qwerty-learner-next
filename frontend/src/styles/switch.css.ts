import { style } from '@vanilla-extract/css'

import { vars } from './theme.css'

export const switchRoot = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  width: '42px',
  height: '24px',
  padding: '2px',
  flexShrink: 0,
  borderRadius: vars.radius.pill,
  border: `1px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panel,
  cursor: 'pointer',
  outline: 'none',
  transitionProperty: 'background-color, border-color, box-shadow, opacity',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  ':hover': {
    borderColor: vars.color.border.strong,
  },
  selectors: {
    '&[data-checked]': {
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 26%, ${vars.color.bg.panel})`,
      borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 45%, ${vars.color.border.default})`,
    },
    '&[data-focused]': {
      boxShadow: vars.shadow.focusRing,
    },
    '&[data-disabled]': {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
})

export const switchThumb = style({
  display: 'block',
  width: '18px',
  height: '18px',
  borderRadius: vars.radius.pill,
  backgroundColor: vars.color.bg.panelElevated,
  boxShadow: vars.shadow.sm,
  transitionProperty: 'transform, background-color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  selectors: {
    '&[data-unchecked]': {
      transform: 'translateX(0)',
    },
    '&[data-checked]': {
      transform: 'translateX(18px)',
    },
  },
})