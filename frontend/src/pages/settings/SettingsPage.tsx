import { clsx } from 'clsx'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useUpdateProfile } from '@/api/auth'
import { request } from '@/api/client'
import { useSystemSoundCatalog, useUploadUserKeySound, useUserKeySounds } from '@/api/media'
import {
  useApiTokens,
  useCreateApiToken,
  useDeleteApiToken,
  useUpdateApiToken,
} from '@/api/openapi'
import {
  usePublicSystemSettings,
  useSaveSetting,
  useSaveSystemSetting,
  useSaveUserControl,
  useSettingDefinitions,
  useSystemSettings,
  useUserControls,
  useUserSettings,
} from '@/api/settings'
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from '@/api/admin'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/components/core'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useThemeStore } from '@/stores/themeStore'
import * as css from '@/styles/pages/settings.css'
import type {
  SettingDefinitionGroup,
  SettingDefinitionItem,
  SystemSettingItem,
  User as CurrentUser,
  UserControlItem,
} from '@/types/api'
import {
  Camera,
  Check,
  Clock,
  KeyRound,
  Loader2,
  Lock,
  MoreVertical,
  Music2,
  Pencil,
  Plus,
  RefreshCw,
  Server,
  Settings,
  Shield,
  SlidersHorizontal,
  Trash2,
  Upload,
  User,
  UserCog,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type SettingsGroup = {
  key: string
  label: string
  description: string
  icon: LucideIcon
  adminOnly?: boolean
}

const MAX_AVATAR_SIZE = 256 * 1024
const AUTO_SAVE_DELAY_MS = 450
const HIDDEN_SYSTEM_SETTING_KEYS = new Set(['system.owner_user_id'])

const AVAILABLE_SCOPES = [
  { id: 'user:read', label: '读取个人信息', description: '获取当前用户的基本信息及设置' },
  { id: 'user:write', label: '修改个人信息', description: '修改当前用户的基本信息及设置' },
  { id: 'records:read', label: '读取练习记录', description: '读取打字练习历史及打字统计' },
  { id: 'records:write', label: '写入练习记录', description: '上传新的打字成绩和错题数据' },
  { id: 'words:read', label: '读取词汇数据', description: '读取系统词库、文章库及个人生词本' },
  { id: 'words:write', label: '修改生词本', description: '添加或移出个人生词本中的单词' },
] as const

const PREFERENCE_GROUP_LABELS: Record<string, string> = {
  display: '显示与外观',
  practice: '打字练习',
  general: '通用',
}

const SETTING_OPTION_LABELS: Record<string, Record<string, string>> = {
  'user.language': {
    'zh-CN': '简体中文',
    'en-US': 'English (US)',
  },
  'user.theme': {
    light: '浅色',
    dark: '深色',
    system: '跟随系统',
  },
  'user.font_size': {
    small: '小',
    medium: '中',
    large: '大',
  },
  'user.practice.pronunciation_voice': {
    'en-US': '美式英语',
    'en-GB': '英式英语',
    'en-AU': '澳式英语',
  },
  'user.practice.mistake_behavior': {
    stop: '停留在错误字符',
    continue: '继续输入覆盖',
  },
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('无法读取图片文件'))
    }
    image.src = objectUrl
  })
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('图片压缩失败'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      quality,
    )
  })
}

async function compressAvatarToLimit(file: File, maxBytes: number): Promise<File> {
  if (file.size <= maxBytes) {
    return file
  }

  const image = await loadImageFromFile(file)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('浏览器不支持图片压缩')
  }

  let quality = 0.9
  let scale = 1

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const width = Math.max(64, Math.floor(image.naturalWidth * scale))
    const height = Math.max(64, Math.floor(image.naturalHeight * scale))
    canvas.width = width
    canvas.height = height

    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, quality)
    if (blob.size <= maxBytes) {
      const targetName = file.name.replace(/\.[^.]+$/, '') || 'avatar'
      return new File([blob], `${targetName}.jpg`, { type: 'image/jpeg' })
    }

    if (quality > 0.45) {
      quality -= 0.08
    } else {
      scale *= 0.85
    }
  }

  throw new Error('图片压缩后仍超过 256KB，请选择更小的图片')
}

function getSettingOptionLabel(settingKey: string, option: string) {
  return SETTING_OPTION_LABELS[settingKey]?.[option] ?? option
}

type AutoSaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

type SettingFieldItem = {
  key: string
  type: string
  label: string
  description?: string
  enum_options?: string[]
}

function getAutoSaveMeta(state: AutoSaveState) {
  switch (state) {
    case 'dirty':
      return { label: '待保存', tone: 'muted' as const }
    case 'saving':
      return { label: '保存中...', tone: 'muted' as const }
    case 'saved':
      return { label: '已保存', tone: 'success' as const }
    case 'error':
      return { label: '保存失败', tone: 'error' as const }
    default:
      return null
  }
}

