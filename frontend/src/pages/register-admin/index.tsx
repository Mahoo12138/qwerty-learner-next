import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useLogin, useRegisterInitialAdmin } from '@/api/auth'
import { usePublicSystemSettings } from '@/api/settings'
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import * as s from '@/styles/pages/auth.css'

function CrownIcon({ color = 'currentColor', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      <path d="M2 20h20" />
      <path d="M2 20l3-10 5 6 2-8 2 8 5-6 3 10" />
    </svg>
  )
}

const AMBIENT_KEYS = [
  { letter: '1', x: '6%',  y: '8%',  rotate: -5, opacity: 0.35 },
  { letter: '9', x: '88%', y: '14%', rotate:  8, opacity: 0.28 },
  { letter: '5', x: '48%', y: '4%',  rotate: -3, opacity: 0.20 },
  { letter: '0', x: '76%', y: '82%', rotate:  6, opacity: 0.25 },
  { letter: '3', x: '12%', y: '88%', rotate: -9, opacity: 0.22 },
]

const STEPS = ['系统检测', '创建站长', '完成初始化']

export function RegisterAdminPage() {
  const navigate = useNavigate()
  const registerAdmin = useRegisterInitialAdmin()
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
  if (publicSettings.isSuccess && ownerUserID.trim()) {
    navigate({ to: '/login', replace: true })
    return null
  }

  const currentStep = publicSettings.isLoading ? 0 : registerAdmin.isPending ? 1 : login.isPending ? 2 : 1
  const isPending = registerAdmin.isPending || login.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('两次输入的密码不一致'); return }
    if (password.length < 8) { setError('密码长度至少 8 位'); return }
    registerAdmin.mutate(
      { username, email, password },
      {
        onSuccess: () => login.mutate(
          { username, password },
          {
            onSuccess: () => navigate({ to: '/' }),
            onError: () => navigate({ to: '/login' }),
          },
        ),
        onError: (err) => setError(err.message || '站长注册失败'),
      },
    )
  }

  return (
    <div className={s.root}>
      <div
        className={s.brandPanel}
        style={{ background: 'linear-gradient(150deg, oklch(0.38 0.19 40) 0%, oklch(0.26 0.16 20) 100%)' }}
      >
        <div className={s.brandGlowA} />
        <div className={s.brandGlowB} />

        {AMBIENT_KEYS.map((k) => (
          <div key={k.letter} className={s.keycapOuter} style={{ left: k.x, top: k.y }}>
            <div className={s.keycapInner} style={{ rotate: `${k.rotate}deg`, opacity: k.opacity }}>
              {k.letter}
            </div>
          </div>
        ))}

        <div className={s.brandLogoRow}>
          <div className={s.brandLogoMark}>
            <CrownIcon color="white" size={16} />
          </div>
          <span className={s.brandLogoText}>TapType</span>
        </div>

        <div className={s.brandHero}>
          <div className={s.brandBadge}>
            <span className={s.brandBadgeDot} style={{ backgroundColor: '#fbbf24' }} />
            首次启动
          </div>
          <h2 className={s.brandHeading}>
            奠基<br />
            <span className={s.brandHeadingDim}>你的站点</span>
          </h2>
          <p className={s.brandSubtext}>
            系统尚未初始化。创建第一个站长账户后，你将拥有对 TapType 的完整管理权限。
          </p>
        </div>

        <div className={s.brandFooter}>
          <p className={s.stepsLabel}>初始化步骤</p>
          <div className={s.stepsList}>
            {STEPS.map((label, i) => (
              <div key={label} className={s.stepRow}>
                <span className={[s.stepDotBase, i < currentStep ? s.stepDotDone : i === currentStep ? s.stepDotActive : s.stepDotIdle].join(' ')} />
                <span className={[s.stepTextBase, i < currentStep ? s.stepTextDone : i === currentStep ? s.stepTextActive : s.stepTextIdle].join(' ')}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.formPanel}>
        <div className={s.watermark} aria-hidden>ADMIN</div>

        <div className={s.mobileLogo}>
          <div className={s.mobileLogoMark}>
            <CrownIcon size={16} />
          </div>
          <span className={s.mobileLogoText}>TapType</span>
        </div>

        <div className={s.formContainer}>
          <div style={{ marginBottom: '32px' }}>
            <p className={s.formEyebrow}>Initial Setup</p>
            <h1 className={s.formTitle}>站长<br />注册</h1>
            <p className={s.formSubtitle}>系统首次初始化，仅需执行一次</p>
          </div>

          <div className={s.noticeBanner}>
            <ShieldCheck className={s.noticeBannerIcon} />
            <span>系统检测到当前没有任何用户，请先完成站长注册后再使用网站。</span>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className={s.errorMessage}>{error}</div>}

            <div className={s.fieldGroup}>
              <div className={s.fieldWrap}>
                <label htmlFor="username" className={s.fieldLabel}>站长用户名</label>
                <input id="username" type="text" className={s.fieldInput}
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="3–20 位，字母数字下划线" autoComplete="username"
                  required minLength={3} maxLength={20} pattern="^[a-zA-Z0-9_]+$" />
              </div>
              <div className={s.fieldWrap}>
                <label htmlFor="email" className={s.fieldLabel}>站长邮箱</label>
                <input id="email" type="email" className={s.fieldInput}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com" autoComplete="email" required />
              </div>
            </div>

            <div className={s.fieldGroupGap}>
              <div className={s.fieldWrap}>
                <label htmlFor="password" className={s.fieldLabel}>密码</label>
                <input id="password" type="password" className={s.fieldInput}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 8 位" autoComplete="new-password" required minLength={8} />
              </div>
              <div className={s.fieldWrap}>
                <label htmlFor="confirmPassword" className={s.fieldLabel}>确认密码</label>
                <input id="confirmPassword" type="password" className={s.fieldInput}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码" autoComplete="new-password" required />
              </div>
            </div>

            <button type="submit" disabled={isPending} className={s.submitButton}>
              <span className={s.submitButtonLabel}>
                {registerAdmin.isPending ? '创建站长中…' : login.isPending ? '自动登录中…' : '创建站长并进入系统'}
              </span>
              <span className={s.submitButtonIconWrap}>
                {isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
