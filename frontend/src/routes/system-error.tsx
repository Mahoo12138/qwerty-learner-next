import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/Card'
import { vars } from '@/styles/theme.css'

export const Route = createFileRoute('/system-error')({
  component: SystemErrorPage,
})

function SystemErrorPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `40px ${vars.space.lg}`,
        overflow: 'visible',
      }}
    >
      <img
        src="/images/error-doge.gif"
        alt="穿着宇航服的柴犬"
        style={{
          position: 'absolute',
          right: '24px',
          bottom: '24px',
          zIndex: 0,
          width: 'clamp(220px,50vmin,480px)',
          transform: 'translateX(24px)',
          pointerEvents: 'none',
          display: 'block',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '32rem' }}>
        <Card>
          <CardHeader style={{ gap: vars.space.lg, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  width: '56px',
                  height: '56px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: vars.radius.lg,
                  backgroundColor: `color-mix(in oklab, ${vars.color.brand.danger} 10%, ${vars.color.bg.panel})`,
                  color: vars.color.brand.danger,
                }}
              >
                <AlertTriangle style={{ width: '28px', height: '28px' }} strokeWidth={1.8} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.sm }}>
              <CardTitle>系统暂时不可用</CardTitle>
              <CardDescription>
                当前系统存在问题，暂时无法完成初始化状态检查。请稍后再试。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
            <Button type="button" onClick={() => window.location.reload()}>
              <RefreshCcw style={{ width: '16px', height: '16px' }} />
              重新加载
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/login' })}>
              返回登录页
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}