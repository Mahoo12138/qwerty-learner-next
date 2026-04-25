import * as React from 'react'
import { Menu } from '@base-ui/react/menu'
import { ChevronRight, Check } from 'lucide-react'
import clsx from 'clsx'
import {
  dropdownPopup,
  dropdownItem,
  dropdownCheckboxItem,
  dropdownRadioItem,
  dropdownIndicator,
  dropdownSubTrigger,
  dropdownLabel,
  dropdownSeparator,
  dropdownShortcut,
} from '@/styles/dropdown-menu.css'

/* ── Root & Structural ──────────────────────────────────────── */

function DropdownMenu({ ...props }: Menu.Root.Props) {
  return <Menu.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: Menu.Portal.Props) {
  return <Menu.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({
  asChild,
  ...props
}: Menu.Trigger.Props & { asChild?: boolean }) {
  if (asChild) {
    return (
      <Menu.Trigger
        data-slot="dropdown-menu-trigger"
        render={React.createElement('div', {})}
        {...props}
      />
    )
  }
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

/* ── Content (Positioner + Popup) ───────────────────────────── */

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: Menu.Popup.Props &
  Pick<Menu.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={clsx(dropdownPopup, className)}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

/* ── Group & Label ──────────────────────────────────────────── */

function DropdownMenuGroup({ ...props }: Menu.Group.Props) {
  return <Menu.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  inset,
  className,
  ...props
}: Menu.GroupLabel.Props & { inset?: boolean }) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={clsx(dropdownLabel, className)}
      {...props}
    />
  )
}

/* ── Item ───────────────────────────────────────────────────── */

function DropdownMenuItem({
  inset,
  variant = 'default',
  className,
  ...props
}: Menu.Item.Props & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      className={clsx(dropdownItem, className)}
      {...props}
    />
  )
}

/* ── Sub ────────────────────────────────────────────────────── */

function DropdownMenuSub({ ...props }: Menu.SubmenuRoot.Props) {
  return <Menu.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  inset,
  children,
  className,
  ...props
}: Menu.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <Menu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={clsx(dropdownSubTrigger, className)}
      {...props}
    >
      {children}
      <ChevronRight
        style={{ width: 16, height: 16, marginLeft: 'auto', flexShrink: 0 }}
      />
    </Menu.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={className}
      {...props}
    />
  )
}

/* ── Checkbox Item ──────────────────────────────────────────── */

function DropdownMenuCheckboxItem({
  inset,
  children,
  checked,
  className,
  ...props
}: Menu.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset || undefined}
      className={clsx(dropdownCheckboxItem, className)}
      checked={checked}
      {...props}
    >
      <span
        data-slot="dropdown-menu-checkbox-indicator"
        className={dropdownIndicator}
      >
        <Menu.CheckboxItemIndicator>
          <Check style={{ width: 14, height: 14 }} />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  )
}

/* ── Radio ──────────────────────────────────────────────────── */

function DropdownMenuRadioGroup({ ...props }: Menu.RadioGroup.Props) {
  return <Menu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  inset,
  children,
  className,
  ...props
}: Menu.RadioItem.Props & { inset?: boolean }) {
  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset || undefined}
      className={clsx(dropdownRadioItem, className)}
      {...props}
    >
      <span
        data-slot="dropdown-menu-radio-indicator"
        className={dropdownIndicator}
      >
        <Menu.RadioItemIndicator>
          <Check style={{ width: 14, height: 14 }} />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  )
}

/* ── Separator & Shortcut ───────────────────────────────────── */

function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={clsx(dropdownSeparator, className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={clsx(dropdownShortcut, className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
