import { useNavigate } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { WordPanel } from './WordPanel'
import { SentencePanel } from './SentencePanel'
import { ArticlePanel } from './ArticlePanel'
import * as css from '@/styles/pages/content.css'

export type ContentTab = 'word' | 'sentence' | 'article'

export interface ContentPageProps {
  tab: ContentTab
  wordPage: number
}

export function ContentPage({ tab, wordPage }: ContentPageProps) {
  const navigate = useNavigate()

  const setTab = (next: ContentTab) => {
    void navigate({
      to: '/content',
      search: (prev) => ({ ...prev, tab: next, wordPage: prev.wordPage ?? 1 }),
    })
  }

  return (
    <div className={css.pageRoot}>
      <header className={css.pageHero}>
        <div className={css.pageTitleGroup}>
          <h1 className={css.pageTitle}>内容管理</h1>
          <p className={css.pageSubtitle}>管理词库、句库与文章库，支持增删改查和批量导入。</p>
        </div>
        <div className={css.pageIconWrap}>
          <BookOpen size={22} />
        </div>
      </header>

      <nav className={css.tabRail} aria-label="内容类型">
        <button
          className={tab === 'word' ? css.tabBtnActive : css.tabBtn}
          onClick={() => setTab('word')}
          type="button"
        >
          词库
        </button>
        <button
          className={tab === 'sentence' ? css.tabBtnActive : css.tabBtn}
          onClick={() => setTab('sentence')}
          type="button"
        >
          句库
        </button>
        <button
          className={tab === 'article' ? css.tabBtnActive : css.tabBtn}
          onClick={() => setTab('article')}
          type="button"
        >
          文章库
        </button>
      </nav>

      {tab === 'word' && <WordPanel wordPage={wordPage} />}
      {tab === 'sentence' && <SentencePanel />}
      {tab === 'article' && <ArticlePanel />}
    </div>
  )
}
