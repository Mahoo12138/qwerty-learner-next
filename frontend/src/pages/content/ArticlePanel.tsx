import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, FileText, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Badge } from '@/components/core/Badge'
import { Progress } from '@/components/core/Progress'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/core/Select'
import {
  useArticleBanks,
  useCreateArticleBank,
  useUpdateArticleBank,
  useDeleteArticleBank,
  useArticles,
  useCreateArticle,
  useDeleteArticle,
  useArticleDetail,
  useArticleSentences,
  useUpdateArticleSentence,
  useArticleProgress,
  useResetProgress,
} from '@/api/articleBanks'
import type { Article, ArticleBank, ArticleSentence, ProgressItem } from '@/types/api'
import * as css from '@/styles/pages/content.css'

type ArticleView = 'banks' | 'articles' | 'detail'

export function ArticlePanel() {
  const [view, setView] = useState<ArticleView>('banks')
  const [selectedBankId, setSelectedBankId] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState('')

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {/* Breadcrumb */}
      <nav className={css.breadcrumb} aria-label="文章库导航">
        <button
          type="button"
          className={view === 'banks' ? css.breadcrumbActive : css.breadcrumbLink}
          onClick={() => {
            setView('banks')
            setSelectedBankId('')
            setSelectedArticleId('')
          }}
        >
          全部文章库
        </button>
        {(view === 'articles' || view === 'detail') && (
          <>
            <ChevronRight className={css.breadcrumbSep} />
            <button
              type="button"
              className={view === 'articles' ? css.breadcrumbActive : css.breadcrumbLink}
              onClick={() => {
                setView('articles')
                setSelectedArticleId('')
              }}
            >
              文章列表
            </button>
          </>
        )}
        {view === 'detail' && (
          <>
            <ChevronRight className={css.breadcrumbSep} />
            <span className={css.breadcrumbActive}>文章详情</span>
          </>
        )}
      </nav>

      {view === 'banks' && (
        <ArticleBankList
          onOpenArticles={(id) => {
            setSelectedBankId(id)
            setView('articles')
          }}
        />
      )}
      {view === 'articles' && selectedBankId && (
        <ArticleListView
          bankId={selectedBankId}
          onSelect={(id) => {
            setSelectedArticleId(id)
            setView('detail')
          }}
        />
      )}
      {view === 'detail' && selectedArticleId && (
        <ArticleDetailPanel articleId={selectedArticleId} />
      )}
    </div>
  )
}

/* ── Article Bank List ───────────────────────────────────────── */

