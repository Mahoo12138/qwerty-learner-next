import { useDeferredValue, useEffect, useMemo, useState, type ChangeEvent } from 'react'
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
import { FileUp, Filter, MessageSquareText, Pencil, Plus, Save, Search, Trash2 } from 'lucide-react'

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
import type { Sentence } from '@/types/api'

import { ContentDataTable } from './ContentDataTable'
import { EmptyDetail } from './ContentShell'
import {
  canManageLibrary,
  countLabel,
  visibilityLabel,
} from './contentModel'

const difficultyOptions = [1, 2, 3, 4, 5]

const sentenceShowcaseTitle = '我的句库'
const sentenceShowcaseDescription = '这里只保留你自己创建和维护的句库。系统句库、公开句库和已订阅句库将迁移到新的“发现内容”页统一处理。'

interface OwnedLibraryCard {
  id: string
  title: string
  caption: string
  countText: string
  createdText: string
  badges: Array<{
    label: string
    variant: 'default' | 'secondary' | 'outline' | 'warning' | 'success' | 'destructive'
  }>
}

function formatLibraryDate(value?: string) {
  if (!value) {
    return '时间待补齐'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '时间待补齐'
  }

  return date.toLocaleDateString('zh-CN').replace(/\//g, '-')
}

function splitSentenceTags(tags?: string) {
  if (!tags) {
    return []
  }

  return tags
    .split(/[\s,，]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

interface SentencePanelProps {
  createRequestKey?: number
}

export function SentencePanel({ createRequestKey = 0 }: SentencePanelProps) {
  const user = useAuthStore((state) => state.user)
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

  const { data: ownedBanks = [] } = useSentenceBanks('owned')

  const createBank = useCreateSentenceBank()
  const updateBank = useUpdateSentenceBank()
  const deleteBank = useDeleteSentenceBank()
  const createSentence = useCreateSentence()
  const updateSentence = useUpdateSentence()
  const deleteSentence = useDeleteSentence()
  const importSentences = useImportSentences()

  const bankMap = useMemo(() => new Map(ownedBanks.map((bank) => [bank.id, bank])), [ownedBanks])

  const listItems = useMemo<OwnedLibraryCard[]>(
    () =>
      ownedBanks.map((bank) => ({
        id: bank.id,
        title: bank.name,
        caption: bank.category || '继续补充句子、翻译和来源。',
        countText: countLabel('sentence_bank', bank.sentence_count),
        createdText: formatLibraryDate(bank.created_at),
        badges: [
          {
            label: visibilityLabel(bank.is_public),
            variant: bank.is_public === 1 ? 'success' : 'outline',
          },
          { label: bank.category || '未分类', variant: 'secondary' },
        ],
      })),
    [ownedBanks],
  )

  const selectionSignature = listItems.map((item) => item.id).join('|')

  useEffect(() => {
    if (listItems.some((item) => item.id === selectedLibraryID)) {
      return
    }
    setSelectedLibraryID(listItems[0]?.id ?? '')
  }, [listItems, selectionSignature, selectedLibraryID])

  const selectedBank = useMemo(
    () => bankMap.get(selectedLibraryID) ?? null,
    [bankMap, selectedLibraryID],
  )
  const canEdit = canManageLibrary(selectedBank, user)

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

  useEffect(() => {
    if (createRequestKey < 1) {
      return
    }

    setSelectedLibraryID('')
    setCreateBankOpen(true)
  }, [createRequestKey])

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
          setSelectedLibraryID(bank.id)
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

  const sentenceColumns = useMemo<ColumnDef<Sentence>[]>(
    () => [
      {
        header: '句子',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.content}</span>
            <span className={css.tableSecondaryText}>难度 {row.original.difficulty}</span>
          </div>
        ),
      },
      {
        header: '翻译',
        cell: ({ row }) => (
          <span className={css.tablePrimaryText}>{row.original.translation || '暂无翻译'}</span>
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
        header: '标签',
        cell: ({ row }) => {
          const tags = splitSentenceTags(row.original.tags)

          if (tags.length === 0) {
            return <span className={css.tableSecondaryText}>无</span>
          }

          return (
            <div className={css.tableTagList}>
              {tags.slice(0, 3).map((tag) => (
                <Badge key={`${row.original.id}-${tag}`} variant="secondary" className={css.tableTagBadge}>
                  {tag}
                </Badge>
              ))}
            </div>
          )
        },
      },
      {
        header: '操作',
        cell: ({ row }) => (
          <div className={css.tableActionIconGroup}>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={css.tableActionIconButton}
              onClick={() => {
                setActiveSentence(row.original)
                setSentenceDialogOpen(true)
              }}
              aria-label={canEdit ? `编辑 ${row.original.content}` : `查看 ${row.original.content}`}
            >
              <Pencil size={15} />
            </Button>
            {canEdit ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={css.tableActionIconButton}
                onClick={() => {
                  if (!window.confirm(`确定删除句子吗？`)) {
                    return
                  }
                  deleteSentence.mutate(row.original.id)
                }}
                aria-label={`删除句子 ${row.original.content}`}
              >
                <Trash2 size={15} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [canEdit, deleteSentence],
  )

  const selectedLibraryCreatedText = formatLibraryDate(selectedBank?.created_at)

  return (
    <>
      <div className={css.libraryWorkspaceStack}>
        <section className={css.libraryShowcase}>
          <header className={css.libraryShowcaseHeader}>
            <div className={css.libraryShowcaseIntro}>
              <p className={css.libraryShowcaseEyebrow}>句库编排</p>
              <h2 className={css.libraryShowcaseTitle}>{sentenceShowcaseTitle}</h2>
              <p className={css.libraryShowcaseDescription}>{sentenceShowcaseDescription}</p>
            </div>
          </header>

          {listItems.length === 0 ? (
            <div className={css.libraryCatalogEmpty}>
              <div>
                <p className={css.libraryCatalogEmptyTitle}>还没有句库</p>
                <p className={css.libraryCatalogEmptyText}>先建一个句库，再往里面补句子、翻译和来源。</p>
              </div>
              <Button type="button" onClick={() => setCreateBankOpen(true)}>
                <Plus size={14} />
                新建句库
              </Button>
            </div>
          ) : (
            <div className={css.libraryCatalogGrid}>
              {listItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    selectedLibraryID === item.id
                      ? css.libraryCatalogCardSelected
                      : css.libraryCatalogCard
                  }
                  onClick={() => handleSelectLibrary(item.id)}
                >
                  <div className={css.libraryCatalogCardTop}>
                    <div className={css.libraryCatalogCardIcon}>
                      <MessageSquareText size={18} />
                    </div>
                    <span className={css.libraryCatalogCardCount}>{item.countText}</span>
                  </div>

                  <div className={css.libraryCatalogCardBody}>
                    <h3 className={css.libraryCatalogCardTitle}>{item.title}</h3>
                    <p className={css.libraryCatalogCardCaption}>{item.caption}</p>
                  </div>

                  <div className={css.libraryCatalogCardBadges}>
                    {item.badges.map((badge) => (
                      <Badge key={`${item.id}-${badge.label}`} variant={badge.variant}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                  <p className={css.libraryCatalogCardDate}>创建于 {item.createdText}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={css.libraryDetailSurface}>
          {!selectedBank ? (
            <EmptyDetail
              title="先创建一个句库"
              body="当前内容管理页只维护你自己的句库。公开发现、系统句库和已订阅句库将转移到新的“发现内容”页。"
            />
          ) : (
            <>
              <div className={css.libraryDetailHeader}>
                <div className={css.libraryDetailHeading}>
                  <p className={css.libraryDetailEyebrow}>我的句库</p>
                  <div className={css.libraryDetailTitleRow}>
                    <h2 className={css.libraryDetailTitle}>{selectedBank.name}</h2>
                    {canEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={css.libraryTitleEditButton}
                        onClick={() => setEditBankOpen(true)}
                        aria-label={`编辑句库 ${selectedBank.name}`}
                      >
                        <Pencil size={16} />
                      </Button>
                    ) : null}
                  </div>
                  <p className={css.libraryDetailMetaLine}>
                    {countLabel('sentence_bank', selectedBank.sentence_count)} · 创建于 {selectedLibraryCreatedText}
                  </p>
                  <p className={css.libraryDetailDescription}>
                    {selectedBank.category ? `分类：${selectedBank.category}` : '这套句库还没有设置分类。'}
                  </p>
                </div>

                <div className={css.libraryDetailHeaderActions}>
                  <div className={css.libraryDetailBadges}>
                    <Badge variant="secondary">{selectedBank.category || '未分类'}</Badge>
                    <Badge variant={selectedBank.is_public === 1 ? 'success' : 'outline'}>
                      {visibilityLabel(selectedBank.is_public)}
                    </Badge>
                  </div>

                  <div className={css.libraryDetailButtons}>
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
                  </div>
                </div>
              </div>

              <div className={css.libraryTableToolbar}>
                <div className={`${css.searchField} ${css.toolbarGrow}`}>
                  <Search className={css.searchFieldIcon} size={16} />
                  <Input
                    className={css.searchInput}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="搜索句子、翻译、来源或标签"
                  />
                </div>

                <div className={css.libraryTableToolbarActions}>
                  <div className={css.libraryFilterControl}>
                    <Filter className={css.libraryFilterIcon} size={16} />
                    <Select value={String(difficulty)} onValueChange={(value) => setDifficulty(Number(value))}>
                      <SelectTrigger className={css.libraryFilterTrigger}>
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

                  {canEdit ? (
                    <Button
                      type="button"
                      size="lg"
                      className={css.libraryAddWordButton}
                      onClick={() => setCreateSentenceOpen(true)}
                    >
                      <Plus size={14} />
                      添加句子
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className={css.libraryTableCard}>
                {sentences.length === 0 ? (
                  <EmptyDetail
                    title="还没有句子"
                    body={canEdit ? '先添加几条句子，或者通过导入快速建库。' : '这个句库暂时没有可展示的句子。'}
                  />
                ) : (
                  <ContentDataTable ariaLabel="句子清单" data={sentences} columns={sentenceColumns} />
                )}

                <div className={css.libraryTableFooter}>
                  <div className={css.libraryTableSummary}>
                    <span>共 {sentencesData?.total ?? 0} 条句子</span>
                    <span>当前筛选已应用到本句库</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

    <Dialog open={createBankOpen} onOpenChange={setCreateBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建句库</DialogTitle>
          <DialogDescription>分类和公开状态决定它未来会怎样出现在“发现内容”页里。</DialogDescription>
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
              <p className={css.switchTitle}>公开到发现内容</p>
              <p className={css.switchDescription}>打开后其他用户可以在未来的“发现内容”页里看到它。</p>
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
              <p className={css.switchDescription}>关闭后不会出现在后续的“发现内容”页里。</p>
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