function useAutoSaveValue({
  value,
  onSave,
  debounceMs = AUTO_SAVE_DELAY_MS,
}: {
  value: string
  onSave: (nextValue: string) => Promise<unknown>
  debounceMs?: number
}) {
  const [draftValue, setDraftValue] = useState(value)
  const [state, setState] = useState<AutoSaveState>('idle')
  const latestValueRef = useRef(value)
  const saveTimerRef = useRef<number | null>(null)
  const clearStatusTimerRef = useRef<number | null>(null)

  useEffect(() => {
    latestValueRef.current = value
  }, [value])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current)
      }
      if (clearStatusTimerRef.current !== null) {
        window.clearTimeout(clearStatusTimerRef.current)
      }
    }
  }, [])

  const markSaved = () => {
    if (clearStatusTimerRef.current !== null) {
      window.clearTimeout(clearStatusTimerRef.current)
    }
    setState('saved')
    clearStatusTimerRef.current = window.setTimeout(() => {
      setState('idle')
    }, 1400)
  }

  const commitValue = async (nextValue: string) => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }

    if (nextValue === latestValueRef.current) {
      setState('idle')
      return
    }

    setState('saving')
    try {
      await onSave(nextValue)
      latestValueRef.current = nextValue
      markSaved()
    } catch {
      setState('error')
    }
  }

  const scheduleSave = (nextValue: string) => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
    }

    if (nextValue === latestValueRef.current) {
      setState('idle')
      return
    }

    setState('dirty')
    saveTimerRef.current = window.setTimeout(() => {
      void commitValue(nextValue)
    }, debounceMs)
  }

  const updateDraft = (nextValue: string) => {
    setDraftValue(nextValue)
    if (nextValue === latestValueRef.current) {
      setState('idle')
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
      return
    }
    setState('dirty')
  }

  return {
    draftValue:
      state === 'idle'
        ? value
        : draftValue,
    setDraftValue: updateDraft,
    state,
    scheduleSave,
    flushSave: () => void commitValue(draftValue),
  }
}

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const dark = useThemeStore((state) => state.dark)
  const [activeGroup, setActiveGroup] = useState('my-account')

  const isPrivileged = user?.role === 'admin' || user?.role === 'owner'

  const groups: SettingsGroup[] = [
    { key: 'my-account', label: '我的账号', description: '资料、密码与令牌', icon: User },
    { key: 'preferences', label: '偏好设置', description: '界面与练习习惯', icon: SlidersHorizontal },
    ...(isPrivileged
      ? [
          {
            key: 'user-accounts',
            label: '用户管理',
            description: '创建、禁用与删除用户',
            icon: UserCog,
            adminOnly: true,
          },
          {
            key: 'system-management',
            label: '系统管理',
            description: '系统级参数与开关',
            icon: Server,
            adminOnly: true,
          },
          {
            key: 'user-management',
            label: '配置管理',
            description: '配置项权限控制',
            icon: Users,
            adminOnly: true,
          },
        ]
      : []),
  ]

  const resolvedActiveGroup = groups.some((group) => group.key === activeGroup)
    ? activeGroup
    : groups[0]?.key ?? 'my-account'

  const currentGroup = groups.find((group) => group.key === resolvedActiveGroup)
  const CurrentGroupIcon = currentGroup?.icon ?? Settings

  const roleBadgeLabel =
    user?.role === 'owner' ? '所有者模式' : user?.role === 'admin' ? '管理员模式' : '学习者模式'

  return (
    <div className={css.pageRoot}>
      <aside className={css.sidebar}>
        <div className={css.sidebarBrand}>
          <p className={css.sidebarBrandTitle}>Settings Studio</p>
          <p className={css.sidebarBrandSub}>
            把账号、安全和练习偏好整理成更稳定的训练控制台。
          </p>
        </div>

        {groups.map((group) => {
          const Icon = group.icon
          const isActive = group.key === resolvedActiveGroup

          return (
            <button
              key={group.key}
              type="button"
              className={clsx(css.navItem, css.navItemState[isActive ? 'active' : 'inactive'])}
              onClick={() => setActiveGroup(group.key)}
              aria-pressed={isActive}
            >
              <div className={css.navItemTopRow}>
                <Icon className={css.navIcon} size={16} />
                <span className={css.navLabel}>{group.label}</span>
                {group.adminOnly ? <span className={css.navAdminBadge}>Admin</span> : null}
              </div>
              <p className={css.navDesc}>{group.description}</p>
            </button>
          )
        })}
      </aside>

      <main className={css.contentArea}>
        <div className={css.breadcrumb}>
          <CurrentGroupIcon className={css.sectionIcon} size={16} />
          <span>{currentGroup?.description ?? '统一管理账户、偏好与系统配置'}</span>
        </div>

        <section className={css.overviewSection}>
          <div className={css.overviewHeader}>
            <div>
              <p className={css.overviewKicker}>Settings Studio</p>
              <h1 className={css.overviewTitle}>设置中心</h1>
              <p className={css.overviewLead}>
                围绕长时间训练场景重新编排账号、安全和偏好操作，把高频动作放在眼前，把系统级控制稳定地沉到侧边。
              </p>
            </div>

            <div className={css.overviewBadgeRow}>
              <Badge variant="secondary">{currentGroup?.label ?? '设置'}</Badge>
              <Badge variant="outline">{dark ? '深色模式' : '浅色模式'}</Badge>
              {isPrivileged ? (
                <Badge variant="warning">{roleBadgeLabel}</Badge>
              ) : (
                <Badge variant="outline">学习者模式</Badge>
              )}
            </div>
          </div>

          <div className={css.overviewStats}>
            <div className={css.overviewStat}>
              <p className={css.overviewStatLabel}>当前面板</p>
              <p className={css.overviewStatValue}>{currentGroup?.label ?? '设置'}</p>
            </div>
            <div className={css.overviewStat}>
              <p className={css.overviewStatLabel}>可用模块</p>
              <p className={css.overviewStatValue}>{groups.length}</p>
            </div>
            <div className={css.overviewStat}>
              <p className={css.overviewStatLabel}>当前身份</p>
              <p className={css.overviewStatValue}>{user?.nickname || user?.username || '未登录'}</p>
            </div>
          </div>
        </section>

        {resolvedActiveGroup === 'my-account' ? (
          <>
            <ProfileSection user={user} />
            <ApiTokenSection />
          </>
        ) : null}

        {resolvedActiveGroup === 'preferences' ? <PreferenceSection /> : null}
        {resolvedActiveGroup === 'user-accounts' && isPrivileged ? (
          <UserAccountsSection callerRole={user?.role ?? 'user'} />
        ) : null}
        {resolvedActiveGroup === 'system-management' && isPrivileged ? (
          <SystemManagementSection />
        ) : null}
        {resolvedActiveGroup === 'user-management' && isPrivileged ? (
          <UserManagementSection />
        ) : null}
      </main>
    </div>
  )
}

