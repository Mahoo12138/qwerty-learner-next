import Layout from '../../components/layouts/Layout'
import { TypingContext, TypingStateActionType, initialState, typingReducer } from '../Home/store'
import Header from '@/components/Header'

import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { Box, Stack, Button, CircularProgress } from '@mui/joy'

const Typing: React.FC = () => {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [isLoading, setIsLoading] = useState<boolean>(true)

  
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
                ""
                // !state.isFinished && <WordPanel />
              )}
            </Box>
          </Box>
        </Box>
      </Layout>
    </TypingContext.Provider>
  )
}

export default Typing
