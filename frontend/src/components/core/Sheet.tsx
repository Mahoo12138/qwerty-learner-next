import * as React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import clsx from 'clsx'
import {
  sheetBackdrop,
  sheetPopupRecipe,
  sheetHeader,
  sheetTitle,
  sheetBody,
  sheetFooter,
  sheetCloseButton,
} from '@/styles/sheet.css'
import type { SheetSide } from '@/styles/sheet.css'

/* Sheet reuses Base UI's Dialog primitives — only styles differ. */

const SheetRoot = Dialog.Root
const SheetTrigger = Dialog.Trigger
const SheetPortal = Dialog.Portal
const SheetClose = Dialog.Close

/* ── Internal Backdrop ──────────────────────────────────────── */

function SheetBackdrop({ className, ...props }: React.ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      data-slot="sheet-backdrop"
      className={clsx(sheetBackdrop, className)}
      {...props}
    />
  )
}

/* ── SheetContent ───────────────────────────────────────────── */

export interface SheetContentProps extends React.ComponentProps<typeof Dialog.Popup> {
  side?: SheetSide
}

function SheetContent({ side = 'left', className, children, ...props }: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <Dialog.Popup
        data-slot="sheet-content"
        className={clsx(sheetPopupRecipe({ side }), className)}
        {...props}
      >
        {children}
        <Dialog.Close
          aria-label="Close panel"
          className={sheetCloseButton}
        >
          <X />
        </Dialog.Close>
      </Dialog.Popup>
    </SheetPortal>
  )
}

/* ── Sheet Parts ────────────────────────────────────────────── */

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={clsx(sheetHeader, className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={clsx(sheetTitle, className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-body"
      className={clsx(sheetBody, className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={clsx(sheetFooter, className)}
      {...props}
    />
  )
}

export {
  SheetRoot as Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
}
export type { SheetSide }
