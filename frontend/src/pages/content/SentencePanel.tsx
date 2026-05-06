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
import { FileUp, Plus, Save, Search, Trash2 } from 'lucide-react'

import {
  useCreateLibrarySubscription,
  useDeleteLibrarySubscription,
  useLibrarySubscriptions,
} from '@/api/library'
import {
  useCreateSentence,
  useCreateSentenceBank,
  useDeleteSentence,
  useDeleteSentenceBank,
  useImportSentences,
  useSentenceBanks,
  useSentences,
  useUpdateSentence,
  useUpdateSentenceBank,
} from '@/api/sentenceBanks'
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
import type { LibrarySubscriptionItem, Sentence } from '@/types/api'

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
  librarySourceLabel,
  type LibraryCardData,
  subscriptionByLibraryID,
  type ContentStage,
  unavailabilityText,
  visibilityLabel,
} from './contentModel'

const difficultyOptions = [1, 2, 3, 4, 5]

const stageDescription: Record<ContentStage, string> = {
  owned: '只显示你创建的句库，也是在这里创建新库。',
  system: '系统默认句库单独展示。普通用户只读，管理员和站长可维护。',
  discover: '浏览全站公开句库，挑需要的直接订阅。',
  subscriptions: '已订阅的句库与失效订阅位都保留在这里。',
}

export function SentencePanel() {
  const user = useAuthStore((state) => state.user)

  const [stage, setStage] = useState<ContentStage>('owned')
  const [selectedLibraryID, setSelectedLibraryID] = useState('')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [difficulty, setDifficulty] = useState(0)

  const [createBankOpen, setCreateBankOpen] = useState(false)
  const [editBankOpen, setEditBankOpen] = useState(false)
  const [createSentenceOpen, setCreateSentenceOpen] = useState(false)
  const [activeSentence, setActiveSentence] = useState<Sentence | null>(null)
  const [sentenceDialogOpen, setSentenceDialogOpen] = useState(false)

  const [bankName, setBankName] = useState('')
  const [bankCategory, setBankCategory] = useState('')
  const [bankIsPublic, setBankIsPublic] = useState(true)

  const [editingBankName, setEditingBankName] = useState('')
  const [editingBankCategory, setEditingBankCategory] = useState('')
  const [editingBankIsPublic, setEditingBankIsPublic] = useState(true)

  const [sentenceContent, setSentenceContent] = useState('')
  const [sentenceTranslation, setSentenceTranslation] = useState('')
  const [sentenceTranslationSource, setSentenceTranslationSource] = useState('')
  const [sentenceSource, setSentenceSource] = useState('')
  const [sentenceTags, setSentenceTags] = useState('')
  const [sentenceDifficulty, setSentenceDifficulty] = useState('3')

  const { data: banks = [] } = useSentenceBanks()
  const { data: subscriptions = [] } = useLibrarySubscriptions('sentence_bank')
  const createSubscription = useCreateLibrarySubscription()
  const deleteSubscription = useDeleteLibrarySubscription()

  const createBank = useCreateSentenceBank()
  const updateBank = useUpdateSentenceBank()
  const deleteBank = useDeleteSentenceBank()
  const createSentence = useCreateSentence()
  const updateSentence = useUpdateSentence()
  const deleteSentence = useDeleteSentence()
  const importSentences = useImportSentences()

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
            bank?.category ||
            (subscription.is_available === 1 ? '订阅中的公开句库。' : '订阅入口已失效。'),
          meta: bank ? countLabel('sentence_bank', bank.sentence_count) : '不可用',
          badges: [
            {
              label: subscription.is_available === 1 ? '可访问' : '不可用',
              variant: subscription.is_available === 1 ? 'success' : 'warning',
            },
            { label: bank ? visibilityLabel(bank.is_public) : '状态保留', variant: 'outline' },
            { label: bank?.category || '未分类', variant: 'secondary' },
          ],
        }
      })
    }

    return banksByStage[stage].map((bank) => ({
      id: bank.id,
      title: bank.name,
      caption: bank.category || `${librarySourceLabel(bank, user)}句库`,
      meta: countLabel('sentence_bank', bank.sentence_count),
      badges: [
        {
          label: visibilityLabel(bank.is_public),
          variant: bank.is_public === 1 ? 'success' : 'outline',
        },
        { label: bank.category || '未分类', variant: 'secondary' },
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
      setEditingBankCategory('')
      setEditingBankIsPublic(true)
      return
    }
    setEditingBankName(selectedBank.name)
    setEditingBankCategory(selectedBank.category || '')
    setEditingBankIsPublic(selectedBank.is_public === 1)
  }, [selectedBank])

  const { data: sentencesData } = useSentences(
    selectedBank?.id ?? '',
    1,
    100,
    deferredSearch,
    difficulty,
  )
  const sentences = sentencesData?.list ?? []

  function handleStageChange(next: ContentStage) {
    startTransition(() => {
      setStage(next)
      setSelectedLibraryID('')
      setSearch('')
      setDifficulty(0)
    })
  }

  function handleSelectLibrary(id: string) {
    setSelectedLibraryID(id)
  }

  function handleCreateBank() {
    if (!bankName.trim()) {
      return
    }
    createBank.mutate(
      {
        name: bankName.trim(),
        category: bankCategory.trim(),
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
          setBankCategory('')
          setBankIsPublic(true)
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
        category: editingBankCategory.trim(),
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
    if (!window.confirm(`确定删除句库「${selectedBank.name}」吗？`)) {
      return
    }
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setEditBankOpen(false)
        setSelectedLibraryID('')
      },
    })
  }

  function handleCreateSentence() {
    if (!selectedBank || !sentenceContent.trim()) {
      return
    }
    createSentence.mutate(
      {
        bankId: selectedBank.id,
        content: sentenceContent.trim(),
        translation: sentenceTranslation.trim(),
        translation_source: sentenceTranslationSource.trim(),
        source: sentenceSource.trim(),
        tags: sentenceTags.trim(),
        difficulty: Number(sentenceDifficulty),
      },
      {
        onSuccess: () => {
          setCreateSentenceOpen(false)
          setSentenceContent('')
          setSentenceTranslation('')
          setSentenceTranslationSource('')
          setSentenceSource('')
          setSentenceTags('')
          setSentenceDifficulty('3')
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
    importSentences.mutate({ bankId: selectedBank.id, file, format })
    event.target.value = ''
  }

  function handleToggleSubscription() {
    if (!selectedBank) {
      return
    }
    if (subscribed) {
      deleteSubscription.mutate({ libraryType: 'sentence_bank', libraryId: selectedBank.id })
      return
    }
    createSubscription.mutate({ library_type: 'sentence_bank', library_id: selectedBank.id })
  }

  function handleRemoveSubscription(subscription?: LibrarySubscriptionItem) {
    if (!subscription) {
      return
    }
    deleteSubscription.mutate({
      libraryType: 'sentence_bank',
      libraryId: subscription.library_id,
    })
  }

  const sentenceColumns = useMemo<ColumnDef<Sentence>[]>(
    () => [
      {
        header: '句子',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.content}</span>
            <span className={css.tableSecondaryText}>{row.original.translation || '暂无翻译'}</span>
          </div>
        ),
      },
      {
        header: '来源',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.source || '未填写来源'}</span>
            <span className={css.tableSecondaryText}>{row.original.translation_source || '未填写翻译来源'}</span>
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
                setActiveSentence(row.original)
                setSentenceDialogOpen(true)
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
        title="句库来源"
        description={stageDescription[stage]}
        items={listItems}
        selectedID={selectedLibraryID}
        onSelect={handleSelectLibrary}
        empty={
          stage === 'owned'
            ? '还没有句库，点击右上角按钮新建一个。'
            : '当前来源下还没有可展示的句库。'
        }
        extra={
          stage === 'owned' ? (
            <Button size="sm" onClick={() => setCreateBankOpen(true)}>
              <Plus size={14} />
              新建句库
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
              <Badge variant="outline">句库订阅</Badge>
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
          kicker="句库详情"
          title={stage === 'owned' ? '先创建一个句库' : '选择一个句库'}
          description={stageDescription[stage]}
        >
          <EmptyDetail
            title="句子管理也切成四条泳道"
            body="系统默认句库和公开句库不再混在同一个管理列表里，订阅入口也会一直保留。"
          />
        </DetailPane>
      ) : (
        <DetailPane
          kicker={librarySourceLabel(selectedBank, user)}
          title={selectedBank.name}
          description={selectedBank.category || '这套句库还没有分类描述。'}
          meta={
            <>
              <Badge variant="secondary">{selectedBank.category || '未分类'}</Badge>
              <Badge variant={selectedBank.is_public === 1 ? 'success' : 'outline'}>
                {visibilityLabel(selectedBank.is_public)}
              </Badge>
              <Badge variant="outline">{countLabel('sentence_bank', selectedBank.sentence_count)}</Badge>
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
                  {subscribed ? '取消订阅' : '订阅句库'}
                </Button>
              ) : null}
              {canEdit ? (
                <Button variant="outline" onClick={() => setEditBankOpen(true)}>
                  编辑句库
                </Button>
              ) : null}
              {canEdit ? (
                <label className={css.fileInputLabel}>
                  <FileUp size={14} />
                  导入句子
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
            title="句子筛选"
            description="搜索和难度只作用于当前选中的句库。"
            actions={<Badge variant="outline">共 {sentencesData?.total ?? 0} 条</Badge>}
          >
            <div className={css.toolbar}>
              <div className={`${css.searchField} ${css.toolbarGrow}`}>
                <Search className={css.searchFieldIcon} size={16} />
                <Input
                  className={css.searchInput}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索句子、翻译、来源或标签"
                />
              </div>

              <Select value={String(difficulty)} onValueChange={(value) => setDifficulty(Number(value))}>
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
          </SectionCard>

          <SectionCard
            title="句子清单"
            description="列表只保留轻量预览，编辑和查看都走弹窗。"
            actions={
              <div className={css.rowActions}>
                <Badge variant="outline">共 {sentencesData?.total ?? 0} 条</Badge>
                {canEdit ? (
                  <Button size="sm" onClick={() => setCreateSentenceOpen(true)}>
                    <Plus size={14} />
                    新增句子
                  </Button>
                ) : null}
              </div>
            }
          >
            {sentences.length === 0 ? (
              <EmptyDetail
                title="还没有句子"
                body={canEdit ? '先添加几条句子，或者通过导入快速建库。' : '这个句库暂时没有可展示的句子。'}
              />
            ) : (
              <ContentDataTable ariaLabel="句子清单" data={sentences} columns={sentenceColumns} />
            )}
          </SectionCard>
        </DetailPane>
      )}
    </ContentWorkbench>

    <Dialog open={createBankOpen} onOpenChange={setCreateBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建句库</DialogTitle>
          <DialogDescription>分类和公开状态决定它会被谁看到、怎么被发现。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <div className={css.formGridTwo}>
            <Input
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              placeholder="句库名称"
            />
            <Input
              value={bankCategory}
              onChange={(event) => setBankCategory(event.target.value)}
              placeholder="分类，例如 商务 / 考试 / 口语"
            />
          </div>
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
            创建句库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={editBankOpen} onOpenChange={setEditBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑句库设置</DialogTitle>
          <DialogDescription>调整名称、分类和公开状态，删除操作也集中在这里。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <div className={css.formGridTwo}>
            <Input
              value={editingBankName}
              onChange={(event) => setEditingBankName(event.target.value)}
              placeholder="句库名称"
            />
            <Input
              value={editingBankCategory}
              onChange={(event) => setEditingBankCategory(event.target.value)}
              placeholder="分类"
            />
          </div>
          <div className={css.switchRow}>
            <div className={css.switchText}>
              <p className={css.switchTitle}>公开句库</p>
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

    <Dialog open={createSentenceOpen} onOpenChange={setCreateSentenceOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增句子</DialogTitle>
          <DialogDescription>把句子、翻译、来源和标签录进弹窗里，列表区只负责浏览。</DialogDescription>
        </DialogHeader>
        <div className={css.dialogStack}>
          <textarea
            className={css.compactTextarea}
            value={sentenceContent}
            onChange={(event) => setSentenceContent(event.target.value)}
            placeholder="句子内容 *"
          />
          <textarea
            className={css.compactTextarea}
            value={sentenceTranslation}
            onChange={(event) => setSentenceTranslation(event.target.value)}
            placeholder="翻译（可选）"
          />
          <div className={css.formGridThree}>
            <Input value={sentenceSource} onChange={(event) => setSentenceSource(event.target.value)} placeholder="来源" />
            <Input value={sentenceTranslationSource} onChange={(event) => setSentenceTranslationSource(event.target.value)} placeholder="翻译来源" />
            <Input value={sentenceTags} onChange={(event) => setSentenceTags(event.target.value)} placeholder="标签" />
          </div>
          <Select value={sentenceDifficulty} onValueChange={setSentenceDifficulty}>
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
          <Button onClick={handleCreateSentence} disabled={createSentence.isPending}>
            <Plus size={14} />
            添加句子
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      open={sentenceDialogOpen}
      onOpenChange={(open) => {
        setSentenceDialogOpen(open)
        if (!open) {
          setActiveSentence(null)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{canEdit ? '编辑句子' : '查看句子'}</DialogTitle>
          <DialogDescription>列表只做预览，详细内容和编辑操作都放在弹窗里完成。</DialogDescription>
        </DialogHeader>
        {activeSentence ? (
          <SentenceRowCard
            sentence={activeSentence}
            canEdit={canEdit}
            onDelete={() =>
              deleteSentence.mutate(activeSentence.id, {
                onSuccess: () => {
                  setSentenceDialogOpen(false)
                  setActiveSentence(null)
                },
              })
            }
            onSave={(payload) =>
              updateSentence.mutate(
                { sentenceId: activeSentence.id, ...payload },
                {
                  onSuccess: () => {
                    setSentenceDialogOpen(false)
                    setActiveSentence(null)
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

function SentenceRowCard({
  sentence,
  canEdit,
  onSave,
  onDelete,
}: {
  sentence: Sentence
  canEdit: boolean
  onSave: (payload: {
    content: string
    translation: string
    translation_source: string
    source: string
    tags: string
    difficulty: number
  }) => void
  onDelete: () => void
}) {
  const [content, setContent] = useState(sentence.content)
  const [translation, setTranslation] = useState(sentence.translation || '')
  const [translationSource, setTranslationSource] = useState(sentence.translation_source || '')
  const [source, setSource] = useState(sentence.source || '')
  const [tags, setTags] = useState(sentence.tags || '')
  const [difficulty, setDifficulty] = useState(String(sentence.difficulty || 3))

  useEffect(() => {
    setContent(sentence.content)
    setTranslation(sentence.translation || '')
    setTranslationSource(sentence.translation_source || '')
    setSource(sentence.source || '')
    setTags(sentence.tags || '')
    setDifficulty(String(sentence.difficulty || 3))
  }, [sentence])

  if (!canEdit) {
    return (
      <div className={`${css.rowCard} ${css.rowCardReadOnly}`}>
        <div className={css.rowHeader}>
          <div>
            <h3 className={css.rowTitle}>{sentence.content}</h3>
            <p className={css.rowText}>{sentence.translation || '暂无翻译'}</p>
          </div>
          <div className={css.rowMeta}>
            <Badge variant="outline">难度 {sentence.difficulty}</Badge>
            {sentence.source ? <Badge variant="secondary">{sentence.source}</Badge> : null}
          </div>
        </div>
        {sentence.tags ? <p className={css.helperText}>标签: {sentence.tags}</p> : null}
      </div>
    )
  }

  return (
    <div className={css.rowCard}>
      <div className={css.rowHeader}>
        <div>
          <h3 className={css.rowTitle}>句子编辑</h3>
          <p className={css.helperText}>适合补齐翻译与来源，后续发现和练习会直接复用这些信息。</p>
        </div>
        <div className={css.rowMeta}>
          <Badge variant="outline">难度 {difficulty}</Badge>
          {source ? <Badge variant="secondary">{source}</Badge> : null}
        </div>
      </div>

      <textarea
        className={css.compactTextarea}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="句子内容"
      />
      <textarea
        className={css.compactTextarea}
        value={translation}
        onChange={(event) => setTranslation(event.target.value)}
        placeholder="翻译"
      />
      <div className={css.formGridThree}>
        <Input value={source} onChange={(event) => setSource(event.target.value)} placeholder="来源" />
        <Input value={translationSource} onChange={(event) => setTranslationSource(event.target.value)} placeholder="翻译来源" />
        <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="标签" />
      </div>

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
              translation: translation.trim(),
              translation_source: translationSource.trim(),
              source: source.trim(),
              tags: tags.trim(),
              difficulty: Number(difficulty),
            })
          }
        >
          <Save size={14} />
          保存句子
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 size={14} />
          删除
        </Button>
      </div>
    </div>
  )
}
