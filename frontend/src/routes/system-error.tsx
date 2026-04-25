import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/system-error')({
  component: SystemErrorPage,
})

function SystemErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-visible">
      {/* 右侧装饰图：桌面及宽屏可见，放在卡片侧面，不与卡片重叠 */}
      <img
        src="/images/error-doge.gif"
        alt="穿着宇航服的柴犬"
        className="hidden md:block pointer-events-none absolute right-6 bottom-6 z-0 w-[clamp(220px,50vmin,480px)] translate-x-6"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))' }}
      />

      <div className="relative z-10 w-full max-w-lg">
        <Card className="border-border/70 shadow-[var(--shadow-card)]">
          <CardHeader className="space-y-4 text-center">
            <div className="w-full flex items-center justify-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-7" strokeWidth={1.8} />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">系统暂时不可用</CardTitle>
              <CardDescription className="text-sm leading-6">
                当前系统存在问题，暂时无法完成初始化状态检查。请稍后再试。
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" onClick={() => window.location.reload()} className="sm:min-w-36">
              <RefreshCcw className="size-4" />
              重新加载
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/login' })} className="sm:min-w-36">
              返回登录页
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}