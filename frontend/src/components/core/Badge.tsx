import * as React from 'react'
import { clsx } from 'clsx'

import { badgeRecipe } from '@/styles/badge.css'
import type { BadgeVariant } from '@/styles/badge.css'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(badgeRecipe({ variant }), className)}
      {...props}
    />
  )
}
