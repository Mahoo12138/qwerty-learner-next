import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import clsx from 'clsx'

import { progressRoot, progressIndicator, progressIndicatorSuccess } from '@/styles/progress.css'
import type { ProgressSize } from '@/styles/progress.css'

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  size?: ProgressSize
  /** When true, renders the success (green) indicator colour. */
  success?: boolean
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, success, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={clsx(progressRoot({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={clsx(success ? progressIndicatorSuccess : progressIndicator)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'
