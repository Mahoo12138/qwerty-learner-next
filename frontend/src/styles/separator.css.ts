import { recipe } from '@vanilla-extract/recipes'
import { vars } from './theme.css'

export const separatorRecipe = recipe({
  base: {
    flexShrink: 0,
    backgroundColor: vars.color.border.soft,
  },
  variants: {
    orientation: {
      horizontal: {
        height: '1px',
        width: '100%',
      },
      vertical: {
        height: '100%',
        width: '1px',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type SeparatorOrientation = NonNullable<Parameters<typeof separatorRecipe>[0]>['orientation']
