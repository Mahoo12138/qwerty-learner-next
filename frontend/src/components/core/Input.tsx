import * as React from 'react'
import { clsx } from 'clsx'

import { input } from '@/styles/input.css'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(input, className)}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
