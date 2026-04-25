import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { avatarRoot, avatarImage, avatarFallback } from '@/styles/avatar.css'

/* Avatar keeps Radix under the hood because it handles
   image-load error → fallback state transitions automatically. */

export interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {}

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={clsx(avatarRoot, className)}
      {...props}
    />
  )
}

export interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={clsx(avatarImage, className)}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={clsx(avatarFallback, className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
