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
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, FileUp, Filter, Pencil, Plus, Save, Search, Trash2 } from 'lucide-react'

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
import type { Word } from '@/types/api'

import { ContentDataTable } from './ContentDataTable'
import { EmptyDetail } from './ContentShell'
import {
  canManageLibrary,
  countLabel,
  LIBRARY_LANGUAGE_OPTIONS,
  libraryLanguageLabel,
  normalizeLibraryLanguage,
  visibilityLabel,
} from './contentModel'

interface WordPanelProps {
  wordPage: number
  createRequestKey?: number
}

const difficultyOptions = [1, 2, 3, 4, 5]

const wordShowcaseTitle = '我的词库'
const wordShowcaseDescription = '这里只保留你自己创建和维护的词库。系统词库、公开词库和已订阅词库将迁移到新的“发现内容”页统一处理。'

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

function splitWordTags(tags?: string) {
  if (!tags) {
    return []
  }

  return tags
    .split(/[\s,，]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function WordPanel({ wordPage, createRequestKey = 0 }: WordPanelProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
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

  const { data: ownedBanks = [] } = useWordBanks('owned')

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

  const bankMap = useMemo(() => new Map(ownedBanks.map((bank) => [bank.id, bank])), [ownedBanks])

  const listItems = useMemo<OwnedLibraryCard[]>(
    () =>
      ownedBanks.map((bank) => ({
        id: bank.id,
        title: bank.name,
        caption: bank.description || '继续补充词条、标签和训练说明。',
        countText: countLabel('word_bank', bank.word_count),
        createdText: formatLibraryDate(bank.created_at),
        badges: [
          {
            label: visibilityLabel(bank.is_public),
            variant: bank.is_public === 1 ? 'success' : 'outline',
          },
          { label: libraryLanguageLabel(bank.language), variant: 'secondary' },
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

  useEffect(() => {
    if (createRequestKey < 1) {
      return
    }

    setSelectedLibraryID('')
    setCreateBankOpen(true)
    updateWordPage(1, true)
  }, [createRequestKey])

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
          setSelectedLibraryID(bank.id)
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

  const wordColumns = useMemo<ColumnDef<Word>[]>(
    () => [
      {
        header: '词语',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.content}</span>
            <span className={css.tableSecondaryText}>难度 {row.original.difficulty}</span>
          </div>
        ),
      },
      {
        header: '发音',
        cell: ({ row }) => (
          <span className={css.tablePrimaryText}>{row.original.pronunciation || '未填写'}</span>
        ),
      },
      {
        header: '释义',
        cell: ({ row }) => (
          <div className={css.tableCellStack}>
            <span className={css.tablePrimaryText}>{row.original.definition || '暂无释义'}</span>
          </div>
        ),
      },
      {
        header: '例句',
        cell: ({ row }) => (
          <span className={css.tableSecondaryText}>{row.original.example_sentence || '未填写例句'}</span>
        ),
      },
      {
        header: '标签',
        cell: ({ row }) => {
          const tags = splitWordTags(row.original.tags)

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
                setActiveWord(row.original)
                setWordDialogOpen(true)
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
                  if (!window.confirm(`确定删除词条「${row.original.content}」吗？`)) {
                    return
                  }
                  deleteWord.mutate(row.original.id)
                }}
                aria-label={`删除 ${row.original.content}`}
              >
                <Trash2 size={15} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [canEdit, deleteWord],
  )

  const selectedLibraryCreatedText = formatLibraryDate(selectedBank?.created_at)

  return (
    <>
      <div className={css.libraryWorkspaceStack}>
        <section className={css.libraryShowcase}>
          <header className={css.libraryShowcaseHeader}>
            <div className={css.libraryShowcaseIntro}>
              <p className={css.libraryShowcaseEyebrow}>词库编排</p>
              <h2 className={css.libraryShowcaseTitle}>{wordShowcaseTitle}</h2>
              <p className={css.libraryShowcaseDescription}>{wordShowcaseDescription}</p>
            </div>
          </header>

          {listItems.length === 0 ? (
            <div className={css.libraryCatalogEmpty}>
              <div>
                <p className={css.libraryCatalogEmptyTitle}>还没有词库</p>
                <p className={css.libraryCatalogEmptyText}>先建一个词库，再往里面填词汇和标签。</p>
              </div>
              <Button type="button" onClick={() => setCreateBankOpen(true)}>
                <Plus size={14} />
                新建词库
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
                      <BookOpen size={18} />
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
              title="先创建一个词库"
              body="当前内容管理页只维护你自己的词库。公开发现、系统词库和已订阅词库将转移到新的“发现内容”页。"
            />
          ) : (
            <>
              <div className={css.libraryDetailHeader}>
                <div className={css.libraryDetailHeading}>
                  <p className={css.libraryDetailEyebrow}>我的词库</p>
                  <div className={css.libraryDetailTitleRow}>
                    <h2 className={css.libraryDetailTitle}>{selectedBank.name}</h2>
                    {canEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={css.libraryTitleEditButton}
                        onClick={() => setEditBankOpen(true)}
                        aria-label={`编辑词库 ${selectedBank.name}`}
                      >
                        <Pencil size={16} />
                      </Button>
                    ) : null}
                  </div>
                  <p className={css.libraryDetailMetaLine}>
                    {countLabel('word_bank', selectedBank.word_count)} · 创建于 {selectedLibraryCreatedText}
                  </p>
                  <p className={css.libraryDetailDescription}>
                    {selectedBank.description || '这套词库还没有补充说明。'}
                  </p>
                </div>

                <div className={css.libraryDetailHeaderActions}>
                  <div className={css.libraryDetailBadges}>
                    <Badge variant="secondary">{libraryLanguageLabel(selectedBank.language)}</Badge>
                    <Badge variant={selectedBank.is_public === 1 ? 'success' : 'outline'}>
                      {visibilityLabel(selectedBank.is_public)}
                    </Badge>
                  </div>

                  <div className={css.libraryDetailButtons}>
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
                  </div>
                </div>
              </div>

              <div className={css.libraryTableToolbar}>
                <div className={`${css.searchField} ${css.toolbarGrow}`}>
                  <Search className={css.searchFieldIcon} size={16} />
                  <Input
                    className={css.searchInput}
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      updateWordPage(1, true)
                    }}
                    placeholder="搜索词语..."
                  />
                </div>

                <div className={css.libraryTableToolbarActions}>
                  <div className={css.libraryFilterControl}>
                    <Filter className={css.libraryFilterIcon} size={16} />
                    <Select
                      value={String(difficulty)}
                      onValueChange={(value) => {
                        setDifficulty(Number(value))
                        updateWordPage(1, true)
                      }}
                    >
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
                      onClick={() => setCreateWordOpen(true)}
                    >
                      <Plus size={14} />
                      添加词语
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className={css.libraryTableCard}>
                {words.length === 0 ? (
                  <EmptyDetail
                    title="还没有词条"
                    body={
                      canEdit
                        ? '先添加几条词汇，或者通过导入快速建库。'
                        : '这个词库暂时没有可展示的词条。'
                    }
                  />
                ) : (
                  <ContentDataTable ariaLabel="词条清单" data={words} columns={wordColumns} />
                )}

                <div className={css.libraryTableFooter}>
                  <div className={css.libraryTableSummary}>
                    <span>共 {wordsData?.total ?? 0} 条词语</span>
                    <span>当前第 {wordPage} 页</span>
                  </div>

                  {wordsData && wordsData.total > pageSize ? (
                    <div className={css.libraryPagination}>
                      <Button
                        variant="outline"
                        onClick={() => updateWordPage(wordPage - 1)}
                        disabled={wordPage <= 1}
                      >
                        上一页
                      </Button>
                      <Badge variant="outline">
                        第 {wordPage} / {totalPages} 页
                      </Badge>
                      <Button
                        variant="outline"
                        onClick={() => updateWordPage(wordPage + 1)}
                        disabled={wordPage >= totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

    <Dialog open={createBankOpen} onOpenChange={setCreateBankOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建词库</DialogTitle>
          <DialogDescription>用语言和公开状态先定义这套训练内容未来怎样出现在“发现内容”页里。</DialogDescription>
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
