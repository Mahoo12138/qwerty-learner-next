import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '../theme.css'

export const pageRoot = style({
	maxWidth: '1360px',
	margin: '0 auto',
	display: 'grid',
	gap: 'clamp(20px, 2.8vw, 28px)',
	padding: 'clamp(18px, 2.8vw, 34px)',
})

export const hero = style({
	position: 'relative',
	overflow: 'hidden',
	display: 'grid',
	gap: vars.space.xl,
	padding: 'clamp(22px, 3vw, 30px)',
	borderRadius: '32px',
	border: `1px solid color-mix(in oklab, ${vars.color.border.soft} 78%, transparent)`,
	background: `radial-gradient(circle at top right, color-mix(in oklab, ${vars.color.brand.secondary} 18%, transparent) 0, transparent 34%), linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 92%, ${vars.color.brand.accent} 8%) 0%, color-mix(in oklab, ${vars.color.bg.panel} 96%, ${vars.color.brand.primary} 4%) 100%)`,
	boxShadow: vars.shadow.md,
})

export const heroGrid = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1.45fr) minmax(280px, 0.95fr)',
	gap: 'clamp(18px, 2vw, 24px)',

	'@media': {
		'screen and (max-width: 980px)': {
			gridTemplateColumns: 'minmax(0, 1fr)',
		},
	},
})

export const heroCopy = style({
	display: 'grid',
	gap: vars.space.lg,
	alignContent: 'start',
})

export const heroIntro = style({
	display: 'grid',
	gap: vars.space.sm,
})

export const heroEyebrow = style({
	margin: 0,
	color: vars.color.text.muted,
	fontSize: vars.fontSize.xs,
	fontWeight: '700',
	letterSpacing: '0.12em',
	textTransform: 'uppercase',
})

export const heroTitle = style({
	margin: 0,
	maxWidth: '20ch',
	color: vars.color.text.primary,
	fontSize: 'clamp(28px, 4vw, 42px)',
	fontWeight: '850',
	letterSpacing: '-0.04em',
	lineHeight: 1.04,
})

export const heroDescription = style({
	margin: 0,
	maxWidth: '62ch',
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.8,
})

export const heroBadgeRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.sm,
})

export const filterRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.sm,
})

export const filterButton = style({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space.sm,
	minHeight: '40px',
	padding: '0 16px',
	borderRadius: '18px',
	border: `1px solid ${vars.color.border.soft}`,
	background: vars.color.bg.panelElevated,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	fontWeight: '650',
	cursor: 'pointer',
	transition: `all ${vars.motion.normal} ${vars.motion.easing}`,

	':hover': {
		borderColor: vars.color.border.focus,
		color: vars.color.text.primary,
		transform: 'translateY(-1px)',
	},
})

export const filterButtonActive = style([
	filterButton,
	{
		borderColor: vars.color.brand.primary,
		background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panelElevated})`,
		color: vars.color.brand.primary,
		boxShadow: vars.shadow.sm,
	},
])

export const statsGrid = style({
	display: 'grid',
	gap: vars.space.md,
	alignContent: 'start',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',

	'@media': {
		'screen and (max-width: 980px)': {
			gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		},
		'screen and (max-width: 720px)': {
			gridTemplateColumns: 'minmax(0, 1fr)',
		},
	},
})

export const statCard = style({
	display: 'grid',
	gap: vars.space.sm,
	padding: '18px',
	borderRadius: '24px',
	border: `1px solid ${vars.color.border.soft}`,
	background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 95%, ${vars.color.brand.secondary} 5%) 0%, ${vars.color.bg.panel} 100%)`,
	boxShadow: vars.shadow.sm,
})

export const statCardTop = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.sm,
})

export const statLabel = style({
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.xs,
	fontWeight: '700',
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
})

