import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'

const drift = keyframes({
  '0%': { transform: 'translate3d(0, 0, 0)' },
  '50%': { transform: 'translate3d(0, -6px, 0)' },
  '100%': { transform: 'translate3d(0, 0, 0)' },
})

const riseIn = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translate3d(0, 24px, 0) scale(0.98)',
  },
  '100%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0) scale(1)',
  },
})

const laneSweep = keyframes({
  '0%': {
    transform: 'translate3d(-18%, 0, 0)',
    opacity: 0.12,
  },
  '50%': {
    opacity: 0.22,
  },
  '100%': {
    transform: 'translate3d(18%, 0, 0)',
    opacity: 0.12,
  },
})

export const page = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(1.5rem, 3vw, 2.5rem)',
  maxWidth: '86rem',
  margin: '0 auto',
  padding: 'clamp(1.25rem, 3vw, 2.75rem)',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-6rem auto auto -8rem',
      width: '22rem',
      height: '22rem',
      borderRadius: '999px',
      background: `radial-gradient(circle at center,
        color-mix(in oklab, ${vars.color.brand.primary} 22%, transparent),
        transparent 72%)`,
      opacity: 0.9,
      pointerEvents: 'none',
      filter: 'blur(8px)',
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '28rem -8rem auto auto',
      width: '18rem',
      height: '18rem',
      borderRadius: '999px',
      background: `radial-gradient(circle at center,
        color-mix(in oklab, ${vars.color.brand.secondary} 18%, transparent),
        transparent 74%)`,
      pointerEvents: 'none',
      filter: 'blur(10px)',
    },
  },
})

export const hero = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.72fr) minmax(20rem, 0.88fr)',
  gap: 'clamp(1rem, 2vw, 1.75rem)',
  padding: 'clamp(1.6rem, 4vw, 3rem)',
  borderRadius: '40px',
  overflow: 'hidden',
  background: `linear-gradient(126deg,
    color-mix(in oklab, ${vars.color.brand.primary} 72%, ${vars.color.bg.panelElevated}) 0%,
    color-mix(in oklab, ${vars.color.brand.primary} 56%, ${vars.color.brand.accent}) 24%,
    color-mix(in oklab, ${vars.color.brand.secondary} 54%, ${vars.color.bg.panel}) 68%,
    color-mix(in oklab, ${vars.color.brand.accent} 58%, ${vars.color.bg.panel}) 100%)`,
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 22%, transparent)`,
  boxShadow: '0 30px 64px -28px color-mix(in oklab, #000 34%, transparent)',
  animation: `${riseIn} 620ms ${vars.motion.easing}`,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '-8% auto auto -12%',
      width: '62%',
      height: '84%',
      background: `radial-gradient(circle at center,
        color-mix(in oklab, ${vars.color.brand.accent} 66%, transparent) 0%,
        transparent 70%)`,
      opacity: 0.84,
      pointerEvents: 'none',
      animation: `${drift} 8s ease-in-out infinite`,
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '18% -10% auto auto',
      width: '34rem',
      height: '11rem',
      backgroundImage: `repeating-linear-gradient(90deg,
        transparent 0,
        transparent 1rem,
        color-mix(in oklab, ${vars.color.text.inverse} 28%, transparent) 1rem,
        color-mix(in oklab, ${vars.color.text.inverse} 28%, transparent) 1.35rem)`,
      opacity: 0.5,
      transform: 'rotate(-12deg)',
      pointerEvents: 'none',
      animation: `${laneSweep} 9s linear infinite`,
    },
  },
  '@media': {
    '(max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
})

export const heroCopy = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1.15rem',
})

export const heroBadgeRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem',
})

export const heroBadge = style({
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.text.inverse} 16%, transparent),
    color-mix(in oklab, ${vars.color.brand.accent} 22%, transparent))`,
  color: vars.color.text.inverse,
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 28%, transparent)`,
  boxShadow: 'inset 0 0 0 1px color-mix(in oklab, #fff 8%, transparent)',
})

export const heroMeta = style({
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 82%, transparent)`,
})

export const heroTitle = style({
  margin: 0,
  fontFamily: vars.font.heading,
  fontSize: 'clamp(3.2rem, 7vw, 6.6rem)',
  lineHeight: 0.88,
  letterSpacing: '-0.08em',
  color: vars.color.text.inverse,
  textShadow: '0 8px 18px color-mix(in oklab, #000 22%, transparent)',
})

