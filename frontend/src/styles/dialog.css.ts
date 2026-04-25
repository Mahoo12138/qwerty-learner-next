import { keyframes, style } from '@vanilla-extract/css'
import { vars } from './theme.css'

/* ── Keyframes ──────────────────────────────────────────────── */

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
})

/** Use CSS individual-transform `scale` so it composes with the
 *  translate(-50%,-50%) positioning transform without conflict. */
const popupEnter = keyframes({
  from: { opacity: 0, scale: '0.96' },
  to: { opacity: 1, scale: '1' },
})

const popupExit = keyframes({
  from: { opacity: 1, scale: '1' },
  to: { opacity: 0, scale: '0.96' },
})

/* ── Dialog Backdrop ────────────────────────────────────────── */

export const dialogBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  backgroundColor: 'rgb(0 0 0 / 0.45)',
  selectors: {
    '&[data-open]': {
      animation: `${fadeIn} 180ms ${vars.motion.easing} both`,
    },
    '&[data-closed]': {
      animation: `${fadeOut} 150ms ${vars.motion.easing} both`,
    },
  },
})

/* ── Dialog Popup ───────────────────────────────────────────── */

export const dialogPopup = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 50,
  width: 'calc(100% - 2rem)',
  maxWidth: '512px',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  padding: vars.space.xl,
  boxShadow: vars.shadow.lg,
  outline: 'none',
  selectors: {
    '&[data-open]': {
      animation: `${popupEnter} 200ms ${vars.motion.easing} both`,
    },
    '&[data-closed]': {
      animation: `${popupExit} 150ms ${vars.motion.easing} both`,
    },
  },
})

/* ── Dialog Parts ───────────────────────────────────────────── */

export const dialogHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginBottom: vars.space.lg,
})

export const dialogTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: '600',
  color: vars.color.text.primary,
  lineHeight: '1.3',
})

export const dialogDescription = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
  lineHeight: '1.5',
})

export const dialogFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  marginTop: vars.space.xl,
})

export const dialogCloseButton = style({
  position: 'absolute',
  top: vars.space.lg,
  right: vars.space.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: vars.radius.sm,
  color: vars.color.text.muted,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  transition: `color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '& svg': {
      width: '14px',
      height: '14px',
      pointerEvents: 'none',
    },
    '&:hover': {
      color: vars.color.text.primary,
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.app})`,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: vars.shadow.focusRing,
    },
  },
})
