import * as React from 'react'
import clsx from 'clsx'
import { separatorRecipe } from '@/styles/separator.css'
import type { SeparatorOrientation } from '@/styles/separator.css'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation
  /** When true the element is purely visual and hidden from screen readers */
  decorative?: boolean
}

function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative ? orientation : undefined}
      data-orientation={orientation}
      className={clsx(separatorRecipe({ orientation }), className)}
      {...props}
    />
  )
}

export { Separator }