export const heroSubtitle = style({
  maxWidth: '42rem',
  margin: 0,
  fontSize: 'clamp(1.02rem, 1.7vw, 1.24rem)',
  lineHeight: 1.82,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 84%, transparent)`,
})

export const heroTape = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: '0.9rem',
  width: 'min(100%, 44rem)',
  padding: '0.9rem 1rem',
  borderRadius: '20px',
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.text.inverse} 18%, transparent),
    color-mix(in oklab, ${vars.color.brand.accent} 16%, transparent),
    color-mix(in oklab, ${vars.color.text.inverse} 10%, transparent))`,
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 24%, transparent)`,
  boxShadow: '0 14px 30px -24px color-mix(in oklab, #000 40%, transparent)',
  backdropFilter: 'blur(14px)',
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const heroTapeLead = style({
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.text.inverse} 72%, transparent)`,
})

export const heroTapeValue = style({
  fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
  fontWeight: '800',
  lineHeight: 1,
  color: vars.color.text.inverse,
})

export const heroTapeHint = style({
  justifySelf: 'end',
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 78%, transparent)`,
  '@media': {
    '(max-width: 720px)': {
      justifySelf: 'start',
    },
  },
})

export const heroTrackPanel = style({
  display: 'inline-grid',
  gap: '0.2rem',
  width: 'fit-content',
  padding: '0.7rem 0.95rem 0.85rem',
  borderRadius: '22px',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.text.inverse} 12%, transparent),
    color-mix(in oklab, ${vars.color.brand.primary} 12%, transparent))`,
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 24%, transparent)`,
})

export const heroTrackLabel = style({
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.text.inverse} 70%, transparent)`,
})

export const heroTrackValue = style({
  fontSize: 'clamp(1.3rem, 2.6vw, 2rem)',
  lineHeight: 1,
  fontWeight: '800',
  color: vars.color.text.inverse,
})

export const heroTrackNote = style({
  fontSize: vars.fontSize.sm,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 78%, transparent)`,
})

export const heroStats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '1rem',
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

globalStyle(`${heroStats} > *:nth-child(1)`, {
  transform: 'translateY(0.8rem)',
  '@media': {
    '(max-width: 860px)': {
      transform: 'none',
    },
  },
})

globalStyle(`${heroStats} > *:nth-child(2)`, {
  transform: 'translateY(2rem)',
  '@media': {
    '(max-width: 860px)': {
      transform: 'none',
    },
  },
})

globalStyle(`${heroStats} > *:nth-child(3)`, {
  transform: 'translateY(-0.4rem)',
  '@media': {
    '(max-width: 860px)': {
      transform: 'none',
    },
  },
})

export const highlightCard = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '0.45rem',
  minHeight: '9.6rem',
  padding: '1.1rem 1.15rem',
  borderRadius: '24px',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.text.inverse} 14%, transparent),
    color-mix(in oklab, ${vars.color.brand.primary} 14%, transparent))`,
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 18%, transparent)`,
  backdropFilter: 'blur(14px)',
  boxShadow: 'inset 0 1px 0 color-mix(in oklab, #fff 14%, transparent)',
})

export const highlightCardStrong = style([
  highlightCard,
  {
    background: `linear-gradient(135deg,
      color-mix(in oklab, ${vars.color.brand.accent} 38%, transparent),
      color-mix(in oklab, ${vars.color.text.inverse} 12%, transparent),
      color-mix(in oklab, ${vars.color.brand.primary} 22%, transparent))`,
    transform: 'translateY(-0.3rem) scale(1.02)',
  },
])

export const highlightLabel = style({
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.text.inverse} 70%, transparent)`,
})

export const highlightValue = style({
  fontSize: 'clamp(1.4rem, 2.8vw, 2.35rem)',
  lineHeight: 0.95,
  color: vars.color.text.inverse,
})

