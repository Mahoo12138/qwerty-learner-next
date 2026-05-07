import { useNavigate } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Flag,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
  Trash2,
  Volume2,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react'
import { useSentenceBanks } from '@/api/sentenceBanks'
import { useSystemSoundCatalog, useUserKeySounds } from '@/api/media'
import { useCompletePractice, useCreateSession, useDiscardSession, useSession, useSessions } from '@/api/practice'
import { useSaveSetting, useUserSettings } from '@/api/settings'
import { useMarkWordMastered } from '@/api/vocabulary'
import { useWordBanks } from '@/api/wordBanks'
import { AchievementToast } from '@/components/AchievementToast'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core/Select'
import { useTypingSound } from '@/hooks/useTypingSound'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useWordTyping } from '@/hooks/useWordTyping'
import {
  clearPracticeSessionProgress,
  loadPracticeSessionProgress,
  savePracticeSessionProgress,
} from '@/lib/practiceSessionProgress'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import * as css from '@/styles/pages/practice.css'
import type { Achievement, SessionWithContent } from '@/types/api'

interface PracticePageProps {
  resumeSessionId?: string
}

export function PracticePage({ resumeSessionId }: PracticePageProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userSettings = useSettingsStore((state) => state.userSettings)
  useUserSettings()

  const [mode, setMode] = useState('normal')
  const [sourceType, setSourceType] = useState<'word_bank' | 'sentence_bank'>('word_bank')
  const [sourceId, setSourceId] = useState('')
  const [itemCount, setItemCount] = useState(20)

  const [activeSession, setActiveSession] = useState<SessionWithContent | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [createError, setCreateError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [masteryMessage, setMasteryMessage] = useState('')
  const [discardingSessionId, setDiscardingSessionId] = useState<string | null>(null)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  const dismissAchievements = useCallback(() => setNewAchievements([]), [])

  const { data: wordBanks = [] } = useWordBanks()
  const { data: sentenceBanks = [] } = useSentenceBanks()
  const { data: recentSessions } = useSessions(1, 6)
  const {
    data: resumeSession,
    error: resumeError,
    isLoading: isResumeLoading,
  } = useSession(resumeSessionId ?? '')

  const createSession = useCreateSession()
  const completePractice = useCompletePractice()
  const discardSession = useDiscardSession()
  const markWordMastered = useMarkWordMastered()
  const { data: soundCatalog } = useSystemSoundCatalog()
  const { data: userKeySounds = [] } = useUserKeySounds(user?.id)
  const saveSetting = useSaveSetting()

  const textItems = useMemo(() => {
    if (!activeSession) return []
    if (activeSession.words) return activeSession.words.map((word) => ({ id: word.id, content: word.content }))
    if (activeSession.sentences) {
      return activeSession.sentences.map((sentence) => ({ id: sentence.id, content: sentence.content }))
    }
    return []
  }, [activeSession])

  const words = useMemo(() => textItems.map((item) => item.content), [textItems])
  const initialSnapshot = useMemo(
    () => loadPracticeSessionProgress(activeSession?.session.id),
    [activeSession?.session.id],
  )

  const {
    wordIndex,
    wordState,
    isTyping,
    isFinished,
    timerTime,
    handleKeyDown,
    pause,
    getStats,
    getKeystrokeStats,
    getResumeSnapshot,
    getErrorItems,
    skipWord,
    reset,
  } = useWordTyping({ words, initialSnapshot })

  const { stats: wsStats, connected, error: wsError, send, close } = useWebSocket(activeSession?.session.id ?? null)

  const soundEnabled = userSettings['user.practice.enable_sound'] === 'true'
  const configuredSoundId = (userSettings['user.practice.key_sound_id'] ?? '').trim()
  const showTimer = (userSettings['user.practice.show_timer'] ?? 'true') === 'true'
  const showWpm = (userSettings['user.practice.show_wpm'] ?? 'true') === 'true'
  const showAccuracy = (userSettings['user.practice.show_accuracy'] ?? 'true') === 'true'

  const selectedSoundFileId = useMemo(() => {
    const defaultSound = soundCatalog?.effects?.key

    if (!configuredSoundId) {
      return defaultSound?.file_id ?? ''
    }

    if (defaultSound && (defaultSound.file_id === configuredSoundId || defaultSound.identifier === configuredSoundId)) {
      return defaultSound.file_id
    }

    const systemSound = soundCatalog?.keyboards.find(
      (item) => item.file_id === configuredSoundId || item.identifier === configuredSoundId,
    )
    if (systemSound) {
      return systemSound.file_id
    }

    const userSound = userKeySounds.find((item) => item.id === configuredSoundId)
    return userSound?.id ?? ''
  }, [configuredSoundId, soundCatalog?.effects?.key, soundCatalog?.keyboards, userKeySounds])

  const { play: playTypingSound } = useTypingSound({
    enabled: soundEnabled && Boolean(activeSession) && !submitted,
    mediaId: selectedSoundFileId || null,
  })

  const { play: playCorrectSound } = useTypingSound({
    enabled: soundEnabled && Boolean(activeSession) && !submitted,
    mediaId: soundCatalog?.effects?.success?.file_id ?? null,
  })

  const { play: playErrorSound } = useTypingSound({
    enabled: soundEnabled && Boolean(activeSession) && !submitted,
    mediaId: soundCatalog?.effects?.error?.file_id ?? null,
  })

  const prevIsFinished = useRef(false)
  useEffect(() => {
    if (wordState.isFinished && !prevIsFinished.current) {
      playCorrectSound()
    }
    prevIsFinished.current = wordState.isFinished
  }, [playCorrectSound, wordState.isFinished])

  const prevHasWrong = useRef(false)
  useEffect(() => {
    if (wordState.hasWrong && !prevHasWrong.current) {
      playErrorSound()
    }
    prevHasWrong.current = wordState.hasWrong
  }, [playErrorSound, wordState.hasWrong])

  const clearResumeSearch = useCallback(() => {
    void navigate({ to: '/practice', search: { sessionId: undefined }, replace: true })
  }, [navigate])

  useEffect(() => {
    if (!resumeSessionId || !resumeError) return
    setCreateError(resumeError instanceof Error ? resumeError.message : '恢复练习失败，请重试')
    clearResumeSearch()
  }, [clearResumeSearch, resumeError, resumeSessionId])

  useEffect(() => {
    if (!resumeSessionId || !resumeSession) return

    if (resumeSession.result || resumeSession.session.ended_at) {
      clearPracticeSessionProgress(resumeSessionId)
      void navigate({ to: '/history/$sessionId', params: { sessionId: resumeSessionId }, replace: true })
      return
    }

    const hasContent = (resumeSession.words?.length ?? 0) > 0 || (resumeSession.sentences?.length ?? 0) > 0
    if (!hasContent) {
      setCreateError('该练习记录缺少可恢复内容，暂时无法继续。')
      clearResumeSearch()
      return
    }

    close()
    setMode(resumeSession.session.mode)
    setSourceType(resumeSession.session.source_type as 'word_bank' | 'sentence_bank')
    setSourceId(resumeSession.session.source_id ?? '')
    setItemCount(resumeSession.session.item_count || 20)
    setSubmitted(false)
    setCreateError('')
    setSubmitError('')
    setNewAchievements([])
    setActiveSession({
      session: resumeSession.session,
      words: resumeSession.words,
      sentences: resumeSession.sentences,
    })
    clearResumeSearch()
  }, [clearResumeSearch, close, navigate, resumeSession, resumeSessionId])

  useEffect(() => {
    if (!activeSession || submitted) return

    const listener = (event: KeyboardEvent) => {
      const beforeLength = wordState.inputWord.length
      const expected = wordState.displayWord[beforeLength] || ''
      const isCharacterKey = event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey

      const didType = handleKeyDown(event)

      if (isCharacterKey) {
        playTypingSound()
      }

      if (didType && isCharacterKey) {
        send({
          type: 'keystroke',
          char: event.key,
          timestamp: Date.now(),
          is_correct: event.key === expected,
        })
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [activeSession, handleKeyDown, playTypingSound, send, submitted, wordState.displayWord, wordState.inputWord.length])

  useEffect(() => {
    if (!activeSession || submitted) return

    const pausePractice = () => pause()
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pausePractice()
      }
    }

    window.addEventListener('blur', pausePractice)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('blur', pausePractice)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [activeSession, pause, submitted])

  useEffect(() => {
    if (!activeSession || submitted || words.length === 0) return
    savePracticeSessionProgress(activeSession.session.id, getResumeSnapshot())
  }, [
    activeSession,
    getResumeSnapshot,
    submitted,
    timerTime,
    wordIndex,
    wordState.hasWrong,
    wordState.inputWord,
    words.length,
  ])

  const localStats = getStats()
  const displayStats = {
    wpm: localStats.wpm,
    rawWpm: wsStats?.raw_wpm ?? localStats.wpm,
    accuracy: localStats.accuracy,
    elapsedMs: timerTime * 1000,
  }

  const progress = words.length > 0 ? ((wordIndex + (isFinished ? 1 : 0)) / words.length) * 100 : 0
  const prevWord = words[wordIndex - 1] ?? ''
  const nextWord = words[wordIndex + 1] ?? ''
  const selectedWordBank = sourceType === 'word_bank'
    ? (wordBanks.find((bank) => bank.id === sourceId) ?? null)
    : null
  const selectedSentenceBank = sourceType === 'sentence_bank'
    ? (sentenceBanks.find((bank) => bank.id === sourceId) ?? null)
    : null
  const currentWordInfo = sourceType === 'word_bank' && activeSession?.words
    ? (activeSession.words[wordIndex] ?? null)
    : null
  const availableSourceCount = sourceType === 'word_bank' ? wordBanks.length : sentenceBanks.length
  const pendingSessionCount = recentSessions?.list.filter((session) => !session.result && !session.ended_at).length ?? 0
  const completedSessionCount = recentSessions?.list.filter((session) => session.result || session.ended_at).length ?? 0
  const activeProgressValue = words.length > 0 ? Math.min(wordIndex + 1, words.length) : 0
  const activeSourceLabel = activeSession
    ? formatSourceLabel(activeSession.session.source_type)
    : formatSourceLabel(sourceType)
  const activeSourceName = activeSession
    ? (activeSession.session.source_type === 'word_bank'
        ? (wordBanks.find((bank) => bank.id === activeSession.session.source_id)?.name ?? null)
        : (sentenceBanks.find((bank) => bank.id === activeSession.session.source_id)?.name ?? null))
    : (selectedWordBank?.name ?? selectedSentenceBank?.name ?? null)
  const heroPrimaryValue = activeSession ? String(activeProgressValue) : String(wordBanks.length + sentenceBanks.length)
  const heroPrimarySuffix = activeSession ? `/ ${words.length}` : '库'
  const heroPrimaryLabel = activeSession ? '当前进度' : '训练资源'
  const heroPrimaryCaption = activeSession
    ? `${activeSourceName ?? activeSourceLabel} 正在推进中，保持节奏把这一轮完整打完。`
    : '词库与句库共同组成训练资源池，支持恢复未完成练习与连续训练。'
  const heroCoachCopy = activeSession
    ? `${connected ? '实时统计在线' : '离线统计中'}，这轮更适合优先盯住${showAccuracy ? '准确率' : '击键节奏'}，先稳住再提速。`
    : pendingSessionCount > 0
      ? `你有 ${pendingSessionCount} 条未完成练习可以直接续上，先把旧节奏接回来，再开新局。`
      : '先选内容和模式，再把这一轮完整打完，系统会自动保留进度并累计训练指标。'
  const heroBackdropLabel = activeSession ? 'RACE' : 'TYPE'
  const heroRibbonLabel = activeSession ? 'Practice Arena' : 'Practice Lobby'

  useEffect(() => {
    setMasteryMessage('')
  }, [activeSession?.session.id, currentWordInfo?.id])

  const startPractice = () => {
    if (!sourceId) return
    setSubmitted(false)
    setCreateError('')
    setSubmitError('')
    setMasteryMessage('')

    createSession.mutate(
      {
        mode,
        source_type: sourceType,
        source_id: sourceId,
        item_count: Math.min(200, Math.max(1, itemCount)),
      },
      {
        onSuccess: (session) => setActiveSession(session),
        onError: (error) => {
          setCreateError(error instanceof Error ? error.message : '创建练习失败，请重试')
        },
      },
    )
  }

  const submitPractice = () => {
    if (!activeSession) return
    const stats = getStats()

    completePractice.mutate(
      {
        sessionId: activeSession.session.id,
        wpm: stats.wpm,
        raw_wpm: stats.wpm,
        accuracy: stats.accuracy / 100,
        error_count: stats.totalWrong,
        char_count: textItems.reduce((sum, item) => sum + item.content.length, 0),
        consistency: 0.9,
        duration_ms: Math.max(1, stats.time * 1000),
        keystroke_stats: getKeystrokeStats(),
        error_items: getErrorItems(sourceType, textItems),
      },
      {
        onSuccess: (data) => {
          clearPracticeSessionProgress(activeSession.session.id)
          setSubmitted(true)
          close()
          if (data.new_achievements?.length) {
            setNewAchievements(data.new_achievements)
          }
        },
        onError: (error) => {
          setSubmitError(error instanceof Error ? error.message : '提交失败，请重试')
        },
      },
    )
  }

  const resetPractice = useCallback(() => {
    clearPracticeSessionProgress(activeSession?.session.id)
    close()
    setActiveSession(null)
    setSubmitted(false)
    setCreateError('')
    setSubmitError('')
    setMasteryMessage('')
    setNewAchievements([])
    reset()
    clearResumeSearch()
  }, [activeSession?.session.id, clearResumeSearch, close, reset])

  const openSessionDetail = useCallback((sessionId: string) => {
    void navigate({ to: '/history/$sessionId', params: { sessionId } })
  }, [navigate])

  const continueSession = useCallback((sessionId: string) => {
    void navigate({ to: '/practice', search: { sessionId } })
  }, [navigate])

  const discardPendingSession = useCallback((sessionId: string) => {
    if (!window.confirm('确定要舍弃这条未完成练习吗？舍弃后无法继续恢复。')) {
      return
    }

    setCreateError('')
    setDiscardingSessionId(sessionId)
    discardSession.mutate(sessionId, {
      onSuccess: () => {
        clearPracticeSessionProgress(sessionId)
        setDiscardingSessionId(null)
        if (activeSession?.session.id === sessionId) {
          resetPractice()
        }
      },
      onError: (error) => {
        setDiscardingSessionId(null)
        setCreateError(error instanceof Error ? error.message : '舍弃练习失败，请重试')
      },
    })
  }, [activeSession?.session.id, discardSession, resetPractice])

  const updateBoolSetting = useCallback((key: string, next: boolean) => {
    saveSetting.mutate({ key, value: String(next) })
  }, [saveSetting])

  const updateEnumSetting = useCallback((key: string, value: string) => {
    saveSetting.mutate({ key, value })
  }, [saveSetting])

  const markCurrentWordAsMastered = useCallback(() => {
    if (!currentWordInfo) return

    setMasteryMessage('')
    markWordMastered.mutate(currentWordInfo.id, {
      onSuccess: () => {
        setMasteryMessage(`已将 ${currentWordInfo.content.trim() || currentWordInfo.content} 标记为掌握。`)
      },
      onError: (error) => {
        setMasteryMessage(error instanceof Error ? error.message : '标记掌握失败，请重试')
      },
    })
  }, [currentWordInfo, markWordMastered])

  return (
    <div className={css.pageRoot}>
      <AchievementToast achievements={newAchievements} onDismiss={dismissAchievements} />

      <header className={css.pageHeader}>
        <div className={css.heroTexture} aria-hidden />
        <div className={css.heroBackdrop} aria-hidden>{heroBackdropLabel}</div>

        <div className={css.heroLayout}>
          <div className={css.heroCopy}>
            <div className={css.ribbonRow}>
              <Badge variant="secondary">{heroRibbonLabel}</Badge>
              <Badge variant="outline">{activeSession ? activeSourceLabel : '支持断点恢复'}</Badge>
            </div>

            <div className={css.heroTitleStack}>
              <p className={css.heroEyebrow}>{activeSession ? '实时训练赛道' : '训练看板'}</p>
              <h1 className={css.pageTitle}>
                <span>打字练习</span>
                <span className={css.pageTitleAccent}>{activeSession ? '正在上赛道' : '准备发车'}</span>
              </h1>
            </div>

            <p className={css.pageSubtitle}>
              {activeSession
                ? '把这一轮练习当成一块正在滚动的训练成绩板。速度、准确率、进度与词汇沉淀都在同一条赛道上实时推进。'
                : '用更像训练课的布局组织每一轮练习，把内容选择、恢复入口和成绩追踪都放进同一块训练看板。'}
            </p>

            <div className={css.coachNote}>
              <span className={css.coachLabel}>Coach Note</span>
              <span className={css.coachValue}>{heroCoachCopy}</span>
            </div>
          </div>

          <div className={css.heroBoard}>
            <div className={css.scorePrimary}>
              <div>
                <p className={css.scoreLabel}>{heroPrimaryLabel}</p>
                <div className={css.scoreValueRow}>
                  <span className={css.scoreValue}>{heroPrimaryValue}</span>
                  <span className={css.scoreSuffix}>{heroPrimarySuffix}</span>
                </div>
              </div>
              <p className={css.scoreCaption}>{heroPrimaryCaption}</p>
              <div className={css.scoreLane} aria-hidden />
            </div>

            <div className={css.scoreSecondaryGrid}>
              {activeSession ? (
                <>
                  <MiniMetric label="WPM" value={String(displayStats.wpm)} caption="当前即时速度" icon={<Zap size={18} />} tone="warning" />
                  <MiniMetric label="准确率" value={`${displayStats.accuracy}%`} caption="本轮实时准确" icon={<Flag size={18} />} tone="success" />
                  <MiniMetric label="已完成" value={String(localStats.wordCount)} caption="已推进的词数" icon={<CheckCircle2 size={18} />} tone="neutral" />
                </>
              ) : (
                <>
                  <MiniMetric label="词库" value={String(wordBanks.length)} caption="可立即开练" icon={<BookOpen size={18} />} tone="warning" />
                  <MiniMetric label="句库" value={String(sentenceBanks.length)} caption="延展节奏训练" icon={<Eye size={18} />} tone="neutral" />
                  <MiniMetric label="待继续" value={String(pendingSessionCount)} caption={`最近已完成 ${completedSessionCount} 条`} icon={<Play size={18} />} tone="success" />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {isResumeLoading && !activeSession && (
        <p className={css.resumingNotice}>正在恢复未完成练习...</p>
      )}

      {!activeSession ? (
        <div className={css.lobbyGrid}>
          <section className={css.configCard}>
            <div className={css.sectionHeaderRow}>
              <div>
                <p className={css.panelEyebrow}>Training Setup</p>
                <h2 className={css.configTitle}>训练准备</h2>
                <p className={css.panelSubtitle}>先选模式、内容和条目数量，再进入赛道。</p>
              </div>
              <Badge variant="secondary">{availableSourceCount} 个可用内容库</Badge>
            </div>

            <div className={css.configGrid}>
              <label className={css.configLabel}>
                <span className={css.configLabelText}>模式</span>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">普通打字</SelectItem>
                    <SelectItem value="dictation">默写模式</SelectItem>
                    <SelectItem value="recitation">背词模式</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className={css.configLabel}>
                <span className={css.configLabelText}>内容类型</span>
                <Select
                  value={sourceType}
                  onValueChange={(value) => {
                    const nextSourceType = value as 'word_bank' | 'sentence_bank'
                    setSourceType(nextSourceType)
                    setSourceId('')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word_bank">词库</SelectItem>
                    <SelectItem value="sentence_bank">句库</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className={css.configLabel}>
                <span className={css.configLabelText}>内容库</span>
                <Select
                  value={sourceId || '__none'}
                  onValueChange={(value) => setSourceId(value === '__none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">请选择</SelectItem>
                    {sourceType === 'word_bank'
                      ? wordBanks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name} ({bank.word_count})
                          </SelectItem>
                        ))
                      : sentenceBanks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name} ({bank.sentence_count})
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </label>

              <label className={css.configLabel}>
                <span className={css.configLabelText}>条目数量</span>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={itemCount}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value)
                    if (!Number.isFinite(nextValue)) {
                      setItemCount(1)
                      return
                    }
                    setItemCount(Math.min(200, Math.max(1, nextValue)))
                  }}
                />
              </label>
            </div>

            <div className={css.startRow}>
              <Button onClick={startPractice} disabled={!sourceId || createSession.isPending || isResumeLoading}>
                <Play />
                {createSession.isPending ? '创建中...' : '开始练习'}
              </Button>
              <Badge variant="outline">{formatModeLabel(mode)}</Badge>
              <Badge variant="outline">{formatSourceLabel(sourceType)}</Badge>
            </div>

            {createError && <p className={css.errorCallout}>{createError}</p>}
          </section>

          <aside className={css.recentCard}>
            <div className={css.sectionHeaderRow}>
              <div>
                <p className={css.panelEyebrow}>Recent Runs</p>
                <h2 className={css.recentTitle}>最近练习</h2>
                <p className={css.panelSubtitle}>继续未完成的训练，或直接回看最近成绩。</p>
              </div>
              <Badge variant="outline">{recentSessions?.total ?? 0} 条</Badge>
            </div>

            <div className={css.sessionList}>
              {recentSessions?.list.map((session) => (
                <div key={session.id} className={css.sessionItem}>
                  <div className={css.sessionMeta}>
                    <div className={css.actionBar}>
                      <span className={css.sessionName}>
                        {formatSessionName(session.mode, session.source_type, session.item_count)}
                      </span>
                      <Badge variant={session.result || session.ended_at ? 'success' : 'warning'}>
                        {session.result || session.ended_at ? '已完成' : '未完成'}
                      </Badge>
                    </div>
                    <span className={css.sessionDate}>{new Date(session.created_at).toLocaleString('zh-CN')}</span>
                    <span className={css.sessionWpm}>
                      {session.result ? `${session.result.wpm.toFixed(1)} WPM` : '等待继续或舍弃'}
                    </span>
                  </div>

                  <div className={css.sessionActions}>
                    <Button variant="outline" size="sm" onClick={() => openSessionDetail(session.id)}>
                      <Eye />
                      查看
                    </Button>
                    {!session.result && !session.ended_at && (
                      <>
                        <Button size="sm" onClick={() => continueSession(session.id)}>
                          <Play />
                          继续
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => discardPendingSession(session.id)}
                          disabled={discardingSessionId === session.id}
                        >
                          <Trash2 />
                          {discardingSessionId === session.id ? '舍弃中...' : '舍弃'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {(recentSessions?.list.length ?? 0) === 0 && (
                <p className={css.emptyText}>第一次训练会在这里留下成绩、继续入口和待处理的练习记录。</p>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <section className={css.arenaRoot}>
          <div className={css.progressStrip}>
            <div className={css.progressMeta}>
              <div>
                <p className={css.progressEyebrow}>{activeSourceName ?? activeSourceLabel}</p>
                <div className={css.progressValueRow}>
                  <span className={css.progressValue}>{activeProgressValue}</span>
                  <span className={css.progressTotal}>/ {words.length}</span>
                </div>
              </div>

              <div className={css.progressPills}>
                <span className={css.connectionBadge[connected ? 'online' : 'offline']}>
                  {connected ? <Wifi className={css.iconXs} /> : <WifiOff className={css.iconXs} />}
                  {connected ? '实时连接' : '已离线'}
                </span>
                <Badge variant="outline">{displayStats.wpm} WPM</Badge>
                <Badge variant="outline">{displayStats.accuracy}% 准确率</Badge>
              </div>
            </div>

            <div className={css.progressTrack}>
              <div className={css.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={css.progressFootRow}>
              <span className={css.progressFootnote}>进度 {activeProgressValue} / {words.length}</span>
              <span className={css.progressFootnote}>已完成 {localStats.wordCount} 个词，输入 {localStats.totalCorrect + localStats.totalWrong} 个字符</span>
            </div>
          </div>

          <div className={css.arenaLayout}>
            <div className={css.mainColumn}>
              {!isFinished && (
                <section className={css.typingStage}>
                  {!isTyping && (
                    <div className={css.pauseOverlay}>
                      <p className={css.pauseHint}>按任意键 {timerTime > 0 ? '继续' : '开始'}</p>
                    </div>
                  )}

                  <div className={css.contextRow}>
                    <div className={css.contextWord}>
                      <ChevronLeft className={css.iconXs} />
                      <span className={css.contextWordText}>{prevWord || '...'}</span>
                    </div>
                    <div className={css.contextWord}>
                      <span className={css.contextWordText}>{nextWord || '...'}</span>
                      <ChevronRight className={css.iconXs} />
                    </div>
                  </div>

                  <WordPanel
                    word={wordState.displayWord}
                    letterStates={wordState.letterStates}
                    hasWrong={wordState.hasWrong}
                    dictationMode={mode === 'dictation'}
                  />

                  {currentWordInfo && (
                    <>
                      <div className={css.wordInfoGrid}>
                        <InfoBlock label="音标" value={currentWordInfo.pronunciation || '暂无'} />
                        <InfoBlock label="释义" value={currentWordInfo.definition || '暂无'} />
                      </div>
                      <div className={css.wordActionRow}>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={markCurrentWordAsMastered}
                          disabled={markWordMastered.isPending}
                        >
                          <CheckCircle2 />
                          {markWordMastered.isPending ? '标记中...' : '标记当前词已掌握'}
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => navigate({ to: '/vocabulary' })}>
                          <Eye />
                          查看词汇量
                        </Button>
                        {masteryMessage && <span className={css.inlineNotice}>{masteryMessage}</span>}
                      </div>
                    </>
                  )}
                </section>
              )}

              <StatsDock
                wpm={displayStats.wpm}
                accuracy={displayStats.accuracy}
                elapsed={displayStats.elapsedMs}
                typed={localStats.totalCorrect + localStats.totalWrong}
                finishedWords={localStats.wordCount}
                errorCount={localStats.totalWrong}
                wsError={wsError}
                showTimer={showTimer}
                showWpm={showWpm}
                showAccuracy={showAccuracy}
              />

              {submitError && <p className={css.errorCallout}>{submitError}</p>}

              {isFinished && (
                <ResultCard
                  title={selectedWordBank?.name ?? '本轮练习'}
                  wpm={displayStats.wpm}
                  accuracy={displayStats.accuracy}
                  duration={displayStats.elapsedMs}
                  errors={localStats.totalWrong}
                  onSubmit={submitPractice}
                  submitting={completePractice.isPending}
                  submitted={submitted}
                />
              )}
            </div>

            <aside className={css.sideColumn}>
              <section className={css.quickSettingsCard}>
                <h2 className={css.quickSettingsTitle}>
                  <Settings2 className={css.iconSm} />
                  练习快捷设置
                </h2>

                <div className={css.toggleGrid}>
                  <QuickSettingToggle
                    label="显示计时"
                    enabled={showTimer}
                    onToggle={(next) => updateBoolSetting('user.practice.show_timer', next)}
                  />
                  <QuickSettingToggle
                    label="显示 WPM"
                    enabled={showWpm}
                    onToggle={(next) => updateBoolSetting('user.practice.show_wpm', next)}
                  />
                  <QuickSettingToggle
                    label="显示准确率"
                    enabled={showAccuracy}
                    onToggle={(next) => updateBoolSetting('user.practice.show_accuracy', next)}
                  />
                  <QuickSettingToggle
                    label="按键音效"
                    enabled={soundEnabled}
                    onToggle={(next) => updateBoolSetting('user.practice.enable_sound', next)}
                  />
                </div>

                {soundEnabled && (
                  <label className={css.soundSelectRow}>
                    <span className={css.soundSelectLabel}>
                      <Volume2 className={css.iconXs} />
                      当前按键音色
                    </span>
                    <Select
                      value={configuredSoundId || '__default'}
                      onValueChange={(value) => updateEnumSetting('user.practice.key_sound_id', value === '__default' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__default">系统默认按键音</SelectItem>
                        {(soundCatalog?.keyboards ?? []).map((item) => (
                          <SelectItem key={item.file_id} value={item.file_id}>
                            系统: {item.display_name || item.identifier}
                          </SelectItem>
                        ))}
                        {userKeySounds.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            我的: {item.display_name || item.filename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                )}
              </section>

              <section className={css.quickSettingsCard}>
                <h2 className={css.quickSettingsTitle}>
                  <Play className={css.iconSm} />
                  赛道操作
                </h2>

                <div className={css.actionButtons}>
                  {!submitted && !isFinished && (
                    <Button
                      onClick={skipWord}
                      variant="outline"
                      disabled={isFinished || words.length <= 1}
                      className={css.panelButton}
                    >
                      <SkipForward />
                      跳过当前词
                    </Button>
                  )}

                  {submitted ? (
                    <Button onClick={resetPractice} className={css.panelButton}>
                      <RotateCcw />
                      再来一轮
                    </Button>
                  ) : (
                    <Button onClick={resetPractice} variant="ghost" className={css.panelButton}>
                      <RotateCcw />
                      退出练习
                    </Button>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </section>
      )}
    </div>
  )
}

function MiniMetric({
  label,
  value,
  caption,
  icon,
  tone,
}: {
  label: string
  value: string | number
  caption: string
  icon: ReactNode
  tone: 'warning' | 'neutral' | 'success'
}) {
  return (
    <div className={clsx(css.heroMiniMetric, css.heroMiniMetricTone[tone])}>
      <div className={css.heroMiniTop}>
        <span className={css.heroMiniLabel}>{label}</span>
        <span className={css.heroMiniIcon}>{icon}</span>
      </div>
      <span className={css.heroMiniValue}>{value}</span>
      <span className={css.heroMiniCaption}>{caption}</span>
    </div>
  )
}

function WordPanel({
  word,
  letterStates,
  hasWrong,
  dictationMode,
}: {
  word: string
  letterStates: Array<'normal' | 'correct' | 'wrong'>
  hasWrong: boolean
  dictationMode: boolean
}) {
  const revealByState = (index: number) => letterStates[index] === 'correct' || letterStates[index] === 'wrong'

  return (
    <div className={css.wordDisplay}>
      <div className={clsx(css.letterRow, hasWrong && css.letterRowWrong)}>
        {word.split('').map((character, index) => {
          const state = letterStates[index]
          const visible = !dictationMode || revealByState(index)
          const tone = visible ? state : 'hidden'

          return (
            <span
              key={`${character}-${index}`}
              className={clsx(css.letterBase, css.letterVariants[tone])}
            >
              {visible ? character : '_'}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function StatsDock({
  wpm,
  accuracy,
  elapsed,
  typed,
  finishedWords,
  errorCount,
  wsError,
  showTimer,
  showWpm,
  showAccuracy,
}: {
  wpm: number
  accuracy: number
  elapsed: number
  typed: number
  finishedWords: number
  errorCount: number
  wsError: string | null
  showTimer: boolean
  showWpm: boolean
  showAccuracy: boolean
}) {
  return (
    <div className={css.statsDock}>
      {showTimer && <StatTile icon={Clock3} label="时间" value={formatDuration(elapsed)} />}
      {showWpm && <StatTile icon={Zap} label="WPM" value={String(wpm)} />}
      {showAccuracy && <StatTile icon={Flag} label="正确率" value={`${accuracy}%`} />}
      <StatTile icon={CheckCircle2} label="完成词数" value={String(finishedWords)} />
      <StatTile icon={Zap} label="输入数" value={String(typed)} />
      <StatTile icon={Wifi} label="错误数" value={String(errorCount)} />
      {wsError && <p className={css.wsError}>{wsError}</p>}
    </div>
  )
}

function QuickSettingToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string
  enabled: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <Button
      type="button"
      variant={enabled ? 'secondary' : 'outline'}
      className={css.quickSettingButton}
      onClick={() => onToggle(!enabled)}
    >
      <span>{label}</span>
      <Badge variant={enabled ? 'success' : 'outline'}>{enabled ? '开' : '关'}</Badge>
    </Button>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className={css.statTile}>
      <div className={css.statTileLabel}>
        <Icon className={css.iconXs} />
        <span>{label}</span>
      </div>
      <p className={css.statTileValue}>{value}</p>
    </div>
  )
}

function ResultCard({
  title,
  wpm,
  accuracy,
  duration,
  errors,
  onSubmit,
  submitting,
  submitted,
}: {
  title: string
  wpm: number
  accuracy: number
  duration: number
  errors: number
  onSubmit: () => void
  submitting: boolean
  submitted: boolean
}) {
  return (
    <section className={css.resultCard}>
      <div className={css.resultTopRow}>
        <div>
          <p className={css.resultEyebrow}>Session Complete</p>
          <h2 className={css.resultHeading}>本轮完成</h2>
        </div>
        <Badge variant={submitted ? 'success' : 'warning'}>{submitted ? '已同步历史' : '待提交'}</Badge>
      </div>

      <div className={css.resultBoard}>
        <div className={css.resultPrimary}>
          <p className={css.resultSub}>{title}</p>
          <div className={css.resultValueRow}>
            <span className={css.resultValue}>{wpm}</span>
            <span className={css.resultValueSuffix}>WPM</span>
          </div>
          <p className={css.resultCaption}>
            {submitted
              ? '成绩已写入历史详情，可以继续回看弱键与错题分布。'
              : '确认提交后，这一轮训练会进入完整复盘面板与历史详情。'}
          </p>
        </div>

        <div className={css.resultMiniGrid}>
          <MiniMetric label="准确率" value={`${accuracy}%`} caption="本轮稳定度" icon={<CheckCircle2 size={18} />} tone="success" />
          <MiniMetric label="用时" value={formatDuration(duration)} caption="整轮耗时" icon={<Clock3 size={18} />} tone="neutral" />
          <MiniMetric label="错误数" value={String(errors)} caption="进入复盘的失误" icon={<Flag size={18} />} tone="warning" />
        </div>
      </div>

      <div className={css.resultFoot}>
        <p className={css.resultMessage}>
          {submitted ? '可以直接开下一轮，或者去历史详情继续复盘。' : '先提交成绩，再把这一轮正式收进训练记录。'}
        </p>
        {!submitted && (
          <Button onClick={onSubmit} disabled={submitting}>
            <CheckCircle2 />
            {submitting ? '提交中...' : '提交成绩'}
          </Button>
        )}
      </div>
    </section>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className={css.infoBlock}>
      <p className={css.infoBlockLabel}>{label}</p>
      <p className={css.infoBlockValue}>{value}</p>
    </div>
  )
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(remainingSeconds).padStart(2, '0')
  return `${mm}:${ss}`
}

function formatSessionName(mode: string, sourceType: string, itemCount: number) {
  return `【${formatModeLabel(mode)}】【${formatSourceLabel(sourceType)}】【${itemCount}项】`
}

function formatModeLabel(mode: string) {
  switch (mode) {
    case 'dictation':
      return '默写模式'
    case 'recitation':
      return '背词模式'
    default:
      return '普通打字'
  }
}

function formatSourceLabel(sourceType: string) {
  return sourceType === 'sentence_bank' ? '句库练习' : '词库练习'
}