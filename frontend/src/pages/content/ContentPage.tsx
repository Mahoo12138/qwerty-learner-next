import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, FileText, MessageSquareText, Plus } from 'lucide-react'

import { Button } from '@/components/core/Button'
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
  const [wordBankCreateRequest, setWordBankCreateRequest] = useState(0)
  const [sentenceBankCreateRequest, setSentenceBankCreateRequest] = useState(0)
  const [articleBankCreateRequest, setArticleBankCreateRequest] = useState(0)

  const pageTitle =
    tab === 'word' ? '词库' : tab === 'sentence' ? '句库' : '文章库'
  const createLabel =
    tab === 'word' ? '新建词库' : tab === 'sentence' ? '新建句库' : '新建文章库'

  const setTab = (next: ContentTab) => {
    void navigate({
      to: '/content',
      search: (prev) => ({ ...prev, tab: next, wordPage: prev.wordPage ?? 1 }),
    })
  }

  const openCreatePanel = () => {
    if (tab === 'word') {
      setWordBankCreateRequest((current) => current + 1)
      return
    }

    if (tab === 'sentence') {
      setSentenceBankCreateRequest((current) => current + 1)
      return
    }

    setArticleBankCreateRequest((current) => current + 1)
  }

  return (
    <div className={css.pageRoot}>
      <div className={css.pageBar}>
        <div className={css.pageBarTop}>
          <div className={css.pageBarHeading}>
            <h1 className={css.pageBarTitle}>{pageTitle}</h1>
          </div>
          <div className={css.pageBarActions}>
            <Button type="button" className={css.pageBarCreateButton} onClick={openCreatePanel}>
              <Plus size={16} />
              {createLabel}
            </Button>
          </div>
        </div>
        <nav className={css.pageBarTabs} aria-label="内容类型">
          <button
            className={tab === 'word' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('word')}
            type="button"
          >
            <BookOpen size={16} />
            词库
          </button>
          <button
            className={tab === 'sentence' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('sentence')}
            type="button"
          >
            <MessageSquareText size={16} />
            句库
          </button>
          <button
            className={tab === 'article' ? css.pageBarTabActive : css.pageBarTab}
            onClick={() => setTab('article')}
            type="button"
          >
            <FileText size={16} />
            文章库
          </button>
        </nav>
      </div>

      {tab === 'word' && <WordPanel wordPage={wordPage} createRequestKey={wordBankCreateRequest} />}
      {tab === 'sentence' && <SentencePanel createRequestKey={sentenceBankCreateRequest} />}
      {tab === 'article' && <ArticlePanel createRequestKey={articleBankCreateRequest} />}
    </div>
  )
}