export const highlightHint = style({
  fontSize: vars.fontSize.sm,
  lineHeight: 1.5,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 78%, transparent)`,
})

export const highlightControlCard = style([
  highlightCard,
  {
    gap: '0.7rem',
    justifyContent: 'flex-start',
  },
])

export const highlightControlHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
})

export const highlightControlBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.7rem',
  padding: '0.15rem 0.6rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.text.inverse} 12%, transparent)`,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 82%, transparent)`,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})

export const highlightControlValueRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  minWidth: 0,
})

export const highlightControlIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.6rem',
  height: '2.6rem',
  flexShrink: 0,
  borderRadius: '18px',
  background: `color-mix(in oklab, ${vars.color.text.inverse} 14%, transparent)`,
  boxShadow: 'inset 0 1px 0 color-mix(in oklab, #fff 16%, transparent)',
})

export const highlightControlIcon = style({
  width: '1rem',
  height: '1rem',
  color: vars.color.text.inverse,
})

export const highlightControlValue = style({
  fontSize: 'clamp(1.35rem, 2.6vw, 2rem)',
  lineHeight: 1,
  letterSpacing: '-0.04em',
  color: vars.color.text.inverse,
  fontWeight: '800',
})

const highlightControlActionBase = style({
  display: 'grid',
  gap: '0.14rem',
  width: '100%',
  minHeight: '3.3rem',
  padding: '0.8rem 0.9rem',
  borderRadius: '18px',
  border: `1px solid color-mix(in oklab, ${vars.color.text.inverse} 18%, transparent)`,
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.text.inverse} 10%, transparent),
    color-mix(in oklab, ${vars.color.brand.primary} 10%, transparent))`,
  color: vars.color.text.inverse,
  textAlign: 'left',
})

export const highlightControlTrigger = style([
  highlightControlActionBase,
  {
    cursor: 'pointer',
    transition: `transform ${vars.motion.fast} ${vars.motion.easing}, border-color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}`,
    selectors: {
      '&:hover': {
        transform: 'translateY(-2px)',
        borderColor: `color-mix(in oklab, ${vars.color.text.inverse} 30%, transparent)`,
        background: `linear-gradient(180deg,
          color-mix(in oklab, ${vars.color.text.inverse} 12%, transparent),
          color-mix(in oklab, ${vars.color.brand.primary} 16%, transparent))`,
      },
      '&:disabled': {
        opacity: 0.55,
        cursor: 'not-allowed',
        transform: 'none',
      },
    },
  },
])

export const highlightControlTriggerLead = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  color: vars.color.text.inverse,
})

export const highlightControlTriggerText = style({
  fontSize: vars.fontSize.xs,
  lineHeight: 1.45,
  color: `color-mix(in oklab, ${vars.color.text.inverse} 76%, transparent)`,
})

export const highlightControlSelectTrigger = style([
  highlightControlActionBase,
  {
    alignItems: 'center',
    selectors: {
      '&[data-state="open"]': {
        borderColor: `color-mix(in oklab, ${vars.color.text.inverse} 28%, transparent)`,
      },
      '&:disabled': {
        opacity: 0.55,
      },
    },
  },
])

globalStyle(`${highlightControlSelectTrigger} > svg`, {
  color: `color-mix(in oklab, ${vars.color.text.inverse} 72%, transparent)`,
})

export const heroAside = style({
  position: 'relative',
  zIndex: 1,
  minHeight: '100%',
  borderRadius: '30px',
  overflow: 'hidden',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 88%, ${vars.color.brand.accent}),
    color-mix(in oklab, ${vars.color.bg.panel} 78%, ${vars.color.brand.secondary}))`,
  boxShadow: '0 22px 50px -28px color-mix(in oklab, #000 42%, transparent)',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 'auto -18% -16% auto',
      width: '12rem',
      height: '12rem',
      borderRadius: '999px',
      background: `radial-gradient(circle at center, color-mix(in oklab, ${vars.color.brand.primary} 36%, transparent), transparent 72%)`,
      animation: `${drift} 8s ease-in-out infinite`,
      pointerEvents: 'none',
    },
    '&::before': {
      content: '',
      position: 'absolute',
      inset: '1rem auto auto -20%',
      width: '120%',
      height: '1px',
      background: `linear-gradient(90deg,
        transparent,
        color-mix(in oklab, ${vars.color.brand.primary} 48%, transparent),
        transparent)`,
      opacity: 0.6,
    },
  },
})

export const heroAsideContent = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1rem',
  height: '100%',
  padding: '1.35rem',
})

export const heroAsideHeader = style({
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'space-between',
  gap: '1rem',
})

export const finishFlag = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.55rem',
  width: 'fit-content',
  padding: '0.55rem 0.75rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
})

export const heroAsideRank = style({
  fontSize: 'clamp(2.6rem, 4vw, 4rem)',
  lineHeight: 0.9,
  letterSpacing: '-0.08em',
  fontWeight: '900',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 84%, ${vars.color.text.primary})`,
})

export const finishFlagIcon = style({
  width: '1rem',
  height: '1rem',
  color: vars.color.brand.primary,
})

export const heroAsideValue = style({
  fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
  lineHeight: 0.9,
  letterSpacing: '-0.06em',
  color: vars.color.text.primary,
  fontWeight: '800',
})

