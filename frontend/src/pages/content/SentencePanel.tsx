import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { CaseSensitive, FileUp, Plus, Save, Search, Trash2 } from 'lucide-react'
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
  useSentenceBanks,
  useCreateSentenceBank,
  useUpdateSentenceBank,
  useDeleteSentenceBank,
  useSentences,
  useCreateSentence,
  useUpdateSentence,
  useDeleteSentence,
  useImportSentences,
} from '@/api/sentenceBanks'
import type { Sentence, SentenceBank } from '@/types/api'
import * as css from '@/styles/pages/content.css'

export function SentencePanel() {
  const [selectedBankId, setSelectedBankId] = useState('')
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState(0)
  const [bankName, setBankName] = useState('')
  const [bankCategory, setBankCategory] = useState('')
  const [editingBankName, setEditingBankName] = useState('')
  const [editingBankCategory, setEditingBankCategory] = useState('')
  const [sentenceContent, setSentenceContent] = useState('')
  const [sentenceTranslation, setSentenceTranslation] = useState('')
  const [sentenceSource, setSentenceSource] = useState('')
  const [sentenceDifficulty, setSentenceDifficulty] = useState(3)

  const { data: banks = [] } = useSentenceBanks()
  const createBank = useCreateSentenceBank()
  const updateBank = useUpdateSentenceBank()
  const deleteBank = useDeleteSentenceBank()

  const { data: sentencesData } = useSentences(selectedBankId, 1, 100, search, difficulty)
  const createSentence = useCreateSentence()
  const updateSentence = useUpdateSentence()
  const deleteSentence = useDeleteSentence()
  const importSentences = useImportSentences()

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === selectedBankId),
    [banks, selectedBankId],
  )

  useEffect(() => {
    if (!selectedBank) {
      setEditingBankName('')
      setEditingBankCategory('')
      return
    }
    setEditingBankName(selectedBank.name)
    setEditingBankCategory(selectedBank.category ?? '')
  }, [selectedBank?.id])

  const handleCreateBank = () => {
    if (!bankName.trim()) return
    createBank.mutate(
      { name: bankName.trim(), category: bankCategory.trim() },
      {
        onSuccess: (bank) => {
          setSelectedBankId(bank.id)
          setBankName('')
          setBankCategory('')
        },
      },
    )
  }

  const handleSaveBank = () => {
    if (!selectedBank || !editingBankName.trim()) return
    updateBank.mutate({
      id: selectedBank.id,
      name: editingBankName.trim(),
      category: editingBankCategory.trim(),
    })
  }

  const handleDeleteBank = () => {
    if (!selectedBank) return
    if (!window.confirm(`确定删除句库「${selectedBank.name}」吗？`)) return
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setSelectedBankId('')
        setEditingBankName('')
        setEditingBankCategory('')
      },
    })
  }

  const handleCreateSentence = () => {
    if (!selectedBankId || !sentenceContent.trim()) return
    createSentence.mutate(
      {
        bankId: selectedBankId,
        content: sentenceContent.trim(),
        translation: sentenceTranslation.trim() || undefined,
        source: sentenceSource.trim(),
        difficulty: sentenceDifficulty,
      },
      {
        onSuccess: () => {
          setSentenceContent('')
          setSentenceTranslation('')
          setSentenceSource('')
          setSentenceDifficulty(3)
        },
      },
    )
  }

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedBankId) return
    const format = file.name.endsWith('.csv') ? 'csv' : 'json'
    importSentences.mutate({ bankId: selectedBankId, file, format })
    e.target.value = ''
  }

  return (
    <div className={css.panelGrid}>
      {/* Sidebar */}
      <aside className={css.sidebarCard}>
        <div className={css.sidebarHeader}>
          <h2 className={css.sidebarTitle}>句库列表</h2>
          <Badge variant="outline">{banks.length}</Badge>
        </div>
        <div className={css.sidebarBody}>
          {banks.length === 0 ? (
            <p className={css.bankListEmpty}>还没有句库，先创建一个。</p>
          ) : (
            banks.map((bank: SentenceBank) => (
              <button
                key={bank.id}
                type="button"
                className={selectedBankId === bank.id ? css.bankBtnActive : css.bankBtn}
                onClick={() => setSelectedBankId(bank.id)}
              >
                <span className={css.bankBtnName}>{bank.name}</span>
                <span className={css.bankBtnCount}>{bank.sentence_count}</span>
              </button>
            ))
          )}
        </div>
        <div className={css.sidebarCreateForm}>
          <Input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="新句库名称"
          />
          <Input
            value={bankCategory}
            onChange={(e) => setBankCategory(e.target.value)}
            placeholder="分类（可选）"
          />
          <Button onClick={handleCreateBank} disabled={createBank.isPending}>
            <Plus size={14} />
            创建句库
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className={css.mainCard}>
        <div className={css.mainCardHeader}>
          <h2 className={css.mainCardTitle}>
            {selectedBank ? `${selectedBank.name} · 句子管理` : '请选择句库'}
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
              <CaseSensitive className={css.noBankPlaceholderIcon} />
              <p>选择左侧句库开始管理句子</p>
            </div>
          ) : (
            <>
              {/* Edit bank metadata */}
              <div className={css.editBankBar}>
                <Input
                  value={editingBankName}
                  onChange={(e) => setEditingBankName(e.target.value)}
                  placeholder="句库名称"
                />
                <Input
                  value={editingBankCategory}
                  onChange={(e) => setEditingBankCategory(e.target.value)}
                  placeholder="分类"
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索句子"
                    className={css.searchInput}
                  />
                </div>
                <Select value={String(difficulty)} onValueChange={(v) => setDifficulty(Number(v))}>
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
                <Badge variant="outline">共 {sentencesData?.total ?? 0} 条</Badge>
              </div>

              {/* Add sentence */}
              <div className={css.addSentenceRows}>
                <div className={css.addSentenceTop}>
                  <Input
                    value={sentenceContent}
                    onChange={(e) => setSentenceContent(e.target.value)}
                    placeholder="新句子内容 *"
                  />
                  <Input
                    value={sentenceTranslation}
                    onChange={(e) => setSentenceTranslation(e.target.value)}
                    placeholder="翻译（可选）"
                  />
                </div>
                <div className={css.addSentenceBottom}>
                  <Input
                    value={sentenceSource}
                    onChange={(e) => setSentenceSource(e.target.value)}
                    placeholder="来源（可选）"
                  />
                  <Select
                    value={String(sentenceDifficulty)}
                    onValueChange={(v) => setSentenceDifficulty(Number(v))}
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
                  <Button onClick={handleCreateSentence} disabled={createSentence.isPending}>
                    添加
                  </Button>
                </div>
              </div>

              {/* Sentence list */}
              <div className={css.itemList}>
                {(sentencesData?.list.length ?? 0) === 0 ? (
                  <div className={css.emptyState}>
                    <CaseSensitive className={css.emptyStateIcon} />
                    <p className={css.emptyStateText}>还没有句子，先添加几条开始练习。</p>
                  </div>
                ) : (
                  sentencesData?.list.map((sentence) => (
                    <SentenceRow
                      key={sentence.id}
                      sentence={sentence}
                      onUpdate={(data) => updateSentence.mutate({ sentenceId: sentence.id, ...data })}
                      onDelete={() => deleteSentence.mutate(sentence.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SentenceRow({
  sentence,
  onUpdate,
  onDelete,
}: {
  sentence: Sentence
  onUpdate: (data: { content: string; translation: string; source: string; difficulty: number }) => void
  onDelete: () => void
}) {
  const [content, setContent] = useState(sentence.content)
  const [translation, setTranslation] = useState(sentence.translation ?? '')
  const [source, setSource] = useState(sentence.source ?? '')
  const [difficulty, setDifficulty] = useState(sentence.difficulty)

  useEffect(() => {
    setContent(sentence.content)
    setTranslation(sentence.translation ?? '')
    setSource(sentence.source ?? '')
    setDifficulty(sentence.difficulty)
  }, [sentence.id, sentence.content, sentence.translation, sentence.source, sentence.difficulty])

  return (
    <div className={css.sentenceCard}>
      <div className={css.sentenceCardTop}>
        <CaseSensitive className={css.sentenceIcon} />
        <div className={css.sentenceInputGroup}>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="句子内容"
          />
          <Input
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="翻译（可选）"
          />
        </div>
      </div>
      <div className={css.sentenceCardBottom}>
        <Input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="来源"
        />
        <Select value={String(difficulty)} onValueChange={(v) => setDifficulty(Number(v))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((d) => (
              <SelectItem key={d} value={String(d)}>难度 {d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate({ content, translation, source, difficulty })}
        >
          保存
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={css.dangerBtn}
          onClick={onDelete}
        >
          删除
        </Button>
      </div>
    </div>
  )
}
