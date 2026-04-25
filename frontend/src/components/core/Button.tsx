import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

import { buttonRecipe } from '@/styles/button.css'
import type { ButtonVariant, ButtonSize } from '@/styles/button.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={clsx(buttonRecipe({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
