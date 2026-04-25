import { recipe } from '@vanilla-extract/recipes'

import { vars } from './theme.css'

export const badgeRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: vars.radius.pill,
    border: '1px solid transparent',
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: vars.space.sm,
    paddingRight: vars.space.sm,
    fontSize: vars.fontSize.xs,
    fontWeight: '500',
    lineHeight: '1.4',
    whiteSpace: 'nowrap',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: vars.motion.fast,
    transitionTimingFunction: vars.motion.easing,
  },

  variants: {
    variant: {
      default: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 15%, ${vars.color.bg.panel})`,
        color: vars.color.brand.primary,
        borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 30%, transparent)`,
      },
      secondary: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panel})`,
        color: `color-mix(in oklab, ${vars.color.brand.secondary} 90%, ${vars.color.text.primary})`,
        borderColor: `color-mix(in oklab, ${vars.color.brand.secondary} 30%, transparent)`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: vars.color.text.secondary,
        borderColor: vars.color.border.default,
      },
      success: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.success} 16%, ${vars.color.bg.panel})`,
        color: vars.color.brand.success,
        borderColor: `color-mix(in oklab, ${vars.color.brand.success} 28%, transparent)`,
      },
      warning: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 16%, ${vars.color.bg.panel})`,
        color: `color-mix(in oklab, ${vars.color.brand.warning} 80%, ${vars.color.text.primary})`,
        borderColor: `color-mix(in oklab, ${vars.color.brand.warning} 28%, transparent)`,
      },
      destructive: {
        backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 14%, ${vars.color.bg.panel})`,
        color: vars.color.brand.danger,
        borderColor: `color-mix(in oklab, ${vars.color.brand.danger} 26%, transparent)`,
      },
    },
  },

  defaultVariants: {
    variant: 'default',
  },
})

export type BadgeVariant = NonNullable<Parameters<typeof badgeRecipe>[0]>['variant']