function ArticleBankList({ onOpenArticles }: { onOpenArticles: (id: string) => void }) {
  const { data: banks = [] } = useArticleBanks()
  const createBank = useCreateArticleBank()
  const updateBank = useUpdateArticleBank()
  const deleteBank = useDeleteArticleBank()

  const [selectedBankId, setSelectedBankId] = useState('')
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createLanguage, setCreateLanguage] = useState('en')
  const [editingName, setEditingName] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingLanguage, setEditingLanguage] = useState('en')

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === selectedBankId),
    [banks, selectedBankId],
  )

  useEffect(() => {
    if (!selectedBank) {
      setEditingName('')
      setEditingDescription('')
      setEditingLanguage('en')
      return
    }
    setEditingName(selectedBank.name)
    setEditingDescription(selectedBank.description ?? '')
    setEditingLanguage(selectedBank.language || 'en')
  }, [selectedBank?.id])

  const handleCreate = () => {
    if (!createName.trim()) return
    createBank.mutate(
      {
        name: createName.trim(),
        description: createDescription.trim(),
        language: createLanguage.trim() || 'en',
      },
      {
        onSuccess: (bank) => {
          setSelectedBankId(bank.id)
          setCreateName('')
          setCreateDescription('')
          setCreateLanguage('en')
          setEditingName(bank.name)
          setEditingDescription(bank.description ?? '')
          setEditingLanguage(bank.language || 'en')
        },
      },
    )
  }

  const handleSave = () => {
    if (!selectedBank || !editingName.trim()) return
    updateBank.mutate({
      id: selectedBank.id,
      name: editingName.trim(),
      description: editingDescription.trim(),
      language: editingLanguage.trim() || 'en',
    })
  }

  const handleDelete = () => {
    if (!selectedBank) return
    if (!window.confirm(`确定删除文章库「${selectedBank.name}」吗？`)) return
    deleteBank.mutate(selectedBank.id, {
      onSuccess: () => {
        setSelectedBankId('')
        setEditingName('')
        setEditingDescription('')
        setEditingLanguage('en')
      },
    })
  }

  return (
    <div className={css.panelGrid}>
      {/* Sidebar */}
      <aside className={css.sidebarCard}>
        <div className={css.sidebarHeader}>
          <h2 className={css.sidebarTitle}>文章库列表</h2>
          <Badge variant="outline">{banks.length}</Badge>
        </div>
        <div className={css.sidebarBody}>
          {banks.length === 0 ? (
            <p className={css.bankListEmpty}>还没有文章库，先创建一个。</p>
          ) : (
            banks.map((bank: ArticleBank) => (
              <button
                key={bank.id}
                type="button"
                className={selectedBankId === bank.id ? css.bankBtnActive : css.bankBtn}
                onClick={() => setSelectedBankId(bank.id)}
              >
                <span className={css.bankBtnName}>{bank.name}</span>
                <span className={css.bankBtnCount}>
                  <Badge variant="outline" style={{ fontSize: '10px' }}>{bank.language}</Badge>
                  {' '}{bank.article_count}篇
                </span>
              </button>
            ))
          )}
        </div>
        <div className={css.sidebarCreateForm}>
          <Input
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="新文章库名称"
          />
          <Input
            value={createDescription}
            onChange={(e) => setCreateDescription(e.target.value)}
            placeholder="文章库说明（可选）"
          />
          <Input
            value={createLanguage}
            onChange={(e) => setCreateLanguage(e.target.value)}
            placeholder="语言 (en / zh)"
          />
          <Button onClick={handleCreate} disabled={createBank.isPending}>
            <Plus size={14} />
            创建文章库
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className={css.mainCard}>
        <div className={css.mainCardHeader}>
          <h2 className={css.mainCardTitle}>文章库设置</h2>
        </div>
        <div className={css.mainCardBody}>
          {!selectedBank ? (
            <div className={css.noBankPlaceholder}>
              <FileText className={css.noBankPlaceholderIcon} />
              <p>选择左侧文章库后可编辑名称、说明和语言</p>
            </div>
          ) : (
            <div className={css.bankSettingsForm}>
              <p className={css.bankSettingsTitle}>编辑文章库</p>
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="文章库名称"
              />
              <Input
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                placeholder="文章库说明（可选）"
              />
              <Input
                value={editingLanguage}
                onChange={(e) => setEditingLanguage(e.target.value)}
                placeholder="语言 (en / zh)"
              />
              <div className={css.bankSettingsActions}>
                <Button onClick={handleSave} variant="outline">
                  <Save size={13} />
                  保存文章库
                </Button>
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 size={13} />
                  删除文章库
                </Button>
                <Button onClick={() => onOpenArticles(selectedBank.id)}>
                  <ChevronRight size={13} />
                  查看文章
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Article List View ───────────────────────────────────────── */

function ArticleListView({
  bankId,
  onSelect,
}: {
  bankId: string
  onSelect: (id: string) => void
}) {
  const { data } = useArticles(bankId, 1, 100)
  const createArticle = useCreateArticle()

  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState('3')

  const articles = data?.list ?? []

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return
    createArticle.mutate(
      {
        bankId,
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        difficulty: parseInt(difficulty, 10),
      },
      {
        onSuccess: () => {
          setTitle('')
          setAuthor('')
          setContent('')
          setShowForm(false)
        },
      },
    )
  }

  return (
    <div className={css.panelGrid}>
      {/* Sidebar */}
      <aside className={css.sidebarCard}>
        <div className={css.sidebarHeader}>
          <h2 className={css.sidebarTitle}>文章列表</h2>
          <Badge variant="outline">{articles.length}</Badge>
        </div>
        <div className={css.sidebarBody}>
          {articles.length === 0 ? (
            <p className={css.bankListEmpty}>还没有文章，先添加一篇。</p>
          ) : (
            articles.map((article: Article) => (
              <button
                key={article.id}
                type="button"
                className={css.articleCardBtn}
                onClick={() => onSelect(article.id)}
              >
                <span className={css.articleCardBtnTitle}>{article.title}</span>
                <span className={css.articleCardBtnMeta}>
                  {article.paragraph_count} 段 · {article.total_char_count} 字符 · 难度 {article.difficulty}
                </span>
              </button>
            ))
          )}
        </div>
        <div className={css.sidebarCreateForm}>
          <Button
            variant="outline"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus size={14} />
            {showForm ? '收起' : '添加文章'}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className={css.mainCard}>
        <div className={css.mainCardHeader}>
          <h2 className={css.mainCardTitle}>
            {showForm ? '新建文章' : '文章详情'}
          </h2>
        </div>
        <div className={css.mainCardBody}>
          {showForm ? (
            <div className={css.createFormStack}>
              <p style={{ fontSize: '12px', color: 'inherit', opacity: 0.65 }}>
                空行自动分段，段内自动分句
              </p>
              <div className={css.createFormGrid}>
                <Input
                  placeholder="标题 *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="作者（可选）"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <textarea
                className={css.createFormTextarea}
                rows={10}
                placeholder="粘贴文章内容（空行分段）*"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className={css.createFormFooter}>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger style={{ width: '110px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((d) => (
                      <SelectItem key={d} value={String(d)}>难度 {d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => setShowForm(false)}>取消</Button>
                <Button onClick={handleCreate} disabled={createArticle.isPending}>创建</Button>
              </div>
            </div>
          ) : (
            <div className={css.noBankPlaceholder}>
              <FileText className={css.noBankPlaceholderIcon} />
              <p>选择左侧文章查看详情，或点击"添加文章"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Article Detail Panel ────────────────────────────────────── */

function ArticleDetailPanel({ articleId }: { articleId: string }) {
  const { data: detail } = useArticleDetail(articleId)
  const { data: sentences = [] } = useArticleSentences(articleId)
  const updateSentence = useUpdateArticleSentence()
  const resetProgress = useResetProgress()
  const deleteArticle = useDeleteArticle()

  const groupedSentences = useMemo(() => {
    const group = new Map<string, ArticleSentence[]>()
    for (const s of sentences) {
      if (!group.has(s.paragraph_id)) group.set(s.paragraph_id, [])
      group.get(s.paragraph_id)!.push(s)
    }
    return group
  }, [sentences])

  if (!detail) {
    return (
      <div className={css.noBankPlaceholder}>
        <p>加载中...</p>
      </div>
    )
  }

  const progress = detail.progress
  const progressPercent =
    progress && progress.total_paragraphs > 0
      ? (progress.completed_paragraphs / progress.total_paragraphs) * 100
      : 0

  return (
    <div className={css.articleDetailStack}>
      {/* Info card */}
      <div className={css.articleInfoCard}>
        <div className={css.articleInfoHeader}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {detail.title}
            </h2>
            {detail.author && (
              <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.65 }}>
                作者：{detail.author}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={css.dangerBtn}
            onClick={() => deleteArticle.mutate(articleId)}
          >
            <Trash2 size={15} />
          </Button>
        </div>
        <div className={css.articleInfoMeta}>
          <div className={css.articleMetaRow}>
            <Badge variant="outline">难度 {detail.difficulty}</Badge>
            <span>{detail.paragraph_count} 段</span>
            <span>{detail.total_char_count} 字符</span>
          </div>
          {progress && (
            <div className={css.progressSection}>
              <div className={css.progressLabel}>
                <span className={css.progressLabelLeft}>
                  练习进度 {progress.completed_paragraphs} / {progress.total_paragraphs} 段
                </span>
                <span className={css.progressLabelRight}>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} />
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetProgress.mutate(articleId)}
                >
                  重置进度
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sentences card */}
      <div className={css.articleInfoCard}>
        <div className={css.articleInfoHeader} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-soft)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>段落与句子释义</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.65 }}>
              为每个句子填写释义，练习时将在打字区下方显示
            </p>
          </div>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {detail.paragraphs.map((p) => {
            const ss = groupedSentences.get(p.id) ?? []
            return (
              <div key={p.id} className={css.paragraphCard}>
                <div className={css.paragraphHeader}>
                  <Badge variant="secondary">段落 {p.paragraph_index + 1}</Badge>
                  <span>{p.char_count} 字符</span>
                  <span>{p.sentence_count} 句</span>
                </div>
                <p className={css.paragraphText}>{p.content}</p>
                <div className={css.sentenceEditWrap}>
                  {ss.map((s) => (
                    <ArticleSentenceRow
                      key={s.id}
                      sentence={s}
                      onUpdate={(translation) =>
                        updateSentence.mutate({ sentenceId: s.id, translation })
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ArticleProgressSection />
    </div>
  )
}

function ArticleSentenceRow({
  sentence,
  onUpdate,
}: {
  sentence: ArticleSentence
  onUpdate: (translation: string) => void
}) {
  const [translation, setTranslation] = useState(sentence.translation ?? '')

  useEffect(() => {
    setTranslation(sentence.translation ?? '')
  }, [sentence.id, sentence.translation])

  return (
    <div className={css.articleSentenceRow}>
      <p className={css.articleSentenceContent}>{sentence.content}</p>
      <div className={css.articleSentenceEditRow}>
        <Input
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="填写句子释义（可选）"
        />
        <Button size="sm" variant="outline" onClick={() => onUpdate(translation)}>
          <Save size={12} />
          保存
        </Button>
      </div>
    </div>
  )
}

function ArticleProgressSection() {
  const { data: progress = [] } = useArticleProgress()

  if (progress.length === 0) return null

  return (
    <div className={css.allProgressCard}>
      <div className={css.allProgressHeader}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>全部阅读进度</h3>
      </div>
      <div className={css.allProgressBody}>
        {progress.map((item: ProgressItem) => {
          const percent =
            item.total_paragraphs > 0
              ? (item.completed_paragraphs / item.total_paragraphs) * 100
              : 0
          return (
            <div key={item.id} className={css.progressItem}>
              <div className={css.progressLabel}>
                <span style={{ fontWeight: 500 }}>{item.article_title}</span>
                <span style={{ opacity: 0.65, fontSize: '13px' }}>
                  {item.completed_paragraphs}/{item.total_paragraphs}
                </span>
              </div>
              <Progress value={percent} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
