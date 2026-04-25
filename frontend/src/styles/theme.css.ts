import { createGlobalTheme } from '@vanilla-extract/css'

const lightTheme = {
  color: {
    bg: {
      app: 'oklch(0.985 0.02 92)',
      panel: 'oklch(0.99 0.014 92)',
      panelElevated: 'oklch(1 0 0)',
      surfaceTintA: 'oklch(0.9 0.11 32 / 0.22)',
      surfaceTintB: 'oklch(0.89 0.1 165 / 0.2)',
    },
    text: {
      primary: 'oklch(0.26 0.028 35)',
      secondary: 'oklch(0.42 0.03 40)',
      muted: 'oklch(0.58 0.02 40)',
      inverse: 'oklch(0.98 0.01 95)',
    },
    border: {
      soft: 'oklch(0.9 0.015 70)',
      default: 'oklch(0.84 0.025 55)',
      strong: 'oklch(0.7 0.035 42)',
      focus: 'oklch(0.69 0.15 32)',
    },
    brand: {
      primary: 'oklch(0.69 0.15 32)',
      primaryHover: 'oklch(0.63 0.16 30)',
      secondary: 'oklch(0.72 0.11 165)',
      accent: 'oklch(0.78 0.11 88)',
      success: 'oklch(0.7 0.14 150)',
      warning: 'oklch(0.76 0.16 78)',
      danger: 'oklch(0.66 0.2 24)',
    },
  },
  shadow: {
    sm: '0 4px 10px -8px rgb(70 38 20 / 0.35)',
    md: '0 16px 28px -20px rgb(80 42 18 / 0.38)',
    lg: '0 26px 46px -24px rgb(74 30 16 / 0.42)',
    focusRing: '0 0 0 3px color-mix(in oklab, oklch(0.69 0.15 32) 35%, transparent)',
  },
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
    pill: '999px',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  font: {
    body: '"Geist Variable", "Nunito", "Segoe UI", "PingFang SC", sans-serif',
    heading: '"Geist Variable", "Nunito", "Segoe UI", "PingFang SC", sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
  },
  motion: {
    fast: '120ms',
    normal: '220ms',
    slow: '360ms',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const

const darkTheme = {
  color: {
    bg: {
      app: 'oklch(0.2 0.02 42)',
      panel: 'oklch(0.24 0.022 42)',
      panelElevated: 'oklch(0.28 0.024 42)',
      surfaceTintA: 'oklch(0.71 0.14 32 / 0.2)',
      surfaceTintB: 'oklch(0.73 0.1 165 / 0.18)',
    },
    text: {
      primary: 'oklch(0.95 0.01 90)',
      secondary: 'oklch(0.84 0.02 88)',
      muted: 'oklch(0.7 0.02 88)',
      inverse: 'oklch(0.22 0.02 40)',
    },
    border: {
      soft: 'oklch(0.34 0.02 42)',
      default: 'oklch(0.43 0.03 42)',
      strong: 'oklch(0.56 0.04 42)',
      focus: 'oklch(0.75 0.14 34)',
    },
    brand: {
      primary: 'oklch(0.75 0.14 34)',
      primaryHover: 'oklch(0.8 0.13 36)',
      secondary: 'oklch(0.76 0.11 165)',
      accent: 'oklch(0.84 0.1 88)',
      success: 'oklch(0.77 0.12 150)',
      warning: 'oklch(0.83 0.15 78)',
      danger: 'oklch(0.75 0.15 26)',
    },
  },
  shadow: {
    sm: '0 6px 14px -10px rgb(0 0 0 / 0.55)',
    md: '0 18px 30px -24px rgb(0 0 0 / 0.58)',
    lg: '0 26px 48px -28px rgb(0 0 0 / 0.62)',
    focusRing: '0 0 0 3px color-mix(in oklab, oklch(0.75 0.14 34) 38%, transparent)',
  },
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
    pill: '999px',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  font: {
    body: '"Geist Variable", "Nunito", "Segoe UI", "PingFang SC", sans-serif',
    heading: '"Geist Variable", "Nunito", "Segoe UI", "PingFang SC", sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
  },
  motion: {
    fast: '120ms',
    normal: '220ms',
    slow: '360ms',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const

export const vars = createGlobalTheme(':root', lightTheme)

createGlobalTheme('.dark', vars, darkTheme)
