import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FileUp, Plus, Save, Search, Trash2, Type } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Badge } from '@/components/core/Badge'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/core/Select'
import {
  useWordBanks,
  useCreateWordBank,
  useUpdateWordBank,
  useDeleteWordBank,
  useWords,
  useCreateWord,
  useUpdateWord,
  useDeleteWord,
  useImportWords,
} from '@/api/wordBanks'
import type { WordBank } from '@/types/api'
import * as css from '@/styles/pages/content.css'

interface WordPanelProps {
  wordPage: number
}

export function WordPanel({ wordPage }: WordPanelProps) {
  const navigate = useNavigate()
  const [selectedBankId, setSelectedBankId] = useState('')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState(0)
  const [bankName, setBankName] = useState('')
  const [bankDesc, setBankDesc] = useState('')
  const [editingBankName, setEditingBankName] = useState('')
  const [editingBankDesc, setEditingBankDesc] = useState('')
  const [wordContent, setWordContent] = useState('')
  const [wordDefinition, setWordDefinition] = useState('')
  const [wordDifficulty, setWordDifficulty] = useState(3)
  const pageSize = 20

  const { data: banks = [] } = useWordBanks()
  const createBank = useCreateWordBank()
  const updateBank = useUpdateWordBank()
  const deleteBank = useDeleteWordBank()

  const { data: wordsData } = useWords(selectedBankId, wordPage, pageSize, search, difficulty)
  const createWord = useCreateWord()
  const updateWord = useUpdateWord()
  const deleteWord = useDeleteWord()
  const importWords = useImportWords()

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === selectedBankId),
    [banks, selectedBankId],
  )
  const totalPages = Math.max(1, Math.ceil((wordsData?.total ?? 0) / pageSize))

  useEffect(() => {
    if (!selectedBank) {
      setEditingBankName('')
      setEditingBankDesc('')
      return
    }
    setEditingBankName(selectedBank.name)
    setEditingBankDesc(selectedBank.description ?? '')
  }, [selectedBank?.id])

  useEffect(() => {
    if (wordPage <= totalPages) return
    void navigate({
      to: '/content',
      search: (prev) => ({ ...prev, tab: 'word', wordPage: totalPages }),
      replace: true,
    })
  }, [navigate, totalPages, wordPage])

  const updateWordPage = (next: number, replace = false) => {
    void navigate({
      to: '/content',
      search: (prev) => ({ ...prev, tab: 'word', wordPage: Math.max(1, next) }),
      replace,
    })
  }

  const handleCreateBank = () => {
    if (!bankName.trim()) return
    createBank.mutate(
      { name: bankName.trim(), description: bankDesc.trim() },
      {
        onSuccess: (bank) => {
          setSelectedBankId(bank.id)
          setBankName('')
          setBankDesc('')
        },
      },
    )
  }

  const handleSaveBank = () => {
    if (!selectedBank || !editingBankName.trim()) return
    updateBank.mutate({
      id: selectedBank.id,
      name: editingBankName.trim(),
      description: editingBankDesc.trim(),
    })
  }

  const handleDeleteBank = () => {
    if (!selectedBank) return
    if (!window.confirm(`确定删除词库「${selectedBank.name}」吗？`)) return
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setSelectedBankId('')
        setEditingBankName('')
        setEditingBankDesc('')
      },
    })
  }

  const handleCreateWord = () => {
    if (!selectedBankId || !wordContent.trim()) return
    createWord.mutate(
      {
        bankId: selectedBankId,
        content: wordContent.trim(),
        definition: wordDefinition.trim(),
        difficulty: wordDifficulty,
      },
      {
        onSuccess: () => {
          setWordContent('')
          setWordDefinition('')
          setWordDifficulty(3)
        },
      },
    )
  }

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedBankId) return
    const format = file.name.endsWith('.csv') ? 'csv' : 'json'
    importWords.mutate({ bankId: selectedBankId, file, format })
    e.target.value = ''
  }

  return (
    <div className={css.panelGrid}>
      {/* Sidebar */}
      <aside className={css.sidebarCard}>
        <div className={css.sidebarHeader}>
          <h2 className={css.sidebarTitle}>词库列表</h2>
          <Badge variant="outline">{banks.length}</Badge>
        </div>
        <div className={css.sidebarBody}>
          {banks.length === 0 ? (
            <p className={css.bankListEmpty}>还没有词库，先创建一个。</p>
          ) : (
            banks.map((bank: WordBank) => (
              <button
                key={bank.id}
                type="button"
                className={selectedBankId === bank.id ? css.bankBtnActive : css.bankBtn}
                onClick={() => {
                  setSelectedBankId(bank.id)
                  updateWordPage(1, true)
                }}
              >
                <span className={css.bankBtnName}>{bank.name}</span>
                <span className={css.bankBtnCount}>{bank.word_count}</span>
              </button>
            ))
          )}
        </div>
        <div className={css.sidebarCreateForm}>
          <Input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="新词库名称"
          />
          <Input
            value={bankDesc}
            onChange={(e) => setBankDesc(e.target.value)}
            placeholder="词库描述（可选）"
          />
          <Button onClick={handleCreateBank} disabled={createBank.isPending}>
            <Plus size={14} />
            创建词库
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className={css.mainCard}>
        <div className={css.mainCardHeader}>
          <h2 className={css.mainCardTitle}>
            {selectedBank ? `${selectedBank.name} · 单词管理` : '请选择词库'}
          </h2>
          {selectedBank && (
            <div className={css.mainCardActions}>
              <label className={css.fileLabel}>
                <FileUp size={13} />
                导入
                <input type="file" accept=".json,.csv" onChange={handleImport} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>

        <div className={css.mainCardBody}>
          {!selectedBank ? (
            <div className={css.noBankPlaceholder}>
              <Type className={css.noBankPlaceholderIcon} />
              <p>选择左侧词库开始管理单词</p>
            </div>
          ) : (
            <>
              {/* Edit bank metadata */}
              <div className={css.editBankBar}>
                <Input
                  value={editingBankName}
                  onChange={(e) => setEditingBankName(e.target.value)}
                  placeholder="词库名称"
                />
                <Input
                  value={editingBankDesc}
                  onChange={(e) => setEditingBankDesc(e.target.value)}
                  placeholder="词库说明"
                />
                <Button onClick={handleSaveBank} variant="outline">
                  <Save size={13} />
                  保存
                </Button>
                <Button onClick={handleDeleteBank} variant="destructive">
                  <Trash2 size={13} />
                  删除
                </Button>
              </div>

              {/* Filters */}
              <div className={css.filterBar}>
                <div className={css.searchWrap}>
                  <Search className={css.searchIcon} />
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      updateWordPage(1, true)
                    }}
                    placeholder="搜索单词"
                    className={css.searchInput}
                  />
                </div>
                <Select
                  value={String(difficulty)}
                  onValueChange={(v) => {
                    setDifficulty(Number(v))
                    updateWordPage(1, true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">全部难度</SelectItem>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <SelectItem key={d} value={String(d)}>难度 {d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline">共 {wordsData?.total ?? 0} 条</Badge>
              </div>

              {/* Add word */}
              <div className={css.addWordRow}>
                <Input
                  value={wordContent}
                  onChange={(e) => setWordContent(e.target.value)}
                  placeholder="新单词"
                />
                <Input
                  value={wordDefinition}
                  onChange={(e) => setWordDefinition(e.target.value)}
                  placeholder="释义"
                />
                <Select
                  value={String(wordDifficulty)}
                  onValueChange={(v) => setWordDifficulty(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <SelectItem key={d} value={String(d)}>难度 {d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateWord} disabled={createWord.isPending}>
                  添加
                </Button>
              </div>

              {/* Word list */}
              <div className={css.itemList}>
                {(wordsData?.list.length ?? 0) === 0 ? (
                  <div className={css.emptyState}>
                    <Type className={css.emptyStateIcon} />
                    <p className={css.emptyStateText}>还没有单词，先添加几条开始练习。</p>
                  </div>
                ) : (
                  wordsData?.list.map((word) => (
                    <div key={word.id} className={css.wordRow}>
                      <div className={css.wordRowTerm}>
                        <Type className={css.wordTermIcon} />
                        <span className={css.wordTermText}>{word.content}</span>
                      </div>
                      <span className={css.wordDefText}>{word.definition || '暂无释义'}</span>
                      <div className={css.rowActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateWord.mutate({
                              wordId: word.id,
                              content: word.content,
                              definition: word.definition,
                              difficulty: word.difficulty,
                            })
                          }
                        >
                          保存
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={css.dangerBtn}
                          onClick={() => deleteWord.mutate(word.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className={css.paginationRow}>
                  <span className={css.paginationLabel}>
                    第 {wordPage} / {totalPages} 页 · 共 {wordsData?.total ?? 0} 条
                  </span>
                  <div className={css.paginationBtns}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={wordPage <= 1}
                      onClick={() => updateWordPage(wordPage - 1)}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={wordPage >= totalPages}
                      onClick={() => updateWordPage(wordPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
