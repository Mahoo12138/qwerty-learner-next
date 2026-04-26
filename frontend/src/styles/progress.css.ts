import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { vars } from './theme.css'

export const progressRoot = recipe({
  base: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: vars.radius.pill,
    backgroundColor: `color-mix(in oklab, ${vars.color.border.soft} 60%, ${vars.color.bg.panel})`,
  },
  variants: {
    size: {
      xs:  { height: '4px' },
      sm:  { height: '6px' },
      md:  { height: '8px' },
    },
  },
  defaultVariants: { size: 'sm' },
})

export type ProgressSize = NonNullable<Parameters<typeof progressRoot>[0]>['size']

export const progressIndicator = style({
  height: '100%',
  width: '100%',
  flex: '1',
  backgroundColor: vars.color.brand.primary,
  transitionProperty: 'transform',
  transitionDuration: '500ms',
  transitionTimingFunction: vars.motion.easing,
})

/** Semantic colour overrides applied via `data-variant` on the indicator */
export const progressIndicatorSuccess = style([progressIndicator, {
  backgroundColor: vars.color.brand.success,
}])

export const progressIndicatorWarning = style([progressIndicator, {
  backgroundColor: vars.color.brand.warning,
}])

export const progressIndicatorDanger = style([progressIndicator, {
  backgroundColor: vars.color.brand.danger,
}])
