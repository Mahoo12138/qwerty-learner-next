import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/core/Dialog'
import { useNavigate } from '@tanstack/react-router'
import { FileUp, Plus, Save, Search, Trash2 } from 'lucide-react'

import {
  useCreateLibrarySubscription,
  useDeleteLibrarySubscription,
  useLibrarySubscriptions,
} from '@/api/library'
import {
  useCreateWord,
  useCreateWordBank,
  useDeleteWord,
  useDeleteWordBank,
  useImportWords,
  useUpdateWord,
  useUpdateWordBank,
  useWordBanks,
  useWords,
} from '@/api/wordBanks'
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
import { Switch } from '@/components/core/Switch'
import { useAuthStore } from '@/stores/authStore'
import * as css from '@/styles/pages/contentWorkspace.css'
import type { LibrarySubscriptionItem, Word } from '@/types/api'

import { ContentDataTable } from './ContentDataTable'
import {
  ContentWorkbench,
  DetailPane,
  EmptyDetail,
  LibraryListPane,
  SectionCard,
  UnavailableCard,
} from './ContentShell'
import {
  canManageLibrary,
  countLabel,
  groupBanksByStage,
  isSubscribed,
  LIBRARY_LANGUAGE_OPTIONS,
  libraryLanguageLabel,
  librarySourceLabel,
  type LibraryCardData,
  normalizeLibraryLanguage,
  subscriptionByLibraryID,
  type ContentStage,
  unavailabilityText,
  visibilityLabel,
} from './contentModel'

interface WordPanelProps {
  wordPage: number
}

const difficultyOptions = [1, 2, 3, 4, 5]

const stageDescription: Record<ContentStage, string> = {
  owned: '只显示你创建的词库，也是在这里创建新库。',
  system: '系统默认词库单独展示。普通用户只读，管理员和站长可维护。',
  discover: '浏览全站公开词库，挑需要的直接订阅。',
  subscriptions: '已订阅的词库与失效订阅位都保留在这里。',
}

