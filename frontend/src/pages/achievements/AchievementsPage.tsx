import { useAchievements } from '@/api/achievements'
import { Trophy, Lock, Award, Flame, Zap, Target, Rocket, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Achievement } from '@/types/api'
import { Badge } from '@/components/core/Badge'
import {
  pageWrapper,
  pageHeader,
  pageTitle,
  loadingText,
  grid3,
  emptyState,
  textMuted,
} from '@/styles/shared.css'
import {
  progressSection,
  progressTrack,
  progressFill,
  unlockedSection,
  unlockedSectionTitle,
  lockedSectionTitle,
  unlockedCard,
  lockedCard,
  iconRow,
  unlockedIconBox,
  lockedIconBox,
  lockIcon,
  unlockedIconSvg,
  lockedIconSvg,
  unlockedTitle,
  lockedTitle,
  unlockedDesc,
  lockedDesc,
  unlockDate,
  emptyIcon,
} from '@/styles/pages/achievements.css'

const ICON_MAP: Record<string, LucideIcon> = {
  trophy: Trophy,
  fire: Flame,
  flame: Flame,
  medal: Award,
  bolt: Zap,
  rocket: Rocket,
  target: Target,
  book: BookOpen,
}

export function AchievementsPage() {
  const { data: achievements = [], isLoading } = useAchievements()

  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)
  const pct = achievements.length > 0 ? Math.round((unlocked.length / achievements.length) * 100) : 0

  return (
    <div className={pageWrapper}>
      <div className={pageHeader}>
        <h1 className={pageTitle}>成就</h1>
        <Badge variant="secondary">{unlocked.length} / {achievements.length} 已解锁</Badge>
      </div>

      {achievements.length > 0 && (
        <div className={progressSection}>
          <div className={progressTrack}>
            <div className={progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {isLoading ? (
        <p className={loadingText}>加载中...</p>
      ) : (
        <>
          {unlocked.length > 0 && (
            <section className={unlockedSection}>
              <h2 className={unlockedSectionTitle}>已解锁</h2>
              <div className={grid3}>
                {unlocked.map((a) => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            </section>
          )}

          {locked.length > 0 && (
            <section>
              <h2 className={lockedSectionTitle}>未解锁</h2>
              <div className={grid3}>
                {locked.map((a) => (
                  <AchievementCard key={a.id} achievement={a} />
                ))}
              </div>
            </section>
          )}

          {achievements.length === 0 && (
            <div className={emptyState}>
              <Trophy className={emptyIcon} strokeWidth={1.5} />
              <p className={textMuted}>暂无成就数据</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = ICON_MAP[achievement.icon] ?? Trophy
  const isUnlocked = achievement.unlocked

  return (
    <div className={isUnlocked ? unlockedCard : lockedCard}>
      <div className={iconRow}>
        <div className={isUnlocked ? unlockedIconBox : lockedIconBox}>
          <Icon className={isUnlocked ? unlockedIconSvg : lockedIconSvg} strokeWidth={1.8} />
        </div>
        {!isUnlocked && (
          <Lock className={lockIcon} strokeWidth={1.8} />
        )}
      </div>
      <h3 className={isUnlocked ? unlockedTitle : lockedTitle}>
        {achievement.name}
      </h3>
      <p className={isUnlocked ? unlockedDesc : lockedDesc}>
        {achievement.description}
      </p>
      {isUnlocked && achievement.unlocked_at && (
        <p className={unlockDate}>
          {new Date(achievement.unlocked_at).toLocaleDateString('zh-CN')} 解锁
        </p>
      )}
    </div>
  )
}
