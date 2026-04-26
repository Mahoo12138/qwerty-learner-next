import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin } from '@/api/auth'
import { usePublicSystemSettings } from '@/api/settings'
import { useAuthStore } from '@/stores/authStore'
import { ArrowRight, Loader2 } from 'lucide-react'
import * as s from '@/styles/pages/auth.css'

type KeyCapProps = {
  letter: string
  x: string
  y: string
  rotate?: number
  opacity?: number
  delay?: string
}

const KEY_SCATTER: KeyCapProps[] = [
  { letter: 'A', x: '8%',  y: '11%', rotate: -10, opacity: 0.50, delay: '0.0s' },
  { letter: 'S', x: '24%', y: '20%', rotate:   6, opacity: 0.32, delay: '0.6s' },
  { letter: 'D', x: '66%', y: '7%',  rotate:  14, opacity: 0.38, delay: '1.1s' },
  { letter: 'F', x: '80%', y: '26%', rotate:  -6, opacity: 0.52, delay: '0.3s' },
  { letter: 'G', x: '11%', y: '43%', rotate:   9, opacity: 0.28, delay: '1.6s' },
  { letter: 'H', x: '57%', y: '53%', rotate: -14, opacity: 0.30, delay: '0.8s' },
  { letter: 'J', x: '82%', y: '64%', rotate:   4, opacity: 0.42, delay: '1.3s' },
  { letter: 'K', x: '36%', y: '71%', rotate:  -8, opacity: 0.34, delay: '0.9s' },
  { letter: 'L', x: '14%', y: '80%', rotate:  11, opacity: 0.26, delay: '1.9s' },
  { letter: 'W', x: '71%', y: '83%', rotate:  -5, opacity: 0.40, delay: '0.4s' },
  { letter: 'E', x: '46%', y: '17%', rotate:   7, opacity: 0.36, delay: '1.2s' },
  { letter: 'R', x: '31%', y: '54%', rotate: -11, opacity: 0.30, delay: '0.7s' },
]

function KeyCap({ letter, x, y, rotate = 0, opacity = 0.4, delay = '0s' }: KeyCapProps) {
  return (
    <div className={s.keycapOuter} style={{ left: x, top: y }}>
      <div
        className={s.keycapInner}
        style={{ rotate: `${rotate}deg`, opacity, animationDelay: delay }}
      >
        {letter}
      </div>
    </div>
  )
}

function KeyboardIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 15h.01M18 15h.01M10 15h4" />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const login = useLogin()
  const publicSettings = usePublicSystemSettings(['system.owner_user_id'])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) { navigate({ to: '/' }); return null }
  if (publicSettings.isLoading) return null
  if (publicSettings.isError) { navigate({ to: '/system-error', replace: true }); return null }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    login.mutate(
      { username, password },
      {
        onSuccess: () => navigate({ to: '/' }),
        onError: (err) => setError(err.message || '登录失败，请检查用户名和密码'),
      },
    )
  }

  return (
    <div className={s.root}>
      <div
        className={s.brandPanel}
        style={{ background: 'linear-gradient(145deg, oklch(0.40 0.22 279) 0%, oklch(0.27 0.18 292) 100%)' }}
      >
        <div className={s.brandGlowA} />
        <div className={s.brandGlowB} />

        {KEY_SCATTER.map((k) => <KeyCap key={k.letter} {...k} />)}

        <div className={s.brandLogoRow}>
          <div className={s.brandLogoMark}>
            <KeyboardIcon color="white" />
          </div>
          <span className={s.brandLogoText}>TapType</span>
        </div>

        <div className={s.brandHero}>
          <div className={s.brandBadge}>
            <span className={s.brandBadgeDot} style={{ backgroundColor: '#34d399' }} />
            每日训练，精准提升
          </div>
          <h2 className={s.brandHeading}>
            指尖流淌<br />
            <span className={s.brandHeadingDim}>文字力量</span>
          </h2>
          <p className={s.brandSubtext}>
            通过系统化打字训练，追踪你的 WPM、准确率和进步轨迹。
          </p>
        </div>

        <div className={s.brandFooter}>
          <div className={s.brandStats}>
            {[
              { label: '词汇量', value: '10K+' },
              { label: '练习文章', value: '500+' },
              { label: '练习模式', value: '4 种' },
            ].map(({ label, value }) => (
              <div key={label} className={s.brandStatItem}>
                <span className={s.brandStatValue}>{value}</span>
                <span className={s.brandStatLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.formPanel}>
        <div className={s.watermark} aria-hidden>ASDFGHJKL</div>

        <div className={s.mobileLogo}>
          <div className={s.mobileLogoMark}>
            <KeyboardIcon />
          </div>
          <span className={s.mobileLogoText}>TapType</span>
        </div>

        <div className={s.formContainer}>
          <div className={s.formHeading}>
            <p className={s.formEyebrow}>Welcome back</p>
            <h1 className={s.formTitle}>欢迎<br />回来</h1>
            <p className={s.formSubtitle}>登录账户，开始今天的训练</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className={s.errorMessage}>{error}</div>}

            <div className={s.fieldGroup}>
              <div className={s.fieldWrap}>
                <label htmlFor="username" className={s.fieldLabel}>用户名</label>
                <input
                  id="username"
                  type="text"
                  className={s.fieldInput}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名或邮箱"
                  autoComplete="username"
                  required
                />
              </div>
              <div className={s.fieldWrap}>
                <label htmlFor="password" className={s.fieldLabel}>密码</label>
                <input
                  id="password"
                  type="password"
                  className={s.fieldInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={login.isPending} className={s.submitButton}>
              <span className={s.submitButtonLabel}>
                {login.isPending ? '登录中…' : '登录账户'}
              </span>
              <span className={s.submitButtonIconWrap}>
                {login.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
              </span>
            </button>
          </form>

          <p className={s.footerText}>
            还没有账户？{' '}
            <button
              type="button"
              className={s.footerLink}
              onClick={() => navigate({ to: '/register' })}
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
