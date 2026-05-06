import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { useThemeStore } from '@/stores/themeStore'
import { vars } from '@/styles/theme.css'

function Toaster({ ...props }: ToasterProps) {
  const dark = useThemeStore((s) => s.dark)

  return (
    <Sonner
      theme={dark ? 'dark' : 'light'}
      className="toaster group"
      style={
        {
          '--normal-bg': vars.color.bg.panelElevated,
          '--normal-text': vars.color.text.primary,
          '--normal-border': vars.color.border.default,
          '--success-bg': vars.color.bg.panelElevated,
          '--success-text': vars.color.brand.success,
          '--success-border': `color-mix(in oklab, ${vars.color.brand.success} 30%, ${vars.color.border.default})`,
          '--error-bg': vars.color.bg.panelElevated,
          '--error-text': vars.color.brand.danger,
          '--error-border': `color-mix(in oklab, ${vars.color.brand.danger} 30%, ${vars.color.border.default})`,
          '--warning-bg': vars.color.bg.panelElevated,
          '--warning-text': vars.color.brand.warning,
          '--warning-border': `color-mix(in oklab, ${vars.color.brand.warning} 30%, ${vars.color.border.default})`,
          '--info-bg': vars.color.bg.panelElevated,
          '--info-text': vars.color.brand.secondary,
          '--info-border': `color-mix(in oklab, ${vars.color.brand.secondary} 30%, ${vars.color.border.default})`,
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'font-sans! shadow-lg!',
          description: 'opacity-70!',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
