import Layout from '../../components/layouts/Layout'
import { TypingContext, TypingStateActionType, initialState, typingReducer } from './store'
import Header from '@/components/Header'
import WordPanel from './components/WordPanel'
import { fetchDictionaries } from '@/api/dictionary'
import { fetchWordsByDictionary } from '@/api/word'
import type { DictionaryResDto, WordResDto } from '@/api/dictionary'
import type { WordWithIndex } from '@/typings'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { Box, Stack, CircularProgress } from '@mui/joy'
import { useQuery } from '@tanstack/react-query'
import { isLegal } from '@/utils'

const Typing: React.FC = () => {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [currentDict, setCurrentDict] = useState<DictionaryResDto | null>(null)

  // 1. 获取所有词典
  const {
    data: dictData,
    isLoading: isDictLoading,
    isError: isDictError,
  } = useQuery({
    queryKey: ['dictionaries'],
    queryFn: () => fetchDictionaries({ page: 1, limit: 100 })
  })

  // 2. 选择第一个词典
  useEffect(() => {
    if (dictData && dictData.data && dictData.data.length > 0) {
      setCurrentDict(dictData.data[0])
    }
  }, [dictData])

  // 3. 获取当前词典下的单词
  const {
    data: wordsData,
    isLoading: isWordsLoading,
    isError: isWordsError,
  } = useQuery({
    queryKey: currentDict ? ['words', currentDict.id] : [],
    queryFn: () => currentDict ? fetchWordsByDictionary(currentDict.id, { page: 1, limit: 999 }) : Promise.resolve({ data: [] }),
    enabled: !!currentDict
  })

  const isLoading = isDictLoading || (currentDict && isWordsLoading)


  // 4. 单词加载后初始化打字状态
  useEffect(() => {
    if (wordsData && wordsData.data && currentDict) {
      const words: WordWithIndex[] = (wordsData.data as WordResDto[]).map((w, idx) => ({
        name: w.word,
        trans: w.definition ? [w.definition] : [],
        usphone: w.pronunciation || '',
        ukphone: w.pronunciation || '',
        index: idx,
      }))
      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: { words, shouldShuffle: false },
      })
    }
  }, [wordsData, currentDict, dispatch])


  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        console.log('onKeyDown');
        if (!isLoading && e.key !== 'Enter' && (isLegal(e.key) || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: true })
        }
      }
      window.addEventListener('keydown', onKeyDown)

      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [state.isTyping, isLoading, dispatch])


  return (
    <TypingContext.Provider value={{ state: state, dispatch }}>
      <Layout>
        <Header>
        </Header>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 1200,
          mx: 'auto',
          pb: 2.5
        }}>
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isLoading ? (
                <Stack alignItems="center" justifyContent="center">
                  <CircularProgress size="md" />
                </Stack>
              ) : (
                !state.isFinished && <WordPanel />
              )}
            </Box>
          </Box>
        </Box>
      </Layout>
    </TypingContext.Provider>
  )
}

export default Typing
