import { style } from '@vanilla-extract/css'

import { vars } from './theme.css'

export const input = style({
  display: 'flex',
  height: '40px',
  width: '100%',
  borderRadius: vars.radius.md,
  border: `1.5px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panelElevated,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
  outline: 'none',
  transitionProperty: 'border-color, box-shadow, background-color',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,

  '::placeholder': {
    color: vars.color.text.muted,
  },

  ':hover': {
    borderColor: vars.color.border.strong,
  },

  ':focus': {
    borderColor: vars.color.border.focus,
    boxShadow: vars.shadow.focusRing,
  },

  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: '0.5',
      backgroundColor: `color-mix(in oklab, ${vars.color.bg.panel} 80%, ${vars.color.border.soft})`,
    },
    '&[type="file"]': {
      paddingTop: '8px',
      cursor: 'pointer',
    },
    '&[type="file"]::file-selector-button': {
      border: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: vars.fontSize.sm,
      fontWeight: '500',
      color: vars.color.text.primary,
      marginRight: vars.space.md,
    },
  },
})