export function WordPanel({ wordPage }: WordPanelProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [stage, setStage] = useState<ContentStage>('owned')
  const [selectedLibraryID, setSelectedLibraryID] = useState('')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [difficulty, setDifficulty] = useState(0)

  const [createBankOpen, setCreateBankOpen] = useState(false)
  const [editBankOpen, setEditBankOpen] = useState(false)
  const [createWordOpen, setCreateWordOpen] = useState(false)
  const [activeWord, setActiveWord] = useState<Word | null>(null)
  const [wordDialogOpen, setWordDialogOpen] = useState(false)

  const [bankName, setBankName] = useState('')
  const [bankDescription, setBankDescription] = useState('')
  const [bankLanguage, setBankLanguage] = useState('en')
  const [bankIsPublic, setBankIsPublic] = useState(true)

  const [editingBankName, setEditingBankName] = useState('')
  const [editingBankDescription, setEditingBankDescription] = useState('')
  const [editingBankLanguage, setEditingBankLanguage] = useState('en')
  const [editingBankIsPublic, setEditingBankIsPublic] = useState(true)

  const [wordContent, setWordContent] = useState('')
  const [wordDefinition, setWordDefinition] = useState('')
  const [wordPronunciation, setWordPronunciation] = useState('')
  const [wordExample, setWordExample] = useState('')
  const [wordTags, setWordTags] = useState('')
  const [wordDifficulty, setWordDifficulty] = useState('3')

  const { data: banks = [] } = useWordBanks()
  const { data: subscriptions = [] } = useLibrarySubscriptions('word_bank')
  const createSubscription = useCreateLibrarySubscription()
  const deleteSubscription = useDeleteLibrarySubscription()

  const createBank = useCreateWordBank()
  const updateBank = useUpdateWordBank()
  const deleteBank = useDeleteWordBank()
  const createWord = useCreateWord()
  const updateWord = useUpdateWord()
  const deleteWord = useDeleteWord()
  const importWords = useImportWords()

  const pageSize = 20

  function updateWordPage(next: number, replace = false) {
    void navigate({
      to: '/content',
      search: (prev) => ({ ...prev, tab: 'word', wordPage: Math.max(1, next) }),
      replace,
    })
  }

  const banksByStage = useMemo(() => groupBanksByStage(banks, user), [banks, user])
  const bankMap = useMemo(() => new Map(banks.map((bank) => [bank.id, bank])), [banks])

  const listItems = useMemo<LibraryCardData[]>(() => {
    if (stage === 'subscriptions') {
      return subscriptions.map((subscription) => {
        const bank = bankMap.get(subscription.library_id)
        return {
          id: subscription.library_id,
          title: subscription.library_name,
          caption:
            bank?.description ||
            (subscription.is_available === 1 ? '订阅中的公开词库。' : '订阅入口已失效。'),
          meta: bank ? countLabel('word_bank', bank.word_count) : '不可用',
          badges: [
            {
              label: subscription.is_available === 1 ? '可访问' : '不可用',
              variant: subscription.is_available === 1 ? 'success' : 'warning',
            },
            { label: bank ? visibilityLabel(bank.is_public) : '状态保留', variant: 'outline' },
            { label: libraryLanguageLabel(bank?.language), variant: 'secondary' },
          ],
        }
      })
    }

    return banksByStage[stage].map((bank) => ({
      id: bank.id,
      title: bank.name,
      caption: bank.description || `${librarySourceLabel(bank, user)}词库`,
      meta: countLabel('word_bank', bank.word_count),
      badges: [
        {
          label: visibilityLabel(bank.is_public),
          variant: bank.is_public === 1 ? 'success' : 'outline',
        },
        { label: libraryLanguageLabel(bank.language), variant: 'secondary' },
        ...(isSubscribed(subscriptions, bank.id)
          ? [{ label: '已订阅', variant: 'default' as const }]
          : []),
      ],
    }))
  }, [bankMap, banksByStage, stage, subscriptions, user])

  const selectionSignature = listItems.map((item) => item.id).join('|')

  useEffect(() => {
    if (listItems.some((item) => item.id === selectedLibraryID)) {
      return
    }
    setSelectedLibraryID(listItems[0]?.id ?? '')
  }, [listItems, selectionSignature, selectedLibraryID])

  const selectedSubscription = useMemo(
    () => subscriptionByLibraryID(subscriptions, selectedLibraryID),
    [selectedLibraryID, subscriptions],
  )
  const selectedBank = useMemo(
    () => bankMap.get(selectedLibraryID) ?? null,
    [bankMap, selectedLibraryID],
  )
  const canEdit = canManageLibrary(selectedBank, user)
  const subscribed = selectedBank ? isSubscribed(subscriptions, selectedBank.id) : false
  const subscriptionUnavailable =
    stage === 'subscriptions' &&
    !!selectedSubscription &&
    (selectedSubscription.is_available !== 1 || !selectedBank)

  useEffect(() => {
    if (!selectedBank) {
      setEditingBankName('')
      setEditingBankDescription('')
      setEditingBankLanguage('en')
      setEditingBankIsPublic(true)
      return
    }
    setEditingBankName(selectedBank.name)
    setEditingBankDescription(selectedBank.description || '')
    setEditingBankLanguage(normalizeLibraryLanguage(selectedBank.language))
    setEditingBankIsPublic(selectedBank.is_public === 1)
  }, [selectedBank])

  const { data: wordsData } = useWords(
    selectedBank?.id ?? '',
    wordPage,
    pageSize,
    deferredSearch,
    difficulty,
  )
  const words = wordsData?.list ?? []
  const totalPages = Math.max(1, Math.ceil((wordsData?.total ?? 0) / pageSize))

  useEffect(() => {
    if (wordPage <= totalPages) {
      return
    }
    updateWordPage(totalPages, true)
  }, [totalPages, wordPage])

  function handleStageChange(next: ContentStage) {
    startTransition(() => {
      setStage(next)
      setSelectedLibraryID('')
      setSearch('')
      setDifficulty(0)
    })
    updateWordPage(1, true)
  }

  function handleSelectLibrary(id: string) {
    setSelectedLibraryID(id)
    updateWordPage(1, true)
  }

  function handleCreateBank() {
    if (!bankName.trim()) {
      return
    }
    createBank.mutate(
      {
        name: bankName.trim(),
        description: bankDescription.trim(),
        language: bankLanguage.trim() || 'en',
        is_public: bankIsPublic ? 1 : 0,
      },
      {
        onSuccess: (bank) => {
          startTransition(() => {
            setStage('owned')
            setSelectedLibraryID(bank.id)
          })
          setCreateBankOpen(false)
          setBankName('')
          setBankDescription('')
          setBankLanguage('en')
          setBankIsPublic(true)
          updateWordPage(1, true)
        },
      },
    )
  }

  function handleSaveBank() {
    if (!selectedBank || !editingBankName.trim()) {
      return
    }
    updateBank.mutate(
      {
        id: selectedBank.id,
        name: editingBankName.trim(),
        description: editingBankDescription.trim(),
        language: editingBankLanguage.trim() || 'en',
        is_public: editingBankIsPublic ? 1 : 0,
      },
      {
        onSuccess: () => {
          setEditBankOpen(false)
        },
      },
    )
  }

  function handleDeleteBank() {
    if (!selectedBank) {
      return
    }
    if (!window.confirm(`确定删除词库「${selectedBank.name}」吗？`)) {
      return
    }
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setEditBankOpen(false)
        setSelectedLibraryID('')
        updateWordPage(1, true)
      },
    })
  }

  function handleCreateWord() {
    if (!selectedBank || !wordContent.trim()) {
      return
    }
    createWord.mutate(
      {
        bankId: selectedBank.id,
        content: wordContent.trim(),
        definition: wordDefinition.trim(),
        pronunciation: wordPronunciation.trim(),
        example_sentence: wordExample.trim(),
        tags: wordTags.trim(),
        difficulty: Number(wordDifficulty),
      },
      {
        onSuccess: () => {
          setCreateWordOpen(false)
          setWordContent('')
          setWordDefinition('')
          setWordPronunciation('')
          setWordExample('')
          setWordTags('')
          setWordDifficulty('3')
        },
      },
    )
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !selectedBank) {
      return
    }
    const format = file.name.endsWith('.csv') ? 'csv' : 'json'
    importWords.mutate({ bankId: selectedBank.id, file, format })
    event.target.value = ''
  }

  function handleToggleSubscription() {
    if (!selectedBank) {
      return
    }
    if (subscribed) {
      deleteSubscription.mutate({ libraryType: 'word_bank', libraryId: selectedBank.id })
      return
    }
    createSubscription.mutate({ library_type: 'word_bank', library_id: selectedBank.id })
  }

  function handleRemoveSubscription(subscription?: LibrarySubscriptionItem) {
    if (!subscription) {
      return
    }
    deleteSubscription.mutate({
      libraryType: 'word_bank',
      libraryId: subscription.library_id,
    })
  }

  const wordColumns = useMemo<ColumnDef<Word>[]>(
    () => [
      {
        header: '词条',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.content}</span>
            <span className={css.tableSecondaryText}>{row.original.pronunciation || '未填写发音'}</span>
          </div>
        ),
      },
      {
        header: '释义',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.definition || '暂无释义'}</span>
            <span className={css.tableSecondaryText}>{row.original.example_sentence || '未填写例句'}</span>
          </div>
        ),
      },
      {
        header: '难度',
        cell: ({ row }) => <Badge variant="outline">难度 {row.original.difficulty}</Badge>,
      },
      {
        header: '标签',
        cell: ({ row }) => <span className={css.tableSecondaryText}>{row.original.tags || '无'}</span>,
      },
      {
        header: '操作',
        cell: ({ row }) => (
          <div className={css.tableActionGroup}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveWord(row.original)
                setWordDialogOpen(true)
              }}
            >
              {canEdit ? '编辑' : '查看'}
            </Button>
          </div>
        ),
      },
    ],
    [canEdit],
  )

  const stageCounts = {
    owned: banksByStage.owned.length,
    system: banksByStage.system.length,
    discover: banksByStage.discover.length,
    subscriptions: subscriptions.length,
  }

  return (
    <>
    <ContentWorkbench
      stage={stage}
      counts={stageCounts}
      onChange={handleStageChange}
    >
      <LibraryListPane
        title="词库来源"
        description={stageDescription[stage]}
        items={listItems}
        selectedID={selectedLibraryID}
        onSelect={handleSelectLibrary}
        empty={
          stage === 'owned'
            ? '还没有词库，点击右上角按钮新建一个。'
            : '当前来源下还没有可展示的词库。'
        }
        extra={
          stage === 'owned' ? (
            <Button size="sm" onClick={() => setCreateBankOpen(true)}>
              <Plus size={14} />
              新建词库
            </Button>
          ) : undefined
        }
      />

      {subscriptionUnavailable && selectedSubscription ? (
        <DetailPane
          kicker="我的订阅"
          title={selectedSubscription.library_name}
          description="订阅记录保留，但源库已经不可直接使用。"
          meta={
            <>
              <Badge variant="warning">不可用</Badge>
              <Badge variant="outline">词库订阅</Badge>
            </>
          }
          actions={
            <Button
              variant="destructive"
              onClick={() => handleRemoveSubscription(selectedSubscription)}
              disabled={deleteSubscription.isPending}
            >
              取消订阅
            </Button>
          }
        >
          <UnavailableCard
            title="订阅入口已保留"
            body={unavailabilityText(selectedSubscription.unavailable_reason)}
          />
        </DetailPane>
      ) : !selectedBank ? (
        <DetailPane
          kicker="词库详情"
          title={stage === 'owned' ? '先创建一个词库' : '选择一个词库'}
          description={stageDescription[stage]}
        >


          <EmptyDetail
            title="把来源和内容分开处理"
            body="这次重构后，词库不再混放在一个简单列表里。先从左侧选来源，再决定是编辑、查看，还是订阅。"
          />
        </DetailPane>
      ) : (
        <DetailPane
          kicker={librarySourceLabel(selectedBank, user)}
          title={selectedBank.name}
          description={selectedBank.description || '这套词库还没有补充说明。'}
          meta={
            <>
              <Badge variant="secondary">{libraryLanguageLabel(selectedBank.language)}</Badge>
              <Badge variant={selectedBank.is_public === 1 ? 'success' : 'outline'}>
                {visibilityLabel(selectedBank.is_public)}
              </Badge>
              <Badge variant="outline">{countLabel('word_bank', selectedBank.word_count)}</Badge>
              {subscribed ? <Badge variant="default">已订阅</Badge> : null}
            </>
          }
          actions={
            <>
              {selectedBank.owner_id !== user?.id ? (
                <Button
                  variant={subscribed ? 'outline' : 'default'}
                  onClick={handleToggleSubscription}
                  disabled={createSubscription.isPending || deleteSubscription.isPending}
                >
                  {subscribed ? '取消订阅' : '订阅词库'}
                </Button>
              ) : null}
              {canEdit ? (
                <Button variant="outline" onClick={() => setEditBankOpen(true)}>
                  编辑词库
                </Button>
              ) : null}
              {canEdit ? (
                <label className={css.fileInputLabel}>
                  <FileUp size={14} />
                  导入词条
                  <input
                    className={css.hiddenFileInput}
                    type="file"
                    accept=".json,.csv"
                    onChange={handleImport}
                  />
                </label>
              ) : null}
            </>
          }
        >
          <SectionCard
            title="词条筛选"
            description="搜索和难度只作用于当前选中的词库。"
            actions={<Badge variant="outline">共 {wordsData?.total ?? 0} 条</Badge>}
          >
            <div className={css.toolbar}>
              <div className={`${css.searchField} ${css.toolbarGrow}`}>
                <Search className={css.searchFieldIcon} size={16} />
                <Input
                  className={css.searchInput}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    updateWordPage(1, true)
                  }}
                  placeholder="搜索词条、释义或标签"
                />
              </div>

              <Select
                value={String(difficulty)}
                onValueChange={(value) => {
                  setDifficulty(Number(value))
                  updateWordPage(1, true)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">全部难度</SelectItem>
                  {difficultyOptions.map((item) => (
                    <SelectItem key={item} value={String(item)}>难度 {item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {wordsData && wordsData.total > pageSize ? (
              <div className={css.rowActions}>
                <Button variant="outline" onClick={() => updateWordPage(wordPage - 1)} disabled={wordPage <= 1}>
                  上一页
                </Button>
                <Badge variant="outline">
                  第 {wordPage} / {totalPages} 页
                </Badge>
                <Button variant="outline" onClick={() => updateWordPage(wordPage + 1)} disabled={wordPage >= totalPages}>
                  下一页
                </Button>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard
            title="词条清单"
            description="列表只保留轻量预览，编辑和查看都走弹窗。"
            actions={
              <div className={css.rowActions}>
                <Badge variant="outline">共 {wordsData?.total ?? 0} 条</Badge>
                {canEdit ? (
                  <Button size="sm" onClick={() => setCreateWordOpen(true)}>
                    <Plus size={14} />
                    新增词条
                  </Button>
                ) : null}
              </div>
            }
          >
            {words.length === 0 ? (
              <EmptyDetail
                title="还没有词条"
                body={canEdit ? '先添加几条词汇，或者通过导入快速建库。' : '这个词库暂时没有可展示的词条。'}
              />
            ) : (
              <ContentDataTable ariaLabel="词条清单" data={words} columns={wordColumns} />
            )}
          </SectionCard>
        </DetailPane>
      )}
    </ContentWorkbench>

    <Dialog open={createBankOpen} onOpenChange={setCreateBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建词库</DialogTitle>
          <DialogDescription>用语言和公开状态先定义这套训练内容的边界。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <div className={css.formGridTwo}>
            <Input
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              placeholder="词库名称"
            />
            <Select value={bankLanguage} onValueChange={setBankLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIBRARY_LANGUAGE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            value={bankDescription}
            onChange={(event) => setBankDescription(event.target.value)}
            placeholder="词库说明（可选）"
          />
          <div className={css.switchRow}>
            <div className={css.switchText}>
              <p className={css.switchTitle}>公开到发现页</p>
              <p className={css.switchDescription}>打开后其他用户可以在"公开发现"里看到并订阅。</p>
            </div>
            <Switch checked={bankIsPublic} onCheckedChange={setBankIsPublic} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleCreateBank} disabled={createBank.isPending}>
            <Plus size={14} />
            创建词库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={editBankOpen} onOpenChange={setEditBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑词库设置</DialogTitle>
          <DialogDescription>调整名称、语言、简介和公开状态，删除操作也集中在这里。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <div className={css.formGridTwo}>
            <Input
              value={editingBankName}
              onChange={(event) => setEditingBankName(event.target.value)}
              placeholder="词库名称"
            />
            <Select value={editingBankLanguage} onValueChange={setEditingBankLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIBRARY_LANGUAGE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            value={editingBankDescription}
            onChange={(event) => setEditingBankDescription(event.target.value)}
            placeholder="词库说明"
          />
          <div className={css.switchRow}>
            <div className={css.switchText}>
              <p className={css.switchTitle}>公开词库</p>
              <p className={css.switchDescription}>关闭后不会再出现在公开发现里，但历史订阅仍会保留占位。</p>
            </div>
            <Switch checked={editingBankIsPublic} onCheckedChange={setEditingBankIsPublic} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDeleteBank} disabled={deleteBank.isPending}>
            <Trash2 size={14} />
            删除
          </Button>
          <Button onClick={handleSaveBank} disabled={updateBank.isPending}>
            <Save size={14} />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={createWordOpen} onOpenChange={setCreateWordOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增词条</DialogTitle>
          <DialogDescription>把单词、释义、发音和例句一次补齐，后续筛选和训练会更完整。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <div className={css.formGridThree}>
            <Input value={wordContent} onChange={(event) => setWordContent(event.target.value)} placeholder="单词 *" />
            <Input value={wordPronunciation} onChange={(event) => setWordPronunciation(event.target.value)} placeholder="发音 / 音标" />
            <Input value={wordTags} onChange={(event) => setWordTags(event.target.value)} placeholder="标签，例如 cet4, 高频" />
          </div>
          <Input value={wordDefinition} onChange={(event) => setWordDefinition(event.target.value)} placeholder="释义" />
          <textarea
            className={css.compactTextarea}
            value={wordExample}
            onChange={(event) => setWordExample(event.target.value)}
            placeholder="例句（可选）"
          />
          <Select value={wordDifficulty} onValueChange={setWordDifficulty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((item) => (
                <SelectItem key={item} value={String(item)}>难度 {item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button onClick={handleCreateWord} disabled={createWord.isPending}>
            <Plus size={14} />
            添加词条
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      open={wordDialogOpen}
      onOpenChange={(open) => {
        setWordDialogOpen(open)
        if (!open) {
          setActiveWord(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{canEdit ? '编辑词条' : '查看词条'}</DialogTitle>
          <DialogDescription>列表只做预览，详细内容和编辑操作都放在弹窗里完成。</DialogDescription>
        </DialogHeader>
        {activeWord ? (
          <WordRowCard
            word={activeWord}
            canEdit={canEdit}
            onDelete={() =>
              deleteWord.mutate(activeWord.id, {
                onSuccess: () => {
                  setWordDialogOpen(false)
                  setActiveWord(null)
                },
              })
            }
            onSave={(payload) =>
              updateWord.mutate(
                { wordId: activeWord.id, ...payload },
                {
                  onSuccess: () => {
                    setWordDialogOpen(false)
                    setActiveWord(null)
                  },
                },
              )
            }
          />
        ) : null}
      </DialogContent>
    </Dialog>
    </>
  )
}

function WordRowCard({
  word,
  canEdit,
  onSave,
  onDelete,
}: {
  word: Word
  canEdit: boolean
  onSave: (payload: {
    content: string
    definition: string
    pronunciation: string
    example_sentence: string
    tags: string
    difficulty: number
  }) => void
  onDelete: () => void
}) {
  const [content, setContent] = useState(word.content)
  const [definition, setDefinition] = useState(word.definition || '')
  const [pronunciation, setPronunciation] = useState(word.pronunciation || '')
  const [exampleSentence, setExampleSentence] = useState(word.example_sentence || '')
  const [tags, setTags] = useState(word.tags || '')
  const [difficulty, setDifficulty] = useState(String(word.difficulty || 3))

  useEffect(() => {
    setContent(word.content)
    setDefinition(word.definition || '')
    setPronunciation(word.pronunciation || '')
    setExampleSentence(word.example_sentence || '')
    setTags(word.tags || '')
    setDifficulty(String(word.difficulty || 3))
  }, [word])

  if (!canEdit) {
    return (
      <div className={`${css.rowCard} ${css.rowCardReadOnly}`}>
        <div className={css.rowHeader}>
          <div>
            <h3 className={css.rowTitle}>{word.content}</h3>
            <p className={css.rowText}>{word.definition || '暂无释义'}</p>
          </div>
          <div className={css.rowMeta}>
            <Badge variant="outline">难度 {word.difficulty}</Badge>
            {word.pronunciation ? <Badge variant="secondary">{word.pronunciation}</Badge> : null}
          </div>
        </div>
        {word.example_sentence ? <p className={css.rowText}>{word.example_sentence}</p> : null}
        {word.tags ? <p className={css.helperText}>标签: {word.tags}</p> : null}
      </div>
    )
  }

  return (
    <div className={css.rowCard}>
      <div className={css.rowHeader}>
        <div>
          <h3 className={css.rowTitle}>{word.content}</h3>
          <p className={css.helperText}>更新词条内容后，新的练习会使用最新文本，历史记录仍按后端历史策略保留。</p>
        </div>
        <div className={css.rowMeta}>
          <Badge variant="outline">难度 {difficulty}</Badge>
          {pronunciation ? <Badge variant="secondary">{pronunciation}</Badge> : null}
        </div>
      </div>

      <div className={css.formGridThree}>
        <Input value={content} onChange={(event) => setContent(event.target.value)} placeholder="单词" />
        <Input value={pronunciation} onChange={(event) => setPronunciation(event.target.value)} placeholder="发音 / 音标" />
        <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="标签" />
      </div>
      <Input value={definition} onChange={(event) => setDefinition(event.target.value)} placeholder="释义" />
      <textarea
        className={css.compactTextarea}
        value={exampleSentence}
        onChange={(event) => setExampleSentence(event.target.value)}
        placeholder="例句"
      />

      <div className={css.rowActions}>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map((item) => (
              <SelectItem key={item} value={String(item)}>难度 {item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            onSave({
              content: content.trim(),
              definition: definition.trim(),
              pronunciation: pronunciation.trim(),
              example_sentence: exampleSentence.trim(),
              tags: tags.trim(),
              difficulty: Number(difficulty),
            })
          }
        >
          <Save size={14} />
          保存词条
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 size={14} />
          删除
        </Button>
      </div>
    </div>
  )
}