export const statIconWrap = style({
	display: 'grid',
	placeItems: 'center',
	width: '34px',
	height: '34px',
	borderRadius: '14px',
	background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panel})`,
	color: vars.color.brand.primary,
})

export const statValue = style({
	color: vars.color.text.primary,
	fontSize: 'clamp(26px, 3vw, 34px)',
	fontWeight: '850',
	letterSpacing: '-0.04em',
	lineHeight: 1,
})

export const statHint = style({
	margin: 0,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.6,
})

export const statusCard = style({
	display: 'grid',
	justifyItems: 'start',
	gap: vars.space.md,
	minHeight: '220px',
	padding: '24px',
	borderRadius: '28px',
	border: `1px solid ${vars.color.border.soft}`,
	background: vars.color.bg.panel,
	boxShadow: vars.shadow.sm,
	alignContent: 'center',
})

export const statusTitle = style({
	margin: 0,
	color: vars.color.text.primary,
	fontSize: vars.fontSize.xl,
	fontWeight: '800',
})

export const statusDescription = style({
	margin: 0,
	maxWidth: '48rem',
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.7,
})

export const contentGrid = style({
	display: 'grid',
	gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 0.82fr)',
	gap: 'clamp(18px, 2vw, 24px)',
	alignItems: 'start',

	'@media': {
		'screen and (max-width: 980px)': {
			gridTemplateColumns: 'minmax(0, 1fr)',
		},
	},
})

export const browseStack = style({
	display: 'grid',
	gap: 'clamp(18px, 2vw, 24px)',
})

export const sectionCard = style({
	display: 'grid',
	gap: vars.space.lg,
	padding: 'clamp(20px, 2.4vw, 24px)',
	borderRadius: '28px',
	border: `1px solid ${vars.color.border.soft}`,
	background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 95%, ${vars.color.brand.secondary} 5%) 0%, ${vars.color.bg.panel} 100%)`,
	boxShadow: vars.shadow.sm,
})

export const sectionHeader = style({
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	gap: vars.space.md,
	flexWrap: 'wrap',
})

export const sectionIntro = style({
	display: 'grid',
	gap: vars.space.xs,
	minWidth: 0,
})

export const sectionEyebrow = style({
	margin: 0,
	color: vars.color.text.muted,
	fontSize: vars.fontSize.xs,
	fontWeight: '700',
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
})

export const sectionTitle = style({
	margin: 0,
	color: vars.color.text.primary,
	fontSize: 'clamp(22px, 3vw, 28px)',
	fontWeight: '800',
	letterSpacing: '-0.03em',
})

export const sectionDescription = style({
	margin: 0,
	maxWidth: '56ch',
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.7,
})

export const sectionCount = style({
	display: 'inline-grid',
	placeItems: 'center',
	minWidth: '40px',
	height: '40px',
	paddingInline: '12px',
	borderRadius: vars.radius.pill,
	background: `color-mix(in oklab, ${vars.color.brand.primary} 12%, ${vars.color.bg.panel})`,
	color: vars.color.brand.primary,
	fontSize: vars.fontSize.sm,
	fontWeight: '800',
})

export const libraryRail = style({
	display: 'grid',
	gridAutoFlow: 'column',
	gridAutoColumns: 'minmax(260px, 320px)',
	gap: vars.space.md,
	overflowX: 'auto',
	overflowY: 'hidden',
	paddingBottom: vars.space.xs,
	scrollSnapType: 'x proximity',
	overscrollBehaviorX: 'contain',
	WebkitOverflowScrolling: 'touch',
})

globalStyle(`${libraryRail}::-webkit-scrollbar`, {
	height: '10px',
})

globalStyle(`${libraryRail}::-webkit-scrollbar-track`, {
	background: 'transparent',
})

globalStyle(`${libraryRail}::-webkit-scrollbar-thumb`, {
	borderRadius: '999px',
	background: `color-mix(in oklab, ${vars.color.border.default} 70%, transparent)`,
})

export const libraryCard = style({
	display: 'grid',
	gap: vars.space.md,
	minHeight: '238px',
	padding: '18px',
	borderRadius: '24px',
	border: `1px solid ${vars.color.border.soft}`,
	background: vars.color.bg.panelElevated,
	boxShadow: vars.shadow.sm,
	scrollSnapAlign: 'start',
})

export const libraryCardTop = style({
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	gap: vars.space.md,
})

export const libraryIconWrap = style({
	display: 'grid',
	placeItems: 'center',
	width: '44px',
	height: '44px',
	borderRadius: '16px',
	background: `color-mix(in oklab, ${vars.color.brand.secondary} 14%, ${vars.color.bg.panel})`,
	color: vars.color.brand.primary,
	flexShrink: 0,
})

export const badgeWrap = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'flex-end',
	gap: vars.space.xs,
})

export const libraryTitleBlock = style({
	display: 'grid',
	gap: vars.space.sm,
})

export const libraryTitle = style({
	margin: 0,
	color: vars.color.text.primary,
	fontSize: vars.fontSize.xl,
	fontWeight: '800',
	letterSpacing: '-0.03em',
	lineHeight: 1.2,
})

