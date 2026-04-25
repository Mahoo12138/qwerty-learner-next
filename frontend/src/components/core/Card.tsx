import * as React from 'react'
import { clsx } from 'clsx'

import {
  card,
  cardElevated,
  cardHeader,
  cardTitle,
  cardDescription,
  cardContent,
  cardFooter,
} from '@/styles/card.css'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

export function Card({ className, elevated, ...props }: CardProps) {
  return (
    <div
      className={clsx(elevated ? cardElevated : card, className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(cardHeader, className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx(cardTitle, className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx(cardDescription, className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(cardContent, className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(cardFooter, className)} {...props} />
}
