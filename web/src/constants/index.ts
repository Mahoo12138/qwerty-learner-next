export const EXPLICIT_SPACE = '␣'

export const CHAPTER_LENGTH = 20

export const DISMISS_START_CARD_DATE_KEY = 'dismissStartCardDate'

export const DONATE_DATE = 'donateDate'

export const CONFETTI_DEFAULTS = {
  colors: ['#5D8C7B', '#F2D091', '#F2A679', '#D9695F', '#8C4646'],
  shapes: ['square'],
  ticks: 500,
} as confetti.Options

export const defaultFontSizeConfig = {
  foreignFont: 48,
  translateFont: 18,
}

export const menuItems = [
  { path: '/', icon: 'Home', label: '首页' },
  { path: '/profile', icon: 'Profile', label: '我的' },
  { path: '/dictionary', icon: 'Book', label: '词库' },
  { path: '/mistake', icon: 'AlertCircle', label: '错题本' },
  { path: '/statistic', icon: 'BarChart2', label: '统计' },
  { path: '/setting', icon: 'Settings', label: '设置' },
] as const;

export const tabItems = 
[
  { path: '/setting/preference', icon: 'Home', label: '偏好设置' },
  { path: '/setting/system', icon: 'Home', label: '系统设置' },
  { path: '/setting/dictionary', icon: 'Book', label: '词库管理' },
  { path: '/setting/member', icon: 'AlertCircle', label: '成员管理' },
  { path: '/setting/sso', icon: 'BarChart2', label: '单点登录' },
] as const;


