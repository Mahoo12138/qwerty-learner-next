import * as React from 'react'
import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import clsx from 'clsx'

import { switchRoot, switchThumb } from '@/styles/switch.css'

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        className={clsx(switchRoot, className)}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={switchThumb}
        />
      </SwitchPrimitive.Root>
    )
  },
)
Switch.displayName = 'Switch'