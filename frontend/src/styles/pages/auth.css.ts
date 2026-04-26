import { globalKeyframes, globalStyle, keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const panelBorder = `1px solid color-mix(in oklab, ${vars.color.border.soft} 72%, transparent)`
const glassSurface = `color-mix(in oklab, ${vars.color.bg.panel} 82%, transparent)`

const keycapFloat = keyframes({
  '0%, 100%': {
    translate: '0 0px',
  },
  '50%': {
    translate: '0 -10px',
  },
})

globalKeyframes('spin', {
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

globalKeyframes('pulse', {
  '0%, 100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
  '50%': {
    opacity: 0.72,
    transform: 'scale(0.9)',
  },
})

export const root = style({
  position: 'relative',
  display: 'grid',
  minHeight: '100vh',
  gridTemplateColumns: 'minmax(0, 1.08fr) minmax(0, 0.92fr)',
  backgroundColor: vars.color.bg.app,
  backgroundImage: [
    `radial-gradient(circle at left top, ${vars.color.bg.surfaceTintA}, transparent 34%)`,
    `radial-gradient(circle at right bottom, ${vars.color.bg.surfaceTintB}, transparent 32%)`,
  ].join(', '),
  overflow: 'hidden',
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const brandPanel = style({
  position: 'relative',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflow: 'hidden',
  padding: '40px',
  color: vars.color.text.inverse,
  isolation: 'isolate',
  '@media': {
    '(max-width: 960px)': {
      minHeight: 'auto',
      padding: '24px',
      gap: '32px',
    },
  },
})

export const brandGlowA = style({
  position: 'absolute',
  left: '-10%',
  top: '-14%',
  zIndex: 0,
  height: '260px',
  width: '260px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgb(255 255 255 / 0.34) 0%, rgb(255 255 255 / 0) 72%)',
  filter: 'blur(16px)',
  pointerEvents: 'none',
})

export const brandGlowB = style({
  position: 'absolute',
  right: '-12%',
  bottom: '-12%',
  zIndex: 0,
  height: '320px',
  width: '320px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0) 72%)',
  filter: 'blur(18px)',
  pointerEvents: 'none',
})

export const keycapOuter = style({
  position: 'absolute',
  zIndex: 0,
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
})

export const keycapInner = style({
  display: 'flex',
  height: '72px',
  width: '72px',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgb(255 255 255 / 0.2)',
  borderRadius: '20px',
  background: 'linear-gradient(180deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0.05) 100%)',
  boxShadow: '0 20px 48px -30px rgb(0 0 0 / 0.65)',
  color: 'rgb(255 255 255 / 0.92)',
  fontFamily: vars.font.mono,
  fontSize: '24px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  animationName: keycapFloat,
  animationDuration: '6s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  '@media': {
    '(max-width: 960px)': {
      height: '56px',
      width: '56px',
      borderRadius: '16px',
      fontSize: '18px',
    },
  },
})

export const brandLogoRow = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
})

export const brandLogoMark = style({
  display: 'flex',
  height: '42px',
  width: '42px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '14px',
  border: '1px solid rgb(255 255 255 / 0.2)',
  background: 'rgb(255 255 255 / 0.12)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
})

export const brandLogoText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgb(255 255 255 / 0.95)',
})

export const brandHero = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  maxWidth: '520px',
  flexDirection: 'column',
  gap: '18px',
  marginTop: '48px',
  '@media': {
    '(max-width: 960px)': {
      marginTop: 0,
    },
  },
})

export const brandBadge = style({
  display: 'inline-flex',
  width: 'fit-content',
  alignItems: 'center',
  gap: vars.space.sm,
  borderRadius: vars.radius.pill,
  border: '1px solid rgb(255 255 255 / 0.18)',
  background: 'rgb(255 255 255 / 0.12)',
  padding: '10px 14px',
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.08em',
  color: 'rgb(255 255 255 / 0.88)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
})

export const brandBadgeDot = style({
  display: 'inline-flex',
  height: '8px',
  width: '8px',
  borderRadius: '50%',
  boxShadow: '0 0 0 6px rgb(255 255 255 / 0.08)',
})

export const brandHeading = style({
  margin: 0,
  fontFamily: vars.font.heading,
  fontSize: 'clamp(56px, 7vw, 88px)',
  fontWeight: '800',
  lineHeight: '0.92',
  letterSpacing: '-0.06em',
  color: 'rgb(255 255 255 / 0.98)',
  textWrap: 'balance',
})

export const brandHeadingDim = style({
  color: 'rgb(255 255 255 / 0.7)',
})

export const brandSubtext = style({
  margin: 0,
  maxWidth: '430px',
  fontSize: vars.fontSize.lg,
  lineHeight: '1.75',
  color: 'rgb(255 255 255 / 0.78)',
})

export const brandFooter = style({
  position: 'relative',
  zIndex: 1,
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const brandStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space.md,
  '@media': {
    '(max-width: 560px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const brandStatItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  borderRadius: vars.radius.lg,
  border: '1px solid rgb(255 255 255 / 0.14)',
  background: 'linear-gradient(180deg, rgb(255 255 255 / 0.14) 0%, rgb(255 255 255 / 0.05) 100%)',
  padding: '16px 18px',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
})

export const brandStatValue = style({
  fontSize: '28px',
  fontWeight: '800',
  lineHeight: 1,
  color: 'rgb(255 255 255 / 0.96)',
})

export const brandStatLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '600',
  letterSpacing: '0.08em',
  color: 'rgb(255 255 255 / 0.66)',
})

export const formPanel = style({
  position: 'relative',
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 24px',
  background: [
    `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, transparent) 0%, color-mix(in oklab, ${vars.color.bg.app} 92%, transparent) 100%)`,
    `radial-gradient(circle at top right, color-mix(in oklab, ${vars.color.brand.primary} 10%, transparent), transparent 34%)`,
  ].join(', '),
  '@media': {
    '(max-width: 960px)': {
      minHeight: 'auto',
      padding: '20px 20px 28px',
    },
  },
})

export const watermark = style({
  position: 'absolute',
  right: '-2%',
  top: '8%',
  zIndex: 0,
  fontSize: 'clamp(88px, 13vw, 180px)',
  fontWeight: '800',
  letterSpacing: '0.18em',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 10%, transparent)`,
  pointerEvents: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  '@media': {
    '(max-width: 960px)': {
      top: '4%',
      right: '-14%',
      fontSize: 'clamp(56px, 20vw, 112px)',
    },
  },
})

export const mobileLogo = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.xl,
  '@media': {
    '(min-width: 961px)': {
      display: 'none',
    },
  },
})

export const mobileLogoMark = style({
  display: 'flex',
  height: '38px',
  width: '38px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  color: vars.color.brand.primary,
  boxShadow: vars.shadow.sm,
})

export const mobileLogoText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: vars.color.text.primary,
})

export const formContainer = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '460px',
  border: panelBorder,
  borderRadius: '28px',
  backgroundColor: glassSurface,
  padding: 'clamp(24px, 4vw, 40px)',
  boxShadow: vars.shadow.lg,
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
})

export const formHeading = style({
  marginBottom: vars.space['2xl'],
})

export const formEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: vars.color.brand.primary,
})

export const formTitle = style({
  margin: '10px 0 0',
  fontFamily: vars.font.heading,
  fontSize: 'clamp(48px, 8vw, 72px)',
  fontWeight: '800',
  lineHeight: '0.92',
  letterSpacing: '-0.06em',
  color: vars.color.text.primary,
})

export const formSubtitle = style({
  margin: '16px 0 0',
  maxWidth: '320px',
  fontSize: vars.fontSize.md,
  lineHeight: '1.75',
  color: vars.color.text.secondary,
})

export const noticeBanner = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.md,
  marginBottom: vars.space.xl,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 22%, transparent)`,
  borderRadius: vars.radius.lg,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.warning} 8%, ${vars.color.bg.panelElevated})`,
  padding: '14px 16px',
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.7',
})

export const noticeBannerIcon = style({
  flexShrink: 0,
  color: vars.color.brand.warning,
  marginTop: '2px',
})

export const errorMessage = style({
  marginBottom: vars.space.lg,
  border: `1px solid color-mix(in oklab, ${vars.color.brand.danger} 24%, transparent)`,
  borderRadius: vars.radius.md,
  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panelElevated})`,
  padding: '12px 14px',
  color: vars.color.brand.danger,
  fontSize: vars.fontSize.sm,
  lineHeight: '1.6',
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
})

export const fieldGroupGap = style([fieldGroup, {
  marginTop: vars.space.lg,
}])

export const fieldWrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const fieldLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const fieldInput = style({
  width: '100%',
  border: 'none',
  borderBottom: `2px solid color-mix(in oklab, ${vars.color.border.default} 74%, transparent)`,
  backgroundColor: 'transparent',
  padding: '12px 4px 14px',
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  color: vars.color.text.primary,
  transitionProperty: 'border-color, background-color, transform',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  selectors: {
    '&::placeholder': {
      color: vars.color.text.muted,
    },
    '&:focus': {
      outline: 'none',
      borderBottomColor: vars.color.brand.primary,
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 3%, transparent)`,
    },
  },
})

export const submitButton = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.md,
  marginTop: '28px',
  border: 'none',
  borderRadius: vars.radius.pill,
  background: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryHover} 100%)`,
  boxShadow: vars.shadow.md,
  padding: '10px 10px 10px 22px',
  color: vars.color.text.inverse,
  cursor: 'pointer',
  transitionProperty: 'transform, box-shadow, opacity',
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: vars.shadow.lg,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      cursor: 'default',
      opacity: 0.7,
      transform: 'none',
      boxShadow: vars.shadow.md,
    },
  },
})

export const submitButtonLabel = style({
  fontSize: vars.fontSize.md,
  fontWeight: '700',
  lineHeight: 1.2,
})

export const submitButtonIconWrap = style({
  display: 'flex',
  height: '40px',
  width: '40px',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'rgb(255 255 255 / 0.18)',
  color: 'rgb(255 255 255 / 0.94)',
})

export const footerText = style({
  margin: '24px 0 0',
  textAlign: 'center',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
})

export const footerLink = style({
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
  font: 'inherit',
  fontWeight: '700',
  color: vars.color.brand.primary,
  cursor: 'pointer',
  transition: `color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      color: vars.color.brand.primaryHover,
    },
    '&:focus-visible': {
      outline: 'none',
      textDecoration: 'underline',
    },
  },
})

export const stepsLabel = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgb(255 255 255 / 0.58)',
})

export const stepsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const stepRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const stepDotBase = style({
  display: 'inline-flex',
  height: '10px',
  width: '10px',
  flexShrink: 0,
  borderRadius: '50%',
})

export const stepDotDone = style({
  backgroundColor: vars.color.brand.success,
  boxShadow: `0 0 0 6px color-mix(in oklab, ${vars.color.brand.success} 16%, transparent)`,
})

export const stepDotActive = style({
  backgroundColor: vars.color.brand.warning,
  boxShadow: `0 0 0 6px color-mix(in oklab, ${vars.color.brand.warning} 16%, transparent)`,
  animation: 'pulse 2s infinite',
})

export const stepDotIdle = style({
  backgroundColor: 'rgb(255 255 255 / 0.22)',
})

export const stepTextBase = style({
  fontSize: vars.fontSize.sm,
  color: 'rgb(255 255 255 / 0.52)',
})

export const stepTextDone = style({
  color: 'rgb(255 255 255 / 0.94)',
  fontWeight: '600',
})

export const stepTextActive = style({
  color: 'rgb(255 255 255 / 0.94)',
  fontWeight: '700',
})

export const stepTextIdle = style({
  color: 'rgb(255 255 255 / 0.5)',
})

globalStyle(`${fieldInput}:-webkit-autofill`, {
  WebkitBoxShadow: `0 0 0 1000px ${vars.color.bg.panelElevated} inset`,
  WebkitTextFillColor: vars.color.text.primary,
  borderBottomColor: vars.color.brand.primary,
  caretColor: vars.color.text.primary,
})