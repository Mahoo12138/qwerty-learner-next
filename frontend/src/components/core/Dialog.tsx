import * as React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import clsx from 'clsx'
import {
  dialogBackdrop,
  dialogPopup,
  dialogHeader,
  dialogTitle,
  dialogDescription,
  dialogFooter,
  dialogCloseButton,
} from '@/styles/dialog.css'

/* Convenience re-exports for composing dialogs */
const DialogRoot = Dialog.Root
const DialogTrigger = Dialog.Trigger
const DialogPortal = Dialog.Portal
const DialogClose = Dialog.Close

/* ── Internal Backdrop ──────────────────────────────────────── */

function DialogBackdrop({ className, ...props }: React.ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      data-slot="dialog-backdrop"
      className={clsx(dialogBackdrop, className)}
      {...props}
    />
  )
}

/* ── DialogContent — portal + backdrop + popup in one ───────── */

export interface DialogContentProps extends React.ComponentProps<typeof Dialog.Popup> {}

function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <Dialog.Popup
        data-slot="dialog-content"
        className={clsx(dialogPopup, className)}
        {...props}
      >
        {children}
        <Dialog.Close
          aria-label="Close dialog"
          className={dialogCloseButton}
        >
          <X />
        </Dialog.Close>
      </Dialog.Popup>
    </DialogPortal>
  )
}

/* ── DialogHeader ───────────────────────────────────────────── */

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={clsx(dialogHeader, className)}
      {...props}
    />
  )
}

/* ── DialogTitle ────────────────────────────────────────────── */

function DialogTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="dialog-title"
      className={clsx(dialogTitle, className)}
      {...props}
    />
  )
}

/* ── DialogDescription ──────────────────────────────────────── */

function DialogDescription({ className, ...props }: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="dialog-description"
      className={clsx(dialogDescription, className)}
      {...props}
    />
  )
}

/* ── DialogFooter ───────────────────────────────────────────── */

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={clsx(dialogFooter, className)}
      {...props}
    />
  )
}

export {
  DialogRoot as Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
