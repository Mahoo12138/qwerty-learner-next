import { keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
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

const slideInFromLeft = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
})

const slideOutToLeft = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-100%)' },
})

const slideInFromRight = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
})

const slideOutToRight = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' },
})

const slideInFromTop = keyframes({
  from: { transform: 'translateY(-100%)' },
  to: { transform: 'translateY(0)' },
})

const slideOutToTop = keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: 'translateY(-100%)' },
})

const slideInFromBottom = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
})

const slideOutToBottom = keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: 'translateY(100%)' },
})

/* ── Sheet Backdrop ─────────────────────────────────────────── */

export const sheetBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  backgroundColor: 'rgb(0 0 0 / 0.4)',
  selectors: {
    '&[data-open]': {
      animation: `${fadeIn} 200ms ${vars.motion.easing} both`,
    },
    '&[data-closed]': {
      animation: `${fadeOut} 180ms ${vars.motion.easing} both`,
    },
  },
})

/* ── Sheet Popup (recipe by side) ───────────────────────────── */

export const sheetPopupRecipe = recipe({
  base: {
    position: 'fixed',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: vars.color.bg.panel,
    boxShadow: vars.shadow.lg,
    outline: 'none',
  },
  variants: {
    side: {
      left: {
        top: 0,
        left: 0,
        bottom: 0,
        height: '100%',
        width: '75%',
        maxWidth: '360px',
        borderRight: `1px solid ${vars.color.border.soft}`,
        selectors: {
          '&[data-open]': {
            animation: `${slideInFromLeft} 280ms ${vars.motion.easing} both`,
          },
          '&[data-closed]': {
            animation: `${slideOutToLeft} 220ms ${vars.motion.easing} both`,
          },
        },
      },
      right: {
        top: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '75%',
        maxWidth: '360px',
        borderLeft: `1px solid ${vars.color.border.soft}`,
        selectors: {
          '&[data-open]': {
            animation: `${slideInFromRight} 280ms ${vars.motion.easing} both`,
          },
          '&[data-closed]': {
            animation: `${slideOutToRight} 220ms ${vars.motion.easing} both`,
          },
        },
      },
      top: {
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderBottom: `1px solid ${vars.color.border.soft}`,
        selectors: {
          '&[data-open]': {
            animation: `${slideInFromTop} 280ms ${vars.motion.easing} both`,
          },
          '&[data-closed]': {
            animation: `${slideOutToTop} 220ms ${vars.motion.easing} both`,
          },
        },
      },
      bottom: {
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        borderTop: `1px solid ${vars.color.border.soft}`,
        selectors: {
          '&[data-open]': {
            animation: `${slideInFromBottom} 280ms ${vars.motion.easing} both`,
          },
          '&[data-closed]': {
            animation: `${slideOutToBottom} 220ms ${vars.motion.easing} both`,
          },
        },
      },
    },
  },
  defaultVariants: { side: 'left' },
})

export type SheetSide = NonNullable<Parameters<typeof sheetPopupRecipe>[0]>['side']

/* ── Sheet Parts ────────────────────────────────────────────── */

export const sheetHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: vars.space.lg,
  borderBottom: `1px solid ${vars.color.border.soft}`,
})

export const sheetTitle = style({
  margin: 0,
  fontSize: vars.fontSize.md,
  fontWeight: '600',
  color: vars.color.text.primary,
})

export const sheetBody = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.lg,
})

export const sheetFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  padding: vars.space.lg,
  borderTop: `1px solid ${vars.color.border.soft}`,
})

export const sheetCloseButton = style({
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
