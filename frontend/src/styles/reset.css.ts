import { globalStyle } from '@vanilla-extract/css'

import { vars } from './theme.css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('*', {
  margin: 0,
})

globalStyle('html, body, #root', {
  minHeight: '100%',
})

globalStyle('html', {
  colorScheme: 'light',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backgroundColor: vars.color.bg.app,
  color: vars.color.text.primary,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  lineHeight: '1.5',
})

globalStyle('html.dark', {
  colorScheme: 'dark',
})

globalStyle('body', {
  minHeight: '100vh',
  background: `
    radial-gradient(1100px 560px at 10% -12%, ${vars.color.bg.surfaceTintA}, transparent 72%),
    radial-gradient(1000px 520px at 96% 118%, ${vars.color.bg.surfaceTintB}, transparent 70%),
    ${vars.color.bg.app}
  `,
  color: vars.color.text.primary,
  transitionProperty: 'background-color, color',
  transitionDuration: vars.motion.normal,
  transitionTimingFunction: vars.motion.easing,
})

globalStyle('img, svg, video, canvas', {
  display: 'block',
  maxWidth: '100%',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

globalStyle('button, input, textarea, select', {
  font: 'inherit',
  color: 'inherit',
})

globalStyle('button', {
  border: 'none',
  background: 'transparent',
})

globalStyle(':focus-visible', {
  outline: 'none',
  boxShadow: vars.shadow.focusRing,
  borderRadius: vars.radius.sm,
})

globalStyle('::selection', {
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 32%, transparent)`,
  color: vars.color.text.primary,
})

globalStyle('::-webkit-scrollbar', {
  width: '10px',
  height: '10px',
})

globalStyle('::-webkit-scrollbar-track', {
  background: 'transparent',
})

globalStyle('::-webkit-scrollbar-thumb', {
  backgroundColor: `color-mix(in oklab, ${vars.color.border.strong} 58%, transparent)`,
  border: '2px solid transparent',
  borderRadius: vars.radius.pill,
  backgroundClip: 'content-box',
})

globalStyle('html', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      scrollBehavior: 'auto',
    },
  },
})

globalStyle('body', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transitionDuration: '0ms',
    },
  },
})