export const libraryDescription = style({
	margin: 0,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.7,
})

export const libraryMetaRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.sm,
	color: vars.color.text.muted,
	fontSize: vars.fontSize.xs,
	fontWeight: '700',
	letterSpacing: '0.04em',
	textTransform: 'uppercase',
})

export const cardFooter = style({
	display: 'grid',
	gap: vars.space.md,
	alignContent: 'end',
	marginTop: 'auto',
})

export const cardFootnote = style({
	margin: 0,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.6,
})

export const emptyState = style({
	display: 'grid',
	placeItems: 'center',
	gap: vars.space.sm,
	minHeight: '180px',
	padding: '24px',
	borderRadius: '24px',
	border: `1px dashed ${vars.color.border.default}`,
	background: `color-mix(in oklab, ${vars.color.bg.panelElevated} 82%, ${vars.color.bg.app})`,
	textAlign: 'center',
})

export const emptyTitle = style({
	margin: 0,
	color: vars.color.text.primary,
	fontSize: vars.fontSize.lg,
	fontWeight: '750',
})

export const emptyDescription = style({
	margin: 0,
	maxWidth: '34rem',
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.7,
})

export const subscriptionPanel = style({
	position: 'sticky',
	top: '92px',
	display: 'grid',
	gap: vars.space.lg,
	padding: 'clamp(20px, 2.4vw, 24px)',
	borderRadius: '28px',
	border: `1px solid ${vars.color.border.soft}`,
	background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.bg.panelElevated} 95%, ${vars.color.brand.accent} 5%) 0%, ${vars.color.bg.panel} 100%)`,
	boxShadow: vars.shadow.sm,

	'@media': {
		'screen and (max-width: 980px)': {
			position: 'static',
			top: 'auto',
		},
	},
})

export const subscriptionHeader = style({
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'space-between',
	gap: vars.space.md,
	flexWrap: 'wrap',
})

export const subscriptionIntro = style({
	display: 'grid',
	gap: vars.space.xs,
})

export const subscriptionList = style({
	display: 'grid',
	gap: vars.space.md,
})

export const subscriptionCard = style({
	display: 'grid',
	gap: vars.space.md,
	padding: '16px',
	borderRadius: '22px',
	border: `1px solid ${vars.color.border.soft}`,
	background: vars.color.bg.panelElevated,
	boxShadow: vars.shadow.sm,
})

export const subscriptionCardUnavailable = style([
	subscriptionCard,
	{
		borderColor: `color-mix(in oklab, ${vars.color.brand.warning} 42%, ${vars.color.border.default})`,
		background: `linear-gradient(180deg, color-mix(in oklab, ${vars.color.brand.warning} 10%, ${vars.color.bg.panelElevated}) 0%, ${vars.color.bg.panelElevated} 100%)`,
	},
])

export const subscriptionCardTop = style({
	display: 'flex',
	alignItems: 'flex-start',
	gap: vars.space.md,
})

export const subscriptionIconWrap = style({
	display: 'grid',
	placeItems: 'center',
	width: '40px',
	height: '40px',
	borderRadius: '14px',
	background: `color-mix(in oklab, ${vars.color.brand.primary} 10%, ${vars.color.bg.panel})`,
	color: vars.color.brand.primary,
	flexShrink: 0,
})

export const subscriptionTitleBlock = style({
	display: 'grid',
	gap: vars.space.xs,
	minWidth: 0,
})

export const subscriptionTitle = style({
	margin: 0,
	color: vars.color.text.primary,
	fontSize: vars.fontSize.lg,
	fontWeight: '800',
	letterSpacing: '-0.02em',
	lineHeight: 1.2,
})

export const subscriptionMetaRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.xs,
})

export const subscriptionDescription = style({
	margin: 0,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	lineHeight: 1.7,
})

export const subscriptionDetailRow = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.sm,
	color: vars.color.text.muted,
	fontSize: vars.fontSize.xs,
	fontWeight: '700',
	letterSpacing: '0.04em',
	textTransform: 'uppercase',
})

export const subscriptionActions = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: vars.space.md,
	flexWrap: 'wrap',
})

export const subscriptionStatus = style({
	display: 'inline-flex',
	alignItems: 'center',
	gap: vars.space.xs,
	color: vars.color.text.secondary,
	fontSize: vars.fontSize.sm,
	fontWeight: '600',
})