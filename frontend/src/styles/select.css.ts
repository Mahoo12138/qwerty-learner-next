import { style, keyframes, globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

const popIn = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px) scale(0.97)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

export const selectTrigger = style({
  display: "flex",
  height: "40px",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1.5px solid ${vars.color.border.default}`,
  backgroundColor: vars.color.bg.panelElevated,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.sm,
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
  cursor: "pointer",
  outline: "none",
  transitionProperty: "border-color, box-shadow",
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,

  ":hover": {
    borderColor: vars.color.border.strong,
  },

  selectors: {
    '&[data-state="open"]': {
      borderColor: vars.color.border.focus,
      boxShadow: vars.shadow.focusRing,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
    },
  },
});

globalStyle(`${selectTrigger} > svg`, {
  flexShrink: "0",
  color: vars.color.text.muted,
});

export const selectContent = style({
  position: "relative",
  zIndex: 50,
  minWidth: "8rem",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.soft}`,
  backgroundColor: vars.color.bg.panelElevated,
  color: vars.color.text.primary,
  boxShadow: vars.shadow.md,
  animation: `${popIn} 150ms ${vars.motion.easing} both`,
});

export const selectViewport = style({
  padding: vars.space.xs,
});

export const selectItem = style({
  position: "relative",
  display: "flex",
  width: "100%",
  cursor: "default",
  userSelect: "none",
  alignItems: "center",
  borderRadius: vars.radius.sm,
  paddingTop: "6px",
  paddingBottom: "6px",
  paddingLeft: vars.space.sm,
  paddingRight: vars.space["2xl"],
  fontSize: vars.fontSize.sm,
  color: vars.color.text.primary,
  outline: "none",
  transitionProperty: "background-color, color",
  transitionDuration: vars.motion.fast,
  transitionTimingFunction: vars.motion.easing,

  selectors: {
    "&[data-highlighted]": {
      backgroundColor: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panel})`,
      color: vars.color.brand.primary,
    },
    "&[data-disabled]": {
      pointerEvents: "none",
      opacity: "0.5",
    },
  },
});

export const selectItemIndicator = style({
  position: "absolute",
  right: vars.space.sm,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.brand.primary,
});

export const selectScrollButton = style({
  display: "flex",
  cursor: "default",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px",
  color: vars.color.text.muted,
});
