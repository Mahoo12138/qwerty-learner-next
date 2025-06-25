import Layout from '../../components/layouts/Layout'
import { TypingContext, TypingStateActionType, initialState, typingReducer } from './store'
import Header from '@/components/Header'
import WordPanel from './components/WordPanel'
import { fetchDictionaries } from '@/api/dictionary'
import type { DictionaryResDto, WordResDto } from '@/api/dictionary'
import type { WordWithIndex } from '@/typings'

import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { Box, Stack, CircularProgress } from '@mui/joy'

const Typing: React.FC = () => {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentDict, setCurrentDict] = useState<DictionaryResDto | null>(null)

  useEffect(() => {
    // 获取所有自己的词典，选择第一个
    async function loadDictionaries() {
      setIsLoading(true)
      try {
        const res = await fetchDictionaries({ page: 1, limit: 100 })
        const dicts = res.data as DictionaryResDto[]
        if (dicts.length > 0) {
          setCurrentDict(dicts[0])
          // 初始化打字状态
          const words: WordWithIndex[] = (dicts[0].words || []).map((w, idx) => ({
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
      } finally {
        setIsLoading(false)
      }
    }
    loadDictionaries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
