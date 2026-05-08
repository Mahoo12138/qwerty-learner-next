import { createRootRoute, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from '@/components/core/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/core/Avatar'
import { Separator } from '@/components/core/Separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/core/Sheet'
import {
  Brain,
  LayoutDashboard,
  Keyboard,
  BookOpen,
  Compass,
  BarChart3,
  AlertCircle,
  History,
  Target,
  Trophy,
  Award,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  loggedOutShell,
  loggedInShell,
  mobileHeader,
  mobileHeaderLogo,
  sidebar,
  sidebarCollapsed,
  practiceSidebarWrapper,
  practiceHitArea,
  practiceSidebar,
  sidebarLogoRow,
  sidebarLogoText,
  sidebarNav,
  sidebarFooter,
  userCard,
  userCardCentered,
  userName,
  userEmail,
  navActionsGrid,
  navLinkExpanded,
  navLinkCollapsed,
  navLinkActive,
  mainContent,
  mainContentGuest,
} from '@/styles/pages/root.css'
import { vars } from '@/styles/theme.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const accessToken = useAuthStore((s) => s.accessToken)
  const navigate = useNavigate()
  const location = useLocation()
  const dark = useThemeStore((s) => s.dark)
  const toggleTheme = useThemeStore((s) => s.toggle)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (!user?.avatar_media_id) {
      return
    }

    const abortController = new AbortController()
    let objectUrl = ''

    const loadAvatar = async () => {
      try {
        const response = await fetch(`/api/v1/media/${user.avatar_media_id}`, {
          method: 'GET',
          credentials: 'include',
          signal: abortController.signal,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
        if (!response.ok) throw new Error('加载头像失败')
        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        setAvatarUrl(objectUrl)
      } catch {
        setAvatarUrl('')
      }
    }

    void loadAvatar()

    return () => {
      abortController.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [accessToken, user?.avatar_media_id])

  const avatarSrc = user?.avatar_media_id ? avatarUrl : ''

  const isPracticeRoute = location.pathname === '/practice' || location.pathname.startsWith('/practice/')

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const handleNav = (to: string) => {
    setSidebarOpen(false)
    navigate({ to })
  }

  return (
    <div className={user ? loggedInShell : loggedOutShell}>
      {user && (
        <header className={mobileHeader}>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger
              aria-label="打开导航"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: vars.radius.sm,
                border: 'none',
                background: 'transparent',
                color: vars.color.text.secondary,
                cursor: 'pointer',
              }}
            >
              <Menu style={{ width: '20px', height: '20px' }} />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <div style={{ display: 'flex', alignItems: 'center', gap: vars.space.sm }}>
                    <Keyboard style={{ width: '16px', height: '16px', color: vars.color.brand.primary }} />
                    <span style={{ fontSize: vars.fontSize.sm, color: vars.color.text.muted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>TapType</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <MobileSidebar
                user={user}
                dark={dark}
                avatarUrl={avatarSrc}
                onNav={handleNav}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
              />
            </SheetContent>
          </Sheet>
          <Keyboard style={{ width: '16px', height: '16px', color: vars.color.brand.primary }} />
          <span className={mobileHeaderLogo}>TapType</span>
        </header>
      )}

      {user && (
        isPracticeRoute ? (
          <div className={clsx(practiceSidebarWrapper, 'practice-sidebar-group')}>
            <div className={practiceHitArea} aria-hidden="true" />
            <aside className={practiceSidebar}>
              <div className={sidebarLogoRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: vars.space.sm }}>
                  <Keyboard style={{ width: '16px', height: '16px', color: vars.color.brand.primary }} />
                  <span className={sidebarLogoText}>TapType</span>
                </div>
                <Button variant="ghost" size="icon" aria-label="收起侧边栏" title="练习时侧边栏悬浮显示">
                  <PanelLeftClose style={{ width: '16px', height: '16px' }} />
                </Button>
              </div>
              <Separator />
              <DesktopSidebar
                user={user}
                dark={dark}
                avatarUrl={avatarSrc}
                collapsed={false}
                onNav={handleNav}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
                onToggleCollapse={() => setDesktopSidebarCollapsed((value) => !value)}
              />
            </aside>
          </div>
        ) : (
          <aside className={desktopSidebarCollapsed ? sidebarCollapsed : sidebar}>
            <div className={sidebarLogoRow}>
              {desktopSidebarCollapsed ? (
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Keyboard style={{ width: '16px', height: '16px', color: vars.color.brand.primary }} />
                </div>
              ) : (
                <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: vars.space.sm, paddingLeft: vars.space.xs }}>
                  <Keyboard style={{ width: '16px', height: '16px', flexShrink: 0, color: vars.color.brand.primary }} />
                  <span className={sidebarLogoText}>TapType</span>
                </div>
              )}
            </div>
            <Separator />
            <DesktopSidebar
              user={user}
              dark={dark}
              avatarUrl={avatarSrc}
              collapsed={desktopSidebarCollapsed}
              onNav={handleNav}
              onLogout={handleLogout}
              onToggleTheme={toggleTheme}
              onToggleCollapse={() => setDesktopSidebarCollapsed((value) => !value)}
            />
          </aside>
        )
      )}

      <main className={user ? mainContent : mainContentGuest}>
        <Outlet />
      </main>
    </div>
  )
}