export const heroAsideHint = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.65,
  color: vars.color.text.secondary,
})

export const heroAsideTrack = style({
  display: 'grid',
  gap: '0.55rem',
})

export const trackDash = style({
  display: 'block',
  width: '100%',
  height: '0.55rem',
  borderRadius: vars.radius.pill,
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.brand.primary} 74%, transparent),
    color-mix(in oklab, ${vars.color.brand.accent} 74%, transparent))`,
  opacity: 0.8,
})

export const controlBar = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.3fr) minmax(16rem, 0.72fr)',
  gap: 'clamp(1rem, 2vw, 1.6rem)',
  alignItems: 'start',
  padding: 'clamp(1rem, 2vw, 1.35rem)',
  borderRadius: '28px',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 92%, ${vars.color.brand.accent}),
    color-mix(in oklab, ${vars.color.bg.panel} 86%, ${vars.color.brand.secondary}))`,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 82%, ${vars.color.brand.primary})`,
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const controlMain = style({
  display: 'grid',
  gap: 'clamp(0.9rem, 1.4vw, 1.2rem)',
})

export const controlIntro = style({
  display: 'grid',
  gap: '0.45rem',
  maxWidth: '44rem',
})

export const controlEyebrow = style({
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.brand.primary} 76%, ${vars.color.text.secondary})`,
})

export const controlHeadingRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem 0.9rem',
})

export const controlTitle = style({
  margin: 0,
  fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
  lineHeight: 0.95,
  letterSpacing: '-0.04em',
  fontWeight: '850',
  color: vars.color.text.primary,
})

export const controlWindow = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '2rem',
  padding: '0.35rem 0.75rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.primary} 14%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
})

export const controlHint = style({
  margin: 0,
  maxWidth: '42rem',
  fontSize: vars.fontSize.sm,
  lineHeight: 1.65,
  color: vars.color.text.secondary,
})

export const metricSelectorCard = style({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: '1rem',
  alignItems: 'center',
  padding: '1.05rem 1.1rem 1.05rem 1.15rem',
  borderRadius: '24px',
  background: `linear-gradient(135deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 86%, ${vars.color.brand.primary}),
    color-mix(in oklab, ${vars.color.bg.panel} 82%, ${vars.color.brand.accent}))`,
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 80%, ${vars.color.brand.primary})`,
  overflow: 'hidden',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '0.9rem auto 0.9rem 0.9rem',
      width: '0.24rem',
      borderRadius: vars.radius.pill,
      background: `linear-gradient(180deg,
        color-mix(in oklab, ${vars.color.brand.primary} 70%, transparent),
        color-mix(in oklab, ${vars.color.brand.accent} 78%, transparent))`,
      opacity: 0.9,
    },
  },
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const metricSelectorSummary = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.9rem',
  minWidth: 0,
  paddingLeft: '0.7rem',
})

export const metricSelectorIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  flexShrink: 0,
  borderRadius: '18px',
  background: `color-mix(in oklab, ${vars.color.brand.primary} 16%, ${vars.color.bg.panelElevated})`,
  color: vars.color.brand.primary,
  boxShadow: 'inset 0 1px 0 color-mix(in oklab, #fff 16%, transparent)',
})

export const metricSelectorIcon = style({
  width: '1.15rem',
  height: '1.15rem',
})

export const metricSelectorCopy = style({
  display: 'grid',
  gap: '0.24rem',
  minWidth: 0,
})

export const metricSelectorLabel = style({
  fontSize: vars.fontSize.xs,
  lineHeight: 1.4,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const metricSelectorValueRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.45rem 0.7rem',
})

export const metricSelectorValue = style({
  fontSize: 'clamp(1.2rem, 2vw, 1.55rem)',
  lineHeight: 1,
  letterSpacing: '-0.04em',
  fontWeight: '850',
  color: vars.color.text.primary,
})

export const metricSelectorStatus = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.75rem',
  padding: '0.2rem 0.65rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 14%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
})

export const metricSelectorTrigger = style({
  display: 'grid',
  gap: '0.18rem',
  minWidth: '10rem',
  padding: '0.85rem 1rem',
  border: `1px solid color-mix(in oklab, ${vars.color.border.default} 86%, ${vars.color.brand.primary})`,
  borderRadius: '18px',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.text.inverse} 8%, transparent),
    color-mix(in oklab, ${vars.color.brand.primary} 12%, transparent))`,
  color: vars.color.text.primary,
  textAlign: 'left',
  cursor: 'pointer',
  transition: `transform ${vars.motion.fast} ${vars.motion.easing}, border-color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: vars.color.brand.primary,
      background: `linear-gradient(180deg,
        color-mix(in oklab, ${vars.color.text.inverse} 10%, transparent),
        color-mix(in oklab, ${vars.color.brand.primary} 16%, transparent))`,
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  '@media': {
    '(max-width: 720px)': {
      minWidth: 0,
    },
  },
})

export const metricSelectorTriggerLead = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const metricSelectorTriggerText = style({
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
  color: vars.color.text.secondary,
})

export const metricSheetContent = style({
  width: 'min(30rem, calc(100vw - 1rem))',
  gap: '1rem',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 94%, ${vars.color.brand.accent}),
    color-mix(in oklab, ${vars.color.bg.app} 92%, ${vars.color.brand.secondary}))`,
})