function PreferenceSection() {
  const { data: definitionsData } = useSettingDefinitions()
  useUserSettings()

  const groups = definitionsData?.groups ?? []

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <Settings className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>偏好设置</h2>
          </div>
          <p className={css.fieldDesc}>把界面与练习行为整理成稳定、可保存的个人配置。</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className={css.fieldDesc}>暂无可配置偏好项。</p>
      ) : (
        <div className={css.stack.xl}>
          {groups.map((group) => (
            <PreferenceGroup key={group.key} group={group} />
          ))}

          <TypingSoundSection />
        </div>
      )}
    </section>
  )
}

function TypingSoundSection() {
  const user = useAuthStore((state) => state.user)
  const userSettings = useSettingsStore((state) => state.userSettings)
  const saveSetting = useSaveSetting()
  const uploadUserKeySound = useUploadUserKeySound()
  const { data: soundCatalog } = useSystemSoundCatalog()
  const { data: userKeySounds = [] } = useUserKeySounds(user?.id)
  const uploadInputRef = useRef<HTMLInputElement | null>(null)

  const selectedSoundId = (userSettings['user.practice.key_sound_id'] ?? '').trim()
  const systemDefaultKey = soundCatalog?.effects?.key

  const saveSoundSelection = (value: string) => {
    saveSetting.mutate({ key: 'user.practice.key_sound_id', value })
  }

  const handleUploadSound = (file: File) => {
    if (!user?.id || !file.type.startsWith('audio/')) {
      return
    }

    uploadUserKeySound.mutate(
      {
        userId: user.id,
        file,
        displayName: file.name,
      },
      {
        onSuccess: (data) => {
          saveSoundSelection(data.file_id)
        },
      },
    )
  }

  const selectedDisplayName = (() => {
    if (!selectedSoundId) {
      return systemDefaultKey?.display_name || '系统默认按键音'
    }

    if (
      systemDefaultKey?.identifier === selectedSoundId ||
      systemDefaultKey?.file_id === selectedSoundId
    ) {
      return systemDefaultKey.display_name || '系统默认按键音'
    }

    const keyboardItem = soundCatalog?.keyboards.find(
      (item) => item.identifier === selectedSoundId || item.file_id === selectedSoundId,
    )
    if (keyboardItem) {
      return keyboardItem.display_name || '系统键盘音效'
    }

    const userItem = userKeySounds.find((item) => item.id === selectedSoundId)
    if (userItem) {
      return userItem.display_name || itemLabel(userItem.display_name, userItem.filename, '我的音效')
    }

    return '未找到对应音效'
  })()

  return (
    <div className={css.soundSection}>
      <div className={css.soundSectionHeader}>
        <div>
          <p className={css.fieldLabel}>键盘音效</p>
          <p className={css.fieldDesc}>选择按键时播放的声音，上传后会自动切换到新的个人音效。</p>
        </div>
        <Music2 className={css.sectionIcon} size={16} />
      </div>

      <div className={css.stack.md}>
        <div className={css.stack.xs}>
          <span className={css.infoLabel}>当前音效</span>
          <span className={css.infoValue}>{selectedDisplayName}</span>
        </div>

        <Select
          value={selectedSoundId || '__default'}
          onValueChange={(value) => saveSoundSelection(value === '__default' ? '' : value)}
          disabled={saveSetting.isPending}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择按键音效" />
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
                我的: {itemLabel(item.display_name, item.filename, '我的音效')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className={css.uploadRow}>
          <input
            ref={uploadInputRef}
            type="file"
            accept="audio/*,.wav,.mp3,.ogg,.webm"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) {
                return
              }
              event.target.value = ''
              handleUploadSound(file)
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!user?.id || uploadUserKeySound.isPending || saveSetting.isPending}
            onClick={() => uploadInputRef.current?.click()}
          >
            {uploadUserKeySound.isPending ? (
              <Loader2 size={16} className={css.spinner} />
            ) : (
              <Upload size={16} />
            )}
            上传我的音效
          </Button>

          <p className={css.uploadHint}>支持 mp3 / ogg / wav / webm，上传后会立即生效。</p>
        </div>
      </div>
    </div>
  )
}