function NavLink({
  to,
  label,
  icon: Icon,
  onNav,
  collapsed = false,
}: {
  to: string
  label: string
  icon: LucideIcon
  onNav: (to: string) => void
  collapsed?: boolean
}) {
  const location = useLocation()
  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <button
      onClick={() => onNav(to)}
      title={label}
      aria-label={label}
      className={clsx(
        collapsed ? navLinkCollapsed : navLinkExpanded,
        active && navLinkActive,
      )}
    >
      <Icon style={{ width: '18px', height: '18px', flexShrink: 0, strokeWidth: 1.8 }} />
      {!collapsed && <span>{label}</span>}
    </button>
  )
}

function DesktopSidebar({
  user,
  dark,
  avatarUrl,
  collapsed,
  onNav,
  onLogout,
  onToggleTheme,
  onToggleCollapse,
}: {
  user: { username: string; nickname: string; email: string }
  dark: boolean
  avatarUrl: string
  collapsed: boolean
  onNav: (to: string) => void
  onLogout: () => void
  onToggleTheme: () => void
  onToggleCollapse: () => void
}) {
  return (
    <>
      <nav className={sidebarNav}>
        <NavLink to="/" label="仪表盘" icon={LayoutDashboard} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/practice" label="打字练习" icon={Keyboard} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/content" label="内容管理" icon={BookOpen} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/discover" label="发现内容" icon={Compass} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/vocabulary" label="词汇量" icon={Brain} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/history" label="练习记录" icon={History} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/errors" label="错题集" icon={AlertCircle} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/goals" label="每日目标" icon={Target} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/leaderboard" label="排行榜" icon={Trophy} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/achievements" label="成就" icon={Award} onNav={onNav} collapsed={collapsed} />
        <NavLink to="/settings" label="设置" icon={Settings} onNav={onNav} collapsed={collapsed} />
      </nav>

      <Separator />
      <div className={sidebarFooter}>
        <div className={collapsed ? userCardCentered : userCard}>
          <Avatar>
            <AvatarImage src={avatarUrl} alt={(user.nickname || user.username)} />
            <AvatarFallback delayMs={0}>{(user.nickname || user.username)?.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className={userName}>{user.nickname || user.username}</p>
              <p className={userEmail}>{user.email}</p>
            </div>
          )}
        </div>
        {collapsed ? (
          <Button onClick={onToggleCollapse} variant="ghost" size="icon" aria-label="展开侧边栏" title="展开侧边栏" style={{ width: '100%' }}>
            <PanelLeftOpen style={{ width: '16px', height: '16px' }} />
          </Button>
        ) : (
          <div className={navActionsGrid}>
            <Button onClick={onToggleTheme} variant="outline" style={{ justifyContent: 'flex-start' }} title={dark ? '切换到浅色模式' : '切换到深色模式'}>
              {dark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
              {dark ? '浅色' : '深色'}
            </Button>
            <Button onClick={onLogout} variant="outline" style={{ justifyContent: 'flex-start' }} title="退出登录">
              <LogOut style={{ width: '16px', height: '16px' }} />
              退出
            </Button>
            <Button onClick={onToggleCollapse} variant="outline" style={{ gridColumn: 'span 2', justifyContent: 'flex-start' }}>
              <PanelLeftClose style={{ width: '16px', height: '16px' }} />
              收起侧边栏
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

function MobileSidebar({
  user,
  dark,
  avatarUrl,
  onNav,
  onLogout,
  onToggleTheme,
}: {
  user: { username: string; nickname: string; email: string }
  dark: boolean
  avatarUrl: string
  onNav: (to: string) => void
  onLogout: () => void
  onToggleTheme: () => void
}) {
  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <nav className={sidebarNav}>
        <NavLink to="/" label="仪表盘" icon={LayoutDashboard} onNav={onNav} />
        <NavLink to="/practice" label="打字练习" icon={Keyboard} onNav={onNav} />
        <NavLink to="/content" label="内容管理" icon={BookOpen} onNav={onNav} />
        <NavLink to="/discover" label="发现内容" icon={Compass} onNav={onNav} />
        <NavLink to="/vocabulary" label="词汇量" icon={Brain} onNav={onNav} />
        <NavLink to="/history" label="练习记录" icon={History} onNav={onNav} />
        <NavLink to="/analysis" label="数据分析" icon={BarChart3} onNav={onNav} />
        <NavLink to="/errors" label="错题集" icon={AlertCircle} onNav={onNav} />
        <NavLink to="/goals" label="每日目标" icon={Target} onNav={onNav} />
        <NavLink to="/leaderboard" label="排行榜" icon={Trophy} onNav={onNav} />
        <NavLink to="/achievements" label="成就" icon={Award} onNav={onNav} />
        <NavLink to="/settings" label="设置" icon={Settings} onNav={onNav} />
      </nav>
      <Separator />
      <div className={sidebarFooter}>
        <div className={userCard}>
          <Avatar>
            <AvatarImage src={avatarUrl} alt={(user.nickname || user.username)} />
            <AvatarFallback delayMs={0}>{(user.nickname || user.username)?.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <p className={userName}>{user.nickname || user.username}</p>
            <p className={userEmail}>{user.email}</p>
          </div>
        </div>
        <Button onClick={onToggleTheme} variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
          {dark ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
          {dark ? '浅色' : '深色'}
        </Button>
        <Button onClick={onLogout} variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut style={{ width: '16px', height: '16px' }} />
          退出
        </Button>
      </div>
    </div>
  )
}