export const metricSheetHeader = style({
  gap: '0.55rem',
  paddingRight: '2rem',
})

export const metricSheetTitle = style({
  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
  letterSpacing: '-0.03em',
  color: vars.color.text.primary,
})

export const metricSheetSubtitle = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.65,
  color: vars.color.text.secondary,
})

export const metricSheetBody = style({
  display: 'grid',
  gap: '0.9rem',
  paddingTop: '0.25rem',
})

export const metricSheetList = style({
  display: 'grid',
  gap: '0.75rem',
})

const baseMetricSheetOption = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: '0.85rem',
  alignItems: 'start',
  width: '100%',
  padding: '1rem',
  borderRadius: '22px',
  border: `1px solid ${vars.color.border.soft}`,
  background: `linear-gradient(180deg, ${vars.color.bg.panelElevated}, ${vars.color.bg.panel})`,
  textAlign: 'left',
  cursor: 'pointer',
  transition: `transform ${vars.motion.fast} ${vars.motion.easing}, border-color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: vars.color.border.default,
      boxShadow: vars.shadow.sm,
    },
  },
})

export const metricSheetOption = baseMetricSheetOption

export const metricSheetOptionActive = style([
  baseMetricSheetOption,
  {
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 54%, ${vars.color.border.default})`,
    background: `linear-gradient(135deg,
      color-mix(in oklab, ${vars.color.brand.primary} 16%, ${vars.color.bg.panelElevated}),
      color-mix(in oklab, ${vars.color.brand.accent} 22%, ${vars.color.bg.panel}))`,
    boxShadow: vars.shadow.md,
  },
])

export const metricSheetOptionIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '16px',
  background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
  color: vars.color.brand.primary,
})

export const metricSheetOptionIcon = style({
  width: '1rem',
  height: '1rem',
})

export const metricSheetOptionCopy = style({
  display: 'grid',
  gap: '0.3rem',
  minWidth: 0,
})

export const metricSheetOptionTitleRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.45rem 0.6rem',
})

export const metricSheetOptionTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: '800',
  color: vars.color.text.primary,
})

export const metricSheetOptionTag = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.7rem',
  padding: '0.15rem 0.55rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 12%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
})

export const metricSheetOptionTagActive = style([
  metricSheetOptionTag,
  {
    background: `color-mix(in oklab, ${vars.color.brand.primary} 18%, ${vars.color.bg.panelElevated})`,
    color: vars.color.text.primary,
  },
])

export const metricSheetOptionMeta = style({
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
})

export const metricSheetEmpty = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
})

export const metricTabs = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'stretch',
})

const baseTab = style({
  position: 'relative',
  flex: '1 1 clamp(11rem, 18vw, 14rem)',
  display: 'inline-flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '0.75rem',
  minHeight: '4.6rem',
  padding: '1rem 1.1rem 1rem 1.2rem',
  borderRadius: '20px',
  clipPath: 'polygon(0.65rem 0, 100% 0, calc(100% - 0.65rem) 100%, 0 100%)',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
  color: vars.color.text.secondary,
  cursor: 'pointer',
  textAlign: 'left',
  transition: `transform ${vars.motion.fast} ${vars.motion.easing}, border-color ${vars.motion.fast} ${vars.motion.easing}, background-color ${vars.motion.fast} ${vars.motion.easing}, box-shadow ${vars.motion.fast} ${vars.motion.easing}`,
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: vars.color.border.default,
      background: vars.color.bg.panelElevated,
    },
    '&::after': {
      content: '',
      position: 'absolute',
      inset: '0.45rem auto 0.45rem 0.45rem',
      width: '0.22rem',
      borderRadius: vars.radius.pill,
      background: `linear-gradient(180deg,
        color-mix(in oklab, ${vars.color.brand.primary} 48%, transparent),
        color-mix(in oklab, ${vars.color.brand.accent} 58%, transparent))`,
      opacity: 0.5,
    },
  },
})

