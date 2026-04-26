import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useRegister, useLogin } from '@/api/auth'
import { usePublicSystemSettings } from '@/api/settings'
import { ArrowRight, Loader2 } from 'lucide-react'
import * as s from '@/styles/pages/auth.css'

// ─── Keyboard Keycap decoration ───────────────────────────────────────────────

type KeyCapProps = {
  letter: string
  x: string
  y: string
  rotate?: number
  opacity?: number
  delay?: string
}

const KEY_SCATTER: KeyCapProps[] = [
  { letter: 'Q', x: '7%',  y: '12%', rotate: -8,  opacity: 0.44, delay: '0.0s' },
  { letter: 'W', x: '21%', y: '23%', rotate:  5,  opacity: 0.30, delay: '0.7s' },
  { letter: 'E', x: '68%', y: '9%',  rotate: 13,  opacity: 0.36, delay: '1.2s' },
  { letter: 'R', x: '82%', y: '28%', rotate: -7,  opacity: 0.48, delay: '0.2s' },
  { letter: 'T', x: '13%', y: '46%', rotate:  8,  opacity: 0.26, delay: '1.5s' },
  { letter: 'Y', x: '60%', y: '55%', rotate: -13, opacity: 0.28, delay: '0.9s' },
  { letter: 'U', x: '84%', y: '66%', rotate:  3,  opacity: 0.40, delay: '1.4s' },
  { letter: 'I', x: '38%', y: '74%', rotate: -9,  opacity: 0.32, delay: '1.0s' },
  { letter: 'O', x: '16%', y: '82%', rotate: 10,  opacity: 0.24, delay: '1.8s' },
  { letter: 'P', x: '74%', y: '85%', rotate: -4,  opacity: 0.38, delay: '0.5s' },
  { letter: 'Z', x: '48%', y: '19%', rotate:  6,  opacity: 0.34, delay: '1.1s' },
  { letter: 'X', x: '33%', y: '57%', rotate: -10, opacity: 0.28, delay: '0.6s' },
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

// ─── Main Component ────────────────────────────────────────────────────────────

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const login = useLogin()
  const publicSettings = usePublicSystemSettings(['system.owner_user_id'])

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  if (publicSettings.isLoading) return null

  if (publicSettings.isError) {
    navigate({ to: '/system-error', replace: true })
    return null
  }

  const ownerUserID = publicSettings.data?.['system.owner_user_id'] ?? ''
  if (!ownerUserID.trim()) {
    navigate({ to: '/register-admin', replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('两次输入的密码不一致'); return }
    if (password.length < 8) { setError('密码长度至少 8 位'); return }
    register.mutate(
      { username, email, password },
      {
        onSuccess: () => login.mutate(
          { username, password },
          {
            onSuccess: () => navigate({ to: '/' }),
            onError: () => navigate({ to: '/login' }),
          },
        ),
        onError: (err) => setError(err.message || '注册失败'),
      },
    )
  }

  const isPending = register.isPending || login.isPending

  return (
    <div className={s.root}>
      {/* ── Left: Brand Panel ───────────────────────────────────────────────── */}
      <div
        className={s.brandPanel}
        style={{
          background: 'linear-gradient(145deg, oklch(0.40 0.22 279) 0%, oklch(0.27 0.18 292) 100%)',
        }}
      >
        <div className={s.brandGlowA} />
        <div className={s.brandGlowB} />

        {KEY_SCATTER.map((k) => <KeyCap key={k.letter} {...k} />)}

        {/* Logo */}
        <div className={s.brandLogoRow}>
          <div className={s.brandLogoMark}>
            <KeyboardIcon color="white" />
          </div>
          <span className={s.brandLogoText}>TapType</span>
        </div>

        {/* Hero */}
        <div className={s.brandHero}>
          <div className={s.brandBadge}>
            <span
              className={s.brandBadgeDot}
              style={{ backgroundColor: '#34d399', animation: 'pulse 2s infinite' }}
            />
            加入训练社区
          </div>
          <h2 className={s.brandHeading}>
            从第一击<br />
            <span className={s.brandHeadingDim}>开始进步</span>
          </h2>
          <p className={s.brandSubtext}>
            创建账户，开启系统化打字训练，追踪 WPM、准确率与进步轨迹。
          </p>
        </div>

        {/* Stats */}
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

      {/* ── Right: Form Panel ───────────────────────────────────────────────── */}
      <div className={s.formPanel}>
        <div className={s.watermark} aria-hidden>QWERTYUIOP</div>

        {/* Mobile logo */}
        <div className={s.mobileLogo}>
          <div className={s.mobileLogoMark}>
            <KeyboardIcon />
          </div>
          <span className={s.mobileLogoText}>TapType</span>
        </div>

        <div className={s.formContainer}>
          {/* Heading */}
          <div className={s.formHeading}>
            <p className={s.formEyebrow}>Create Account</p>
            <h1 className={s.formTitle}>注册<br />账户</h1>
            <p className={s.formSubtitle}>填写信息，完成后将自动登录</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && <div className={s.errorMessage}>{error}</div>}

            {/* Identity group */}
            <div className={s.fieldGroup}>
              <div className={s.fieldWrap}>
                <label htmlFor="username" className={s.fieldLabel}>用户名</label>
                <input
                  id="username"
                  type="text"
                  className={s.fieldInput}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="3–20 位，字母数字下划线"
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="^[a-zA-Z0-9_]+$"
                />
              </div>
              <div className={s.fieldWrap}>
                <label htmlFor="email" className={s.fieldLabel}>邮箱</label>
                <input
                  id="email"
                  type="email"
                  className={s.fieldInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Security group */}
            <div className={s.fieldGroupGap}>
              <div className={s.fieldWrap}>
                <label htmlFor="password" className={s.fieldLabel}>密码</label>
                <input
                  id="password"
                  type="password"
                  className={s.fieldInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 位"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </div>
              <div className={s.fieldWrap}>
                <label htmlFor="confirmPassword" className={s.fieldLabel}>确认密码</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={s.fieldInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isPending} className={s.submitButton}>
              <span className={s.submitButtonLabel}>
                {register.isPending ? '注册中…' : login.isPending ? '自动登录中…' : '创建账户'}
              </span>
              <span className={s.submitButtonIconWrap}>
                {isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
              </span>
            </button>
          </form>

          <p className={s.footerText}>
            已有账户？{' '}
            <button
              type="button"
              className={s.footerLink}
              onClick={() => navigate({ to: '/login' })}
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
