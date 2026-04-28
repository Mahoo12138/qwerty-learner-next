import { recipe } from '@vanilla-extract/recipes'
import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from './theme.css'

export const buttonBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  whiteSpace: 'nowrap',
  fontFamily: vars.font.body,
  fontWeight: '500',
  lineHeight: '1',
  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: vars.radius.md,
  border: '1.5px solid transparent',
  outline: 'none',
  transitionProperty: 'background-color, color, border-color, box-shadow, opacity, transform',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,

  ':focus-visible': {
    boxShadow: vars.shadow.focusRing,
  },

  selectors: {
    '&:disabled, &[data-disabled]': {
      pointerEvents: 'none',
      opacity: '0.5',
    },
  },
})

globalStyle(`${buttonBase} svg`, {
  pointerEvents: 'none',
  flexShrink: 0,
})

export const buttonRecipe = recipe({
  base: buttonBase,

  variants: {
    variant: {
      default: {
        backgroundColor: vars.color.brand.primary,
        color: vars.color.text.inverse,
        boxShadow: vars.shadow.sm,
        ':hover': {
          backgroundColor: vars.color.brand.primaryHover,
          transform: 'translateY(-1px)',
          boxShadow: vars.shadow.md,
        },
        ':active': {
          transform: 'translateY(0)',
          boxShadow: vars.shadow.sm,
        },
      },
      secondary: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panel})`,
        color: vars.color.text.primary,
        ':hover': {
          backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 28%, ${vars.color.bg.panel})`,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: vars.color.border.default,
        color: vars.color.text.primary,
        ':hover': {
          backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panel})`,
          borderColor: vars.color.border.focus,
          color: vars.color.brand.primary,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.text.secondary,
        ':hover': {
          backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.app})`,
          color: vars.color.brand.primary,
        },
      },
      destructive: {
        backgroundColor: vars.color.brand.danger,
        color: vars.color.text.inverse,
        boxShadow: vars.shadow.sm,
        ':hover': {
          backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 85%, black)`,
        },
      },
      link: {
        backgroundColor: 'transparent',
        color: vars.color.brand.primary,
        textDecorationLine: 'underline',
        textUnderlineOffset: '4px',
        ':hover': {
          color: vars.color.brand.primaryHover,
        },
      },
    },

    size: {
      sm: {
        height: '32px',
        paddingLeft: vars.space.md,
        paddingRight: vars.space.md,
        fontSize: vars.fontSize.xs,
        borderRadius: vars.radius.sm,
      },
      default: {
        height: '36px',
        paddingLeft: vars.space.lg,
        paddingRight: vars.space.lg,
        fontSize: vars.fontSize.sm,
      },
      lg: {
        height: '40px',
        paddingLeft: vars.space.xl,
        paddingRight: vars.space.xl,
        fontSize: vars.fontSize.sm,
      },
      icon: {
        width: '36px',
        height: '36px',
        padding: '0',
      },
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export type ButtonVariant = NonNullable<Parameters<typeof buttonRecipe>[0]>['variant']
export type ButtonSize = NonNullable<Parameters<typeof buttonRecipe>[0]>['size']