export const metricTab = baseTab

export const metricTabActive = style([
  baseTab,
  {
    background: `linear-gradient(135deg,
      color-mix(in oklab, ${vars.color.brand.primary} 20%, ${vars.color.bg.panelElevated}),
      color-mix(in oklab, ${vars.color.brand.accent} 30%, ${vars.color.bg.panel}),
      color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panel}))`,
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 48%, ${vars.color.border.default})`,
    color: vars.color.text.primary,
    boxShadow: vars.shadow.md,
    transform: 'translateY(-2px)',
  },
])

export const metricTabIcon = style({
  width: '1.05rem',
  height: '1.05rem',
  marginTop: '0.2rem',
})

export const metricTabBody = style({
  display: 'grid',
  gap: '0.2rem',
  minWidth: 0,
})

export const metricTabText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: '700',
  whiteSpace: 'nowrap',
})

export const metricTabMeta = style({
  fontSize: vars.fontSize.xs,
  lineHeight: 1.4,
  color: vars.color.text.muted,
})

export const periodControl = style({
  display: 'grid',
  gap: '0.75rem',
  alignContent: 'start',
  justifySelf: 'end',
  minWidth: 0,
  paddingLeft: 'clamp(0.9rem, 1.6vw, 1.2rem)',
  borderLeft: `1px solid color-mix(in oklab, ${vars.color.border.default} 74%, transparent)`,
  '@media': {
    '(max-width: 860px)': {
      justifySelf: 'stretch',
      paddingLeft: 0,
      paddingTop: '0.95rem',
      borderLeft: 'none',
      borderTop: `1px solid color-mix(in oklab, ${vars.color.border.default} 74%, transparent)`,
    },
  },
})

export const periodHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
})

export const periodLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  fontWeight: '700',
  letterSpacing: '0.04em',
})

export const periodBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.8rem',
  padding: '0.2rem 0.6rem',
  borderRadius: vars.radius.pill,
  background: `color-mix(in oklab, ${vars.color.brand.secondary} 16%, ${vars.color.bg.panelElevated})`,
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.xs,
  fontWeight: '700',
})

export const periodHint = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.6,
  color: vars.color.text.secondary,
})

export const periodTrigger = style({
  width: '100%',
  minWidth: '11rem',
  background: `linear-gradient(180deg, ${vars.color.bg.panelElevated}, ${vars.color.bg.panel})`,
  borderColor: vars.color.border.default,
})

export const banner = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.05rem 1.2rem',
  borderRadius: '28px',
  border: `1px solid color-mix(in oklab, ${vars.color.brand.warning} 34%, ${vars.color.border.default})`,
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.brand.warning} 20%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.accent} 12%, ${vars.color.bg.panel}))`,
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: '1fr',
      alignItems: 'flex-start',
    },
  },
})

export const bannerIconWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3rem',
  height: '3rem',
  borderRadius: '18px',
  background: `color-mix(in oklab, ${vars.color.brand.warning} 18%, ${vars.color.bg.panelElevated})`,
})

export const bannerIcon = style({
  width: '1.2rem',
  height: '1.2rem',
  color: vars.color.brand.warning,
})

export const bannerBody = style({
  display: 'grid',
  gap: '0.35rem',
})

export const bannerTitle = style({
  margin: 0,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const bannerText = style({
  margin: 0,
  color: vars.color.text.secondary,
  lineHeight: 1.6,
})

export const snapshotGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(16rem, 0.85fr)',
  gap: '1.15rem',
  '@media': {
    '(max-width: 920px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const myRankCard = style({
  position: 'relative',
  borderRadius: '28px',
  background: `linear-gradient(145deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, ${vars.color.brand.primary}),
    color-mix(in oklab, ${vars.color.bg.panel} 72%, ${vars.color.brand.accent}))`,
  overflow: 'hidden',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 'auto -10% -28% auto',
      width: '14rem',
      height: '14rem',
      borderRadius: '999px',
      background: `radial-gradient(circle at center,
        color-mix(in oklab, ${vars.color.brand.primary} 24%, transparent),
        transparent 74%)`,
      pointerEvents: 'none',
    },
  },
})

