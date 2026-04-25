import { keyframes, style } from '@vanilla-extract/css'
import { vars } from './theme.css'

/* ── Keyframes ──────────────────────────────────────────────── */

const popupEnter = keyframes({
  from: { opacity: 0, scale: '0.96' },
  to: { opacity: 1, scale: '1' },
})

const popupExit = keyframes({
  from: { opacity: 1, scale: '1' },
  to: { opacity: 0, scale: '0.96' },
})

/* ── Popup ──────────────────────────────────────────────────── */

export const dropdownPopup = style({
  zIndex: 50,
  maxHeight: 'var(--available-height)',
  width: 'var(--anchor-width)',
  minWidth: '128px',
  transformOrigin: 'var(--transform-origin)',
  overflowX: 'hidden',
  overflowY: 'auto',
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.panelElevated,
  padding: '4px',
  color: vars.color.text.primary,
  boxShadow: vars.shadow.md,
  border: `1px solid ${vars.color.border.soft}`,
  outline: 'none',
  selectors: {
    '&[data-open]': {
      animation: `${popupEnter} 100ms ${vars.motion.easing} both`,
    },
    '&[data-closed]': {
      overflow: 'hidden',
      animation: `${popupExit} 80ms ${vars.motion.easing} both`,
    },
  },
})

/* ── Item (base) ────────────────────────────────────────────── */

const itemBase = style({
  position: 'relative',
  display: 'flex',
  cursor: 'default',
  alignItems: 'center',
  gap: vars.space.sm,
  borderRadius: vars.radius.sm,
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.sm,
  fontSize: vars.fontSize.sm,
  outline: 'none',
  userSelect: 'none',
  transition: `background-color ${vars.motion.fast} ${vars.motion.easing}, color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&[data-highlighted]': {
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panelElevated})`,
      color: vars.color.brand.primary,
    },
    '&[data-disabled]': {
      pointerEvents: 'none',
      opacity: '0.5',
    },
    '&[data-inset]': {
      paddingLeft: '28px',
    },
    '& svg': {
      pointerEvents: 'none',
      flexShrink: 0,
      width: '16px',
      height: '16px',
    },
  },
})

export const dropdownItem = style([itemBase, {
  selectors: {
    '&[data-variant=destructive]': {
      color: vars.color.brand.danger,
    },
    '&[data-variant=destructive][data-highlighted]': {
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panelElevated})`,
      color: vars.color.brand.danger,
    },
  },
}])

/* ── Checkbox / Radio item (with indicator gutter) ──────────── */

export const dropdownCheckboxItem = style([itemBase, {
  paddingLeft: vars.space.sm,
  paddingRight: '32px',
}])

export const dropdownRadioItem = style([dropdownCheckboxItem])

export const dropdownIndicator = style({
  position: 'absolute',
  right: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  selectors: {
    '& svg': {
      width: '14px',
      height: '14px',
    },
  },
})

/* ── Sub-trigger ────────────────────────────────────────────── */

export const dropdownSubTrigger = style([itemBase, {
  selectors: {
    '&[data-popup-open]': {
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panelElevated})`,
      color: vars.color.brand.primary,
    },
  },
}])

/* ── Label ──────────────────────────────────────────────────── */

export const dropdownLabel = style({
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.sm,
  fontSize: vars.fontSize.xs,
  fontWeight: '500',
  color: vars.color.text.muted,
  selectors: {
    '&[data-inset]': {
      paddingLeft: '28px',
    },
  },
})

/* ── Separator ──────────────────────────────────────────────── */

export const dropdownSeparator = style({
  marginLeft: '-4px',
  marginRight: '-4px',
  marginTop: '4px',
  marginBottom: '4px',
  height: '1px',
  backgroundColor: vars.color.border.soft,
})

/* ── Shortcut ───────────────────────────────────────────────── */

export const dropdownShortcut = style({
  marginLeft: 'auto',
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.1em',
  color: vars.color.text.muted,
  selectors: {
    [`[data-highlighted] &`]: {
      color: vars.color.brand.primary,
    },
  },
})
