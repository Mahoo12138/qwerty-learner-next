import { useNavigate } from '@tanstack/react-router'

import * as css from '@/styles/pages/contentWorkspace.css'

import { ArticlePanel } from './ArticlePanel'
import { SentencePanel } from './SentencePanel'
import { WordPanel } from './WordPanel'

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
      <div className={css.pageBar}>
        <h1 className={css.pageBarTitle}>内容管理</h1>
        <nav className={css.pageBarTabs} aria-label="内容类型">
          <button
            className={tab === 'word' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('word')}
            type="button"
          >
            词库
          </button>
          <button
            className={tab === 'sentence' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('sentence')}
            type="button"
          >
            句库
          </button>
          <button
            className={tab === 'article' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('article')}
            type="button"
          >
            文章库
          </button>
        </nav>
      </div>

      {tab === 'word' && <WordPanel wordPage={wordPage} />}
      {tab === 'sentence' && <SentencePanel />}
      {tab === 'article' && <ArticlePanel />}
    </div>
  )
}
