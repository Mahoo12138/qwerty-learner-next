import { TypingContext } from '../../store'
import { useContext, useEffect, useState } from 'react'
import { Box, LinearProgress } from '@mui/joy'

export default function Progress({ className }: { className?: string }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  // 可自定义颜色
  const colorSwitcher: { [key: number]: string } = {
    0: '#C7D2FE', // indigo-200
    1: '#A5B4FC', // indigo-300
    2: '#818CF8', // indigo-400
  }

  useEffect(() => {
    const newProgress = Math.floor((state.chapterData.index / state.chapterData.words.length) * 100)
    setProgress(newProgress)
    const colorPhase = Math.floor(newProgress / 33.4)
    setPhase(colorPhase)
  }, [state.chapterData.index, state.chapterData.words.length])

  return (
    <Box className={className} sx={{ position: 'relative', width: '100%', pt: 1 }}>
      <LinearProgress
        determinate
        value={progress}
        sx={{
          // height: 8,
          borderRadius: 8,
          backgroundColor: '#E0E7FF', // indigo-100
          '& .MuiLinearProgress-bar': {
            backgroundColor: colorSwitcher[phase] ?? '#C7D2FE',
            transition: 'width 0.3s',
            borderRadius: 8,
          },
        }}
      />
    </Box>
  )
}