function PreferenceGroup({
  group,
}: {
  group: SettingDefinitionGroup
}) {
  return (
    <div>
      <h3 className={css.preferenceGroupTitle}>{PREFERENCE_GROUP_LABELS[group.key] ?? group.key}</h3>
      <div className={css.stack.md}>
        {group.items.map((item) => (
          <UserSettingField key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}

function SettingFieldCard({
  item,
  value,
  disabled,
  autoSaveState,
  onValueChange,
  onBlurCommit,
  onChangeCommit,
}: {
  item: SettingFieldItem
  value: string
  disabled: boolean
  autoSaveState?: AutoSaveState
  onValueChange: (value: string) => void
  onBlurCommit?: () => void
  onChangeCommit?: (value: string) => void
}) {
  const autoSaveMeta = autoSaveState ? getAutoSaveMeta(autoSaveState) : null

  return (
    <div className={css.fieldCard}>
      <div className={css.fieldHeadRow}>
        <div>
          <p className={css.fieldLabel}>{item.label}</p>
          {item.description ? <p className={css.fieldDesc}>{item.description}</p> : null}
        </div>
        {!disabled ? (
          autoSaveMeta ? (
            <span className={clsx(css.fieldStatus, css.fieldStatusTone[autoSaveMeta.tone])}>
              {autoSaveMeta.label}
            </span>
          ) : null
        ) : (
          <span className={css.fieldLockedBadge}>已锁定</span>
        )}
      </div>

      {item.type === 'bool' ? (
        <div className={css.settingControlRow}>
          <span className={css.settingControlStatus}>{value === 'true' ? '当前已开启' : '当前已关闭'}</span>
          <div className={css.switchControl}>
            <span className={css.switchControlText}>启用</span>
            <Switch
              checked={value === 'true'}
              disabled={disabled}
              onCheckedChange={(checked) => {
                const nextValue = String(checked)
                onValueChange(nextValue)
                onChangeCommit?.(nextValue)
              }}
            />
          </div>
        </div>
      ) : item.type === 'enum' ? (
        <Select
          value={value}
          disabled={disabled}
          onValueChange={(nextValue) => {
            onValueChange(nextValue)
            onChangeCommit?.(nextValue)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(item.enum_options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {getSettingOptionLabel(item.key, option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : item.type === 'int' ? (
        <Input
          type="number"
          value={value || '0'}
          disabled={disabled}
          onChange={(event) => onValueChange(event.target.value)}
          onBlur={onBlurCommit}
        />
      ) : (
        <Input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) => onValueChange(event.target.value)}
          onBlur={onBlurCommit}
        />
      )}
    </div>
  )
}

function UserSettingField({ item }: { item: SettingDefinitionItem }) {
  const saveSetting = useSaveSetting()
  const currentValue = useSettingsStore(
    (state) => state.userSettings[item.key] ?? item.current_value ?? item.default_value,
  )
  const { draftValue, setDraftValue, state, scheduleSave } = useAutoSaveValue({
    value: currentValue,
    onSave: async (nextValue) => {
      await saveSetting.mutateAsync({ key: item.key, value: nextValue })
    },
  })

  return (
    <SettingFieldCard
      item={item}
      value={draftValue}
      disabled={!item.is_editable || saveSetting.isPending}
      autoSaveState={state}
      onValueChange={setDraftValue}
      onBlurCommit={() => scheduleSave(draftValue)}
      onChangeCommit={scheduleSave}
    />
  )
}

function SystemSettingField({ item }: { item: SystemSettingItem }) {
  const saveSystem = useSaveSystemSetting()
  const { draftValue, setDraftValue, state, scheduleSave } = useAutoSaveValue({
    value: item.current_value,
    onSave: async (nextValue) => {
      await saveSystem.mutateAsync({ key: item.key, value: nextValue })
    },
  })

  return (
    <SettingFieldCard
      item={item}
      value={draftValue}
      disabled={saveSystem.isPending}
      autoSaveState={state}
      onValueChange={setDraftValue}
      onBlurCommit={() => scheduleSave(draftValue)}
      onChangeCommit={scheduleSave}
    />
  )
}

function ApiTokenSection() {
  const { data: tokens = [], isLoading } = useApiTokens()
  const createToken = useCreateApiToken()
  const deleteToken = useDeleteApiToken()
  const updateToken = useUpdateApiToken()

  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newScopes, setNewScopes] = useState<string[]>(['*'])
  const [newExpires, setNewExpires] = useState<number | null>(null)
  const [newRawToken, setNewRawToken] = useState<string | null>(null)
  const [copiedRaw, setCopiedRaw] = useState(false)
  const [copiedPrefix, setCopiedPrefix] = useState<string | null>(null)

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newName.trim()) {
      return
    }

    createToken.mutate(
      {
        name: newName,
        scopes: newScopes.length === 0 ? '' : newScopes.includes('*') ? '*' : newScopes.join(','),
        expires_in: newExpires,
      },
      {
        onSuccess: (data) => {
          setNewRawToken(data.raw_token)
          setNewName('')
          setNewScopes(['*'])
          setNewExpires(null)
        },
      },
    )
  }

  const handleCloseCreate = (open: boolean) => {
    if (!open) {
      setCreateOpen(false)
      setCopiedRaw(false)
      window.setTimeout(() => setNewRawToken(null), 300)
      return
    }

    setCreateOpen(true)
  }

  const handleCopyRaw = async () => {
    if (!newRawToken) {
      return
    }

    await navigator.clipboard.writeText(newRawToken)
    setCopiedRaw(true)
    window.setTimeout(() => setCopiedRaw(false), 2000)
  }

  const handleCopyPrefix = async (prefix: string) => {
    await navigator.clipboard.writeText(prefix)
    setCopiedPrefix(prefix)
    window.setTimeout(() => setCopiedPrefix(null), 2000)
  }

  const toggleActive = (id: string, currentActive: number) => {
    updateToken.mutate({ id, is_active: currentActive === 1 ? 0 : 1 })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个 Token 吗？此操作不可恢复，关联的应用将立即无法访问。')) {
      deleteToken.mutate(id)
    }
  }

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <KeyRound className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>开放 API Token</h2>
          </div>
          <p className={css.fieldDesc}>管理用于访问开放 API 的访问令牌，将 Token 作为 Bearer 放在 Authorization 请求头中。</p>
        </div>

        <Dialog open={createOpen} onOpenChange={handleCloseCreate}>
          <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            创建 Token
          </Button>

          <DialogContent>
            {newRawToken ? (
              <>
                <DialogHeader>
                  <DialogTitle className={css.dialogSuccessTitle}>
                    <Check size={18} />
                    Token 创建成功
                  </DialogTitle>
                  <DialogDescription>
                    请立即保存完整 Token。出于安全原因，关闭此窗口后将无法再次查看。
                  </DialogDescription>
                </DialogHeader>

                <div className={css.tokenResultBox}>{newRawToken}</div>

                <DialogFooter>
                  <Button type="button" onClick={() => void handleCopyRaw()} variant={copiedRaw ? 'secondary' : 'default'}>
                    {copiedRaw ? '已复制' : '复制 Token'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => handleCloseCreate(false)}>
                    我已保存，关闭
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>创建新的 API Token</DialogTitle>
                  <DialogDescription>
                    创建一个新的 Token 用于开放 API 访问。每个用户最多可创建 10 个 Token。
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreate} className={css.dialogForm}>
                  <div className={css.dialogFormField}>
                    <label htmlFor="token-name" className={css.dialogFormLabel}>
                      名称
                    </label>
                    <Input
                      id="token-name"
                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      placeholder="例如：我的自动化脚本"
                      maxLength={64}
                      required
                    />
                  </div>

                  <div className={css.dialogFormField}>
                    <label htmlFor="token-expiry" className={css.dialogFormLabel}>
                      有效期
                    </label>
                    <Select
                      value={newExpires === null ? 'never' : String(newExpires)}
                      onValueChange={(value) => setNewExpires(value === 'never' ? null : Number(value))}
                    >
                      <SelectTrigger id="token-expiry">
                        <SelectValue placeholder="选择有效期" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2592000">30天</SelectItem>
                        <SelectItem value="7776000">90天</SelectItem>
                        <SelectItem value="15552000">180天</SelectItem>
                        <SelectItem value="31536000">1年</SelectItem>
                        <SelectItem value="never">永久有效</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={css.dialogFormField}>
                    <div className={css.row.between}>
                      <label className={css.dialogFormLabel}>权限范围</label>
                      <label className={css.checkboxLabel}>
                        <input
                          id="scope-all"
                          type="checkbox"
                          className={css.checkbox}
                          checked={newScopes.includes('*')}
                          onChange={(event) => {
                            setNewScopes(event.target.checked ? ['*'] : [])
                          }}
                        />
                        <span>全部权限 (*)</span>
                      </label>
                    </div>

                    <div className={css.scopeGrid}>
                      {AVAILABLE_SCOPES.map((scope) => (
                        <div key={scope.id} className={css.scopeItem}>
                          <input
                            id={`scope-${scope.id}`}
                            type="checkbox"
                            className={css.checkbox}
                            checked={newScopes.includes('*') || newScopes.includes(scope.id)}
                            disabled={newScopes.includes('*')}
                            onChange={(event) => {
                              if (event.target.checked) {
                                setNewScopes((prev) => [...prev.filter((item) => item !== '*'), scope.id])
                              } else {
                                setNewScopes((prev) => prev.filter((item) => item !== scope.id))
                              }
                            }}
                          />
                          <div className={css.scopeItemText}>
                            <label htmlFor={`scope-${scope.id}`} className={css.scopeItemLabel}>
                              {scope.label}
                            </label>
                            <p className={css.scopeItemDesc}>{scope.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => handleCloseCreate(false)}>
                      取消
                    </Button>
                    <Button type="submit" disabled={!newName.trim() || createToken.isPending}>
                      {createToken.isPending ? '创建中...' : '生成 Token'}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className={css.loadingWrapper}>
          <Loader2 size={20} className={css.spinner} />
        </div>
      ) : tokens.length === 0 ? (
        <div className={css.tokenEmptyState}>
          <KeyRound className={css.tokenEmptyIcon} size={32} />
          <p>您还没有创建任何 API Token。</p>
        </div>
      ) : (
        <div className={css.tokenList}>
          {tokens.map((token) => {
            const expired = isExpired(token.expires_at)
            const isActive = token.is_active === 1 && !expired

            return (
              <div
                key={token.id}
                className={clsx(css.tokenCardBase, css.tokenCardState[isActive ? 'active' : 'inactive'])}
              >
                <div className={css.tokenBody}>
                  <div className={css.tokenNameRow}>
                    <h3 className={css.tokenName}>{token.name}</h3>
                    {expired ? (
                      <span className={css.tokenStatusBadge.expired}>已过期</span>
                    ) : token.is_active === 0 ? (
                      <span className={css.tokenStatusBadge.disabled}>已停用</span>
                    ) : (
                      <span className={css.tokenStatusBadge.ok}>正常</span>
                    )}
                  </div>

                  <div className={css.tokenScopeRow}>
                    <button
                      type="button"
                      className={css.tokenPrefix}
                      onClick={() => void handleCopyPrefix(token.prefix)}
                      title="点击复制前缀"
                    >
                      {copiedPrefix === token.prefix ? '已复制' : `${token.prefix}••••••••`}
                    </button>

                    {token.scopes === '*' || !token.scopes ? (
                      <Badge variant="secondary">全部权限 (*)</Badge>
                    ) : (
                      token.scopes
                        .split(',')
                        .filter(Boolean)
                        .map((scope) => {
                          const found = AVAILABLE_SCOPES.find((item) => item.id === scope.trim())
                          return (
                            <Badge key={scope} variant="outline" title={scope}>
                              {found ? found.label : scope}
                            </Badge>
                          )
                        })
                    )}
                  </div>
                </div>

                <div className={css.tokenMetaCol}>
                  <div className={css.tokenMetaRow}>
                    <span className={css.tokenMetaLabel}>
                      <Clock size={12} />
                      过期:
                    </span>
                    <span className={css.tokenMetaValue}>
                      {token.expires_at ? formatDateTime(token.expires_at) : '永久'}
                    </span>
                  </div>
                  <div className={css.tokenMetaRow}>
                    <span className={css.tokenMetaLabel}>
                      <RefreshCw size={12} />
                      使用:
                    </span>
                    <span className={css.tokenMetaValue}>{formatDateTime(token.last_used_at)}</span>
                  </div>
                </div>

                <div className={css.tokenActions}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      className={css.iconGhostButton}
                      aria-label={`${token.name} 操作菜单`}
                    >
                      <MoreVertical size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleActive(token.id, token.is_active)} disabled={expired}>
                        {token.is_active === 1 ? '停用 Token' : '启用 Token'}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(token.id)}>
                        删除 Token
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function SystemManagementSection() {
  const { data = [] } = useSystemSettings()
  const visibleItems = data.filter((item) => !HIDDEN_SYSTEM_SETTING_KEYS.has(item.key))

  const grouped = visibleItems.reduce<Record<string, SystemSettingItem[]>>((accumulator, item) => {
    const key = item.group_key || 'general'
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push(item)
    return accumulator
  }, {})

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <Server className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>系统管理</h2>
          </div>
          <p className={css.fieldDesc}>面向管理员的系统级参数和全局开关。</p>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className={css.fieldDesc}>暂无系统设置。</p>
      ) : (
        <div className={css.stack.xl}>
          {Object.entries(grouped).map(([groupKey, items]) => (
            <div key={groupKey}>
              <h3 className={css.preferenceGroupTitle}>{groupKey}</h3>
              <div className={css.stack.md}>
                {items.map((item) => (
                  <SystemSettingField key={item.key} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function UserManagementSection() {
  const { data = [] } = useUserControls()
  const saveControl = useSaveUserControl()

  const handleToggle = (
    item: UserControlItem,
    patch: Partial<Pick<UserControlItem, 'is_visible' | 'is_editable'>>,
  ) => {
    saveControl.mutate({
      key: item.key,
      isVisible: patch.is_visible ?? item.is_visible,
      isEditable: patch.is_editable ?? item.is_editable,
    })
  }

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <Shield className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>配置管理</h2>
          </div>
          <p className={css.fieldDesc}>控制配置项对普通用户的可见与可编辑状态。</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className={css.fieldDesc}>暂无用户设置控制项。</p>
      ) : (
        <div className={css.stack.sm}>
          {data.map((item) => (
            <div key={item.key} className={css.controlRow}>
              <div>
                <p className={css.controlLabel}>{item.label}</p>
                <p className={css.controlKey}>{item.key}</p>
              </div>

              <div className={css.controlToggleLabel}>
                <span>可见</span>
                <Switch
                  checked={item.is_visible}
                  disabled={saveControl.isPending}
                  onCheckedChange={(checked) => handleToggle(item, { is_visible: checked })}
                />
              </div>

              <div className={css.controlToggleLabel}>
                <span>可编辑</span>
                <Switch
                  checked={item.is_editable}
                  disabled={saveControl.isPending}
                  onCheckedChange={(checked) => handleToggle(item, { is_editable: checked })}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* {saveControl.isPending ? <p className={css.fieldDesc}>保存中...</p> : null} */}
    </section>
  )
}

function ProfileSection({ user }: { user: CurrentUser | null }) {
  const updateProfile = useUpdateProfile()
  const setUser = useAuthStore((state) => state.setUser)
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data: publicSystem = {} } = usePublicSystemSettings(['system.allow_username_change'])

  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(user?.username ?? '')
  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

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

        if (!response.ok) {
          throw new Error('加载头像失败')
        }

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
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [accessToken, user?.avatar_media_id])

  const allowUsernameChange =
    user?.role === 'admin' ||
    (publicSystem['system.allow_username_change'] ?? 'true').trim().toLowerCase() !== 'false'

  const dirty =
    username !== (user?.username ?? '') ||
    nickname !== (user?.nickname ?? '') ||
    email !== (user?.email ?? '')

  const reset = () => {
    setUsername(user?.username ?? '')
    setNickname(user?.nickname ?? '')
    setEmail(user?.email ?? '')
    setMessage('')
    setError('')
  }

  const openEditor = () => {
    if (!user) {
      return
    }
    reset()
    setOpen(true)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset()
    }
    setOpen(nextOpen)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      return
    }

    setMessage('')
    setError('')

    updateProfile.mutate(
      { username, nickname, email },
      {
        onSuccess: () => {
          setMessage('账户资料已更新')
          setOpen(false)
        },
        onError: (mutationError) => {
          setError(mutationError.message || '更新失败')
        },
      },
    )
  }

  const handleAvatarUpload = async (file: File) => {
    if (!user) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('仅支持上传图片文件作为头像')
      return
    }

    setError('')
    setMessage('')
    setAvatarUploading(true)

    try {
      const compressedFile = await compressAvatarToLimit(file, MAX_AVATAR_SIZE)
      const formData = new FormData()
      formData.append('file', compressedFile)

      const data = await request<{ file_id: string; url: string }>('/users/me/avatar', {
        method: 'POST',
        body: formData,
      })

      setUser({ ...user, avatar_media_id: data.file_id })
      setMessage(file.size > MAX_AVATAR_SIZE ? '头像上传成功，已自动压缩到 256KB 内。' : '头像上传成功。')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '头像上传失败')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarDelete = async () => {
    if (!user?.avatar_media_id) {
      return
    }

    setError('')
    setMessage('')
    setAvatarUploading(true)

    try {
      await request<null>('/users/me/avatar', { method: 'DELETE' })
      setUser({ ...user, avatar_media_id: null })
      setMessage('头像已删除')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '头像删除失败')
    } finally {
      setAvatarUploading(false)
    }
  }

  if (!user) {
    return null
  }

  const avatarSrc = user.avatar_media_id ? avatarUrl : ''

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <User className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>账户信息</h2>
          </div>
          <p className={css.fieldDesc}>处理头像、昵称、用户名与登录邮箱。</p>
        </div>
      </div>

      {message ? <p className={css.feedback.success}>{message}</p> : null}

      <div className={css.profileRow}>
        <div className={css.profileLeft}>
          <Avatar className={css.avatarLarge}>
            <AvatarImage src={avatarSrc} alt={`${user.nickname || user.username} avatar`} />
            <AvatarFallback className={css.avatarFallbackLarge}>
              {(user.nickname || user.username).slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className={css.infoGrid}>
            <div className={css.infoItem}>
              <p className={css.infoLabel}>昵称</p>
              <p className={css.infoValue}>{user.nickname || '未设置'}</p>
            </div>
            <div className={css.infoItem}>
              <p className={css.infoLabel}>用户名</p>
              <p className={css.infoValue}>{user.username}</p>
            </div>
            <div className={clsx(css.infoItem, css.infoItemWide)}>
              <p className={css.infoLabel}>邮箱</p>
              <p className={css.infoValue}>{user.email}</p>
            </div>
            <div className={css.infoItem}>
              <p className={css.infoLabel}>角色</p>
              <p className={css.infoValue}>{user.role === 'admin' ? '管理员' : '普通用户'}</p>
            </div>
          </div>
        </div>

        <div className={css.row.sm}>
          <PasswordAction onSuccess={setMessage} />

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <Button type="button" variant="outline" size="sm" onClick={openEditor}>
              <Pencil size={16} />
              编辑资料
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑账户资料</DialogTitle>
                <DialogDescription>支持头像上传，超过 256KB 会自动压缩。</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className={css.dialogForm}>
                {error ? <p className={css.feedback.error}>{error}</p> : null}
                {message ? <p className={css.feedback.success}>{message}</p> : null}

                <div className={css.fieldCard}>
                  <div className={css.stack.sm}>
                    <div>
                      <p className={css.fieldLabel}>头像</p>
                      <p className={css.fieldDesc}>建议使用方形头像，系统会在超过 256KB 时自动压缩。</p>
                    </div>

                    <div className={css.uploadRow}>
                      <Avatar className={css.avatarXl}>
                        <AvatarImage src={avatarSrc} alt={`${user.nickname || user.username} avatar`} />
                        <AvatarFallback className={css.avatarFallbackXl}>
                          {(user.nickname || user.username).slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (!file) {
                            return
                          }
                          event.target.value = ''
                          void handleAvatarUpload(file)
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={avatarUploading || updateProfile.isPending}
                        onClick={() => inputRef.current?.click()}
                      >
                        {avatarUploading ? <Loader2 size={16} className={css.spinner} /> : <Camera size={16} />}
                        上传头像
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!user.avatar_media_id || avatarUploading || updateProfile.isPending}
                        onClick={() => void handleAvatarDelete()}
                      >
                        <Trash2 size={16} />
                        删除头像
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={css.dialogFormField}>
                  <label htmlFor="profile-nickname" className={css.dialogFormLabel}>
                    昵称
                  </label>
                  <Input
                    id="profile-nickname"
                    type="text"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="请输入昵称"
                    maxLength={30}
                  />
                </div>

                <div className={css.dialogFormField}>
                  <label htmlFor="profile-username" className={css.dialogFormLabel}>
                    用户名
                  </label>
                  <Input
                    id="profile-username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={!allowUsernameChange || updateProfile.isPending}
                    minLength={3}
                    maxLength={20}
                    pattern="^[a-zA-Z0-9_]+$"
                    required
                  />
                  {!allowUsernameChange && user.role !== 'admin' ? (
                    <span className={css.scopeItemDesc}>管理员已禁止普通用户修改用户名。</span>
                  ) : null}
                </div>

                <div className={css.dialogFormField}>
                  <label htmlFor="profile-email" className={css.dialogFormLabel}>
                    邮箱
                  </label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={reset} disabled={!dirty || updateProfile.isPending}>
                    重置
                  </Button>
                  <Button type="submit" disabled={!dirty || updateProfile.isPending}>
                    {updateProfile.isPending ? '保存中...' : '保存资料'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}

function PasswordAction({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [open, setOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const openEditor = () => {
    resetForm()
    setOpen(true)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    setOpen(nextOpen)
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('新密码长度至少 8 位')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      await request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      })
      onSuccess('密码修改成功')
      resetForm()
      setOpen(false)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '修改密码失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button type="button" variant="outline" size="sm" onClick={openEditor}>
        <Lock size={16} />
        修改密码
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>输入当前密码，并设置一个不少于 8 位的新密码。</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleChangePassword} className={css.dialogForm}>
          {error ? <p className={css.feedback.error}>{error}</p> : null}

          <div className={css.dialogFormField}>
            <label htmlFor="current-password" className={css.dialogFormLabel}>
              当前密码
            </label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className={css.dialogFormField}>
            <label htmlFor="new-password" className={css.dialogFormLabel}>
              新密码
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className={css.dialogFormField}>
            <label htmlFor="confirm-password" className={css.dialogFormLabel}>
              确认新密码
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '修改中...' : '保存新密码'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatDateTime(value: string | null) {
  if (!value) {
    return '从未'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '从未' : date.toLocaleString()
}

function isExpired(value: string | null) {
  if (!value) {
    return false
  }

  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now()
}

function itemLabel(primary?: string | null, fallback?: string | null, empty = '') {
  return primary || fallback || empty
}

const ROLE_LABEL: Record<string, string> = {
  owner: '所有者',
  admin: '管理员',
  user: '普通用户',
}

const ROLE_BADGE_VARIANT: Record<string, 'warning' | 'secondary' | 'outline'> = {
  owner: 'warning',
  admin: 'secondary',
  user: 'outline',
}

function UserAccountsSection({ callerRole }: { callerRole: string }) {
  const currentUser = useAuthStore((state) => state.user)
  const { data, isLoading } = useAdminUsers(1, 100)
  const createUser = useCreateAdminUser()
  const updateUser = useUpdateAdminUser()
  const deleteUser = useDeleteAdminUser()

  const [createOpen, setCreateOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user')
  const [formError, setFormError] = useState('')

  const users = data?.list ?? []

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    createUser.mutate(
      { username: newUsername.trim(), email: newEmail.trim(), password: newPassword, role: newRole },
      {
        onSuccess: () => {
          setCreateOpen(false)
          setNewUsername('')
          setNewEmail('')
          setNewPassword('')
          setNewRole('user')
        },
        onError: (err: unknown) => {
          const message = (err as { message?: string })?.message ?? '创建失败，请重试'
          setFormError(message)
        },
      },
    )
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCreateOpen(false)
      setFormError('')
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      setNewRole('user')
      return
    }
    setCreateOpen(true)
  }

  const toggleActive = (id: string, current: number) => {
    updateUser.mutate({ id, is_active: current === 1 ? 0 : 1 })
  }

  const handleRoleChange = (id: string, role: string) => {
    updateUser.mutate({ id, role })
  }

  const handleDelete = (id: string, username: string) => {
    if (confirm(`确定要删除用户「${username}」吗？此操作不可恢复，该用户的所有数据将被永久删除。`)) {
      deleteUser.mutate(id)
    }
  }

  return (
    <section className={css.section}>
      <div className={css.sectionHeader}>
        <div>
          <div className={css.sectionTitleRow}>
            <UserCog className={css.sectionIcon} size={16} />
            <h2 className={css.sectionTitle}>用户管理</h2>
          </div>
          <p className={css.fieldDesc}>
            {callerRole === 'owner'
              ? '作为所有者，你可以创建管理员和普通用户，并管理所有账号状态。'
              : '作为管理员，你可以创建普通用户并管理其账号状态。'}
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={handleOpenChange}>
          <Button type="button" variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            新建用户
          </Button>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建用户</DialogTitle>
              <DialogDescription>
                {callerRole === 'owner'
                  ? '你可以创建管理员或普通用户账号。'
                  : '你可以创建普通用户账号。'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className={css.dialogForm}>
              <div className={css.dialogFormField}>
                <label htmlFor="new-username" className={css.dialogFormLabel}>用户名</label>
                <Input
                  id="new-username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="3–32 个字符"
                  minLength={3}
                  maxLength={32}
                  required
                />
              </div>

              <div className={css.dialogFormField}>
                <label htmlFor="new-email" className={css.dialogFormLabel}>邮箱</label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className={css.dialogFormField}>
                <label htmlFor="new-password" className={css.dialogFormLabel}>初始密码</label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="至少 8 位"
                  minLength={8}
                  maxLength={64}
                  required
                  autoComplete="new-password"
                />
              </div>

              {callerRole === 'owner' ? (
                <div className={css.dialogFormField}>
                  <label htmlFor="new-role" className={css.dialogFormLabel}>角色</label>
                  <Select
                    value={newRole}
                    onValueChange={(v) => setNewRole(v as 'user' | 'admin')}
                  >
                    <SelectTrigger id="new-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">普通用户</SelectItem>
                      <SelectItem value="admin">管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {formError ? (
                <p className={css.fieldStatus} style={{ color: 'var(--color-error, #ef4444)' }}>
                  {formError}
                </p>
              ) : null}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !newUsername.trim() ||
                    !newEmail.trim() ||
                    !newPassword ||
                    createUser.isPending
                  }
                >
                  {createUser.isPending ? '创建中...' : '创建用户'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className={css.loadingWrapper}>
          <Loader2 size={20} className={css.spinner} />
        </div>
      ) : users.length === 0 ? (
        <div className={css.tokenEmptyState}>
          <Users className={css.tokenEmptyIcon} size={32} />
          <p>暂无用户数据。</p>
        </div>
      ) : (
        <div className={css.tokenList}>
          {users.map((u) => {
            const isSelf = u.id === currentUser?.id
            const isActive = u.is_active === 1
            const canModify = !isSelf && !(callerRole === 'admin' && (u.role === 'admin' || u.role === 'owner'))
            const canChangeRole = !isSelf && callerRole === 'owner' && u.role !== 'owner'

            return (
              <div
                key={u.id}
                className={clsx(
                  css.tokenCardBase,
                  css.tokenCardState[isActive ? 'active' : 'inactive'],
                )}
              >
                <div className={css.tokenBody}>
                  <div className={css.tokenNameRow}>
                    <h3 className={css.tokenName}>
                      {u.nickname || u.username}
                      {isSelf ? (
                        <span className={css.navAdminBadge} style={{ marginLeft: 6 }}>当前账号</span>
                      ) : null}
                    </h3>
                    <Badge variant={ROLE_BADGE_VARIANT[u.role] ?? 'outline'}>
                      {ROLE_LABEL[u.role] ?? u.role}
                    </Badge>
                    {!isActive ? (
                      <span className={css.tokenStatusBadge.disabled}>已禁用</span>
                    ) : null}
                  </div>

                  <div className={css.tokenScopeRow}>
                    <span className={css.tokenMetaValue}>{u.username}</span>
                    <span className={css.tokenMetaValue}>{u.email}</span>
                  </div>
                </div>

                <div className={css.tokenMetaCol}>
                  <div className={css.tokenMetaRow}>
                    <span className={css.tokenMetaLabel}>注册时间:</span>
                    <span className={css.tokenMetaValue}>{formatDateTime(u.created_at)}</span>
                  </div>
                </div>

                {canModify ? (
                  <div className={css.tokenActions}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        type="button"
                        className={css.iconGhostButton}
                        aria-label={`${u.username} 操作菜单`}
                      >
                        <MoreVertical size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleActive(u.id, u.is_active)}
                          disabled={updateUser.isPending}
                        >
                          {isActive ? '禁用账号' : '启用账号'}
                        </DropdownMenuItem>

                        {canChangeRole ? (
                          <>
                            {u.role !== 'admin' ? (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(u.id, 'admin')}
                                disabled={updateUser.isPending}
                              >
                                设为管理员
                              </DropdownMenuItem>
                            ) : null}
                            {u.role !== 'user' ? (
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(u.id, 'user')}
                                disabled={updateUser.isPending}
                              >
                                降级为普通用户
                              </DropdownMenuItem>
                            ) : null}
                          </>
                        ) : null}

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={deleteUser.isPending}
                        >
                          删除账号
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}