export const myRankContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
  padding: '1.4rem',
})

export const metricCard = style({
  borderRadius: '28px',
  background: `linear-gradient(180deg,
    ${vars.color.bg.panelElevated},
    color-mix(in oklab, ${vars.color.bg.panel} 90%, ${vars.color.brand.secondary}))`,
})

export const metricCardContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
  padding: '1.4rem',
})

export const cardEyebrow = style({
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const myRankMain = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: '1rem',
})

export const myRankValue = style({
  fontSize: 'clamp(3rem, 5vw, 5.4rem)',
  lineHeight: 0.9,
  letterSpacing: '-0.05em',
  fontWeight: '800',
  color: vars.color.text.primary,
})

export const myRankMetric = style({
  fontSize: 'clamp(1rem, 1.7vw, 1.25rem)',
  fontWeight: '600',
  color: vars.color.text.secondary,
})

export const profileRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.9rem',
})

export const inlineAvatar = style({
  width: '3rem',
  height: '3rem',
})

export const profileName = style({
  margin: 0,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const profileMeta = style({
  margin: '0.2rem 0 0',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const mutedCopy = style({
  margin: 0,
  color: vars.color.text.secondary,
  lineHeight: 1.7,
})

export const metricCardTitle = style({
  margin: 0,
  fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
  lineHeight: 1.02,
  color: vars.color.text.primary,
})

export const metricCardText = style({
  margin: 0,
  color: vars.color.text.secondary,
  lineHeight: 1.75,
})

export const metricChipRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.6rem',
})

export const metricChip = style({
  borderColor: vars.color.border.soft,
})

export const boardSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.15rem',
  padding: '1.2rem',
  borderRadius: '32px',
  background: `linear-gradient(180deg,
    color-mix(in oklab, ${vars.color.bg.panelElevated} 94%, ${vars.color.brand.accent}),
    color-mix(in oklab, ${vars.color.bg.panel} 88%, ${vars.color.brand.secondary}))`,
  border: `1px solid ${vars.color.border.soft}`,
})

export const sectionHeading = style({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap',
})

export const sectionEyebrow = style({
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: vars.color.text.muted,
})

export const sectionTitle = style({
  margin: '0.25rem 0 0',
  fontSize: 'clamp(1.35rem, 2vw, 1.9rem)',
  lineHeight: 1.05,
  color: vars.color.text.primary,
})

export const sectionHint = style({
  margin: 0,
  color: vars.color.text.muted,
})

export const podiumGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 0.92fr) minmax(0, 1.12fr) minmax(0, 0.92fr)',
  gap: '1rem',
  alignItems: 'end',
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

globalStyle(`${podiumGrid} > *:nth-child(1)`, {
  minHeight: '17.5rem',
  '@media': {
    '(max-width: 860px)': {
      minHeight: 'auto',
    },
  },
})

globalStyle(`${podiumGrid} > *:nth-child(2)`, {
  minHeight: '20.75rem',
  transform: 'translateY(-0.9rem)',
  '@media': {
    '(max-width: 860px)': {
      minHeight: 'auto',
      transform: 'none',
    },
  },
})

globalStyle(`${podiumGrid} > *:nth-child(3)`, {
  minHeight: '16.2rem',
  '@media': {
    '(max-width: 860px)': {
      minHeight: 'auto',
    },
  },
})

export const podiumCard = style({
  position: 'relative',
  borderRadius: '26px',
  overflow: 'hidden',
  background: `linear-gradient(180deg,
    ${vars.color.bg.panelElevated},
    color-mix(in oklab, ${vars.color.bg.panel} 88%, ${vars.color.brand.secondary}))`,
  boxShadow: '0 18px 42px -30px color-mix(in oklab, #000 36%, transparent)',
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 'auto -16% -22% auto',
      width: '9rem',
      height: '9rem',
      borderRadius: '999px',
      background: `radial-gradient(circle at center,
        color-mix(in oklab, ${vars.color.brand.accent} 18%, transparent),
        transparent 72%)`,
      pointerEvents: 'none',
    },
  },
})

export const podiumCardMine = style([
  podiumCard,
  {
    borderColor: `color-mix(in oklab, ${vars.color.brand.primary} 44%, ${vars.color.border.default})`,
  },
])

export const podiumContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '0.85rem',
  minHeight: '100%',
  padding: '1.25rem',
})

export const podiumHeader = style({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const podiumPlace = style({
  fontSize: vars.fontSize.sm,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: `color-mix(in oklab, ${vars.color.text.muted} 72%, ${vars.color.brand.primary})`,
})

export const podiumIcon = style({
  width: '1rem',
  height: '1rem',
  color: vars.color.brand.primary,
})

export const podiumAvatar = style({
  width: '4rem',
  height: '4rem',
})

export const podiumName = style({
  fontSize: 'clamp(1.15rem, 1.9vw, 1.55rem)',
  fontWeight: '800',
  color: vars.color.text.primary,
})

export const podiumScore = style({
  fontSize: 'clamp(1.55rem, 2.7vw, 2.4rem)',
  fontWeight: '800',
  color: vars.color.text.primary,
})

export const podiumMeta = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const tableShell = style({
  position: 'relative',
  borderRadius: '28px',
  overflow: 'hidden',
  border: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
  boxShadow: '0 24px 54px -38px color-mix(in oklab, #000 30%, transparent)',
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      backgroundImage: `linear-gradient(90deg, transparent 0, transparent calc(100% - 7rem), color-mix(in oklab, ${vars.color.brand.primary} 10%, transparent) calc(100% - 7rem), color-mix(in oklab, ${vars.color.brand.primary} 10%, transparent) 100%)`,
      pointerEvents: 'none',
      opacity: 0.8,
    },
  },
})

export const tableHeaderRow = style({
  display: 'grid',
  gridTemplateColumns: '6.5rem minmax(0, 1.4fr) minmax(9rem, 0.85fr) 8rem',
  gap: '1rem',
  padding: '1rem 1.25rem',
  fontSize: vars.fontSize.xs,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: vars.color.text.inverse,
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.brand.primary} 82%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.secondary} 72%, ${vars.color.bg.panelElevated}))`,
  '@media': {
    '(max-width: 760px)': {
      display: 'none',
    },
  },
})

export const tableBody = style({
  display: 'flex',
  flexDirection: 'column',
})

const baseRow = style({
  display: 'grid',
  gridTemplateColumns: '6.5rem minmax(0, 1.4fr) minmax(9rem, 0.85fr) 8rem',
  gap: '1rem',
  alignItems: 'center',
  padding: '1.05rem 1.25rem',
  borderTop: `1px solid ${vars.color.border.soft}`,
  background: vars.color.bg.panel,
  selectors: {
    '&:hover': {
      background: `linear-gradient(90deg,
        color-mix(in oklab, ${vars.color.brand.accent} 10%, ${vars.color.bg.panelElevated}),
        ${vars.color.bg.panelElevated})`,
    },
  },
  '@media': {
    '(max-width: 760px)': {
      gridTemplateColumns: '1fr',
      gap: '0.8rem',
    },
  },
})

export const tableRow = baseRow

export const tableRowMine = style([
  baseRow,
  {
    background: `linear-gradient(90deg,
      color-mix(in oklab, ${vars.color.brand.primary} 8%, ${vars.color.bg.panel}),
      ${vars.color.bg.panel})`,
  },
])

export const rankSlot = style({
  display: 'flex',
  alignItems: 'center',
})

export const rankBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '4.6rem',
  padding: '0.65rem 0.95rem',
  borderRadius: vars.radius.pill,
  background: `linear-gradient(90deg,
    color-mix(in oklab, ${vars.color.brand.secondary} 18%, ${vars.color.bg.panelElevated}),
    color-mix(in oklab, ${vars.color.brand.accent} 14%, ${vars.color.bg.panelElevated}))`,
  color: vars.color.text.secondary,
  fontWeight: '700',
})

export const rankBadgeHot = style([
  rankBadge,
  {
    background: `linear-gradient(90deg,
      color-mix(in oklab, ${vars.color.brand.primary} 42%, ${vars.color.bg.panelElevated}),
      color-mix(in oklab, ${vars.color.brand.accent} 44%, ${vars.color.bg.panelElevated}))`,
    color: vars.color.text.primary,
    boxShadow: '0 10px 20px -18px color-mix(in oklab, #000 48%, transparent)',
  },
])

export const userSlot = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
})

export const tableAvatar = style({
  width: '2.75rem',
  height: '2.75rem',
})

export const userName = style({
  margin: 0,
  fontWeight: '700',
  color: vars.color.text.primary,
})

export const userSubline = style({
  margin: '0.2rem 0 0',
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const valueSlot = style({
  fontWeight: '800',
  color: vars.color.text.primary,
})

export const updatedSlot = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
})

export const emptyTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: '700',
  color: vars.color.text.primary,
})