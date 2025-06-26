import { EXPLICIT_SPACE } from '@/constants'
import { useTypingConfigStore } from '@/store/typing'
import React from 'react'
import { Typography } from '@mui/joy'

export type LetterState = 'normal' | 'correct' | 'wrong'

const stateColorMap: Record<string, Record<LetterState, string>> = {
  true: {
    normal: 'text.secondary',
    correct: 'success.400',
    wrong: 'danger.400',
  },
  false: {
    normal: 'text.primary',
    correct: 'success.600',
    wrong: 'danger.600',
  },
}

export type LetterProps = {
  letter: string
  state?: LetterState
  visible?: boolean
}

const Letter: React.FC<LetterProps> = ({ letter, state = 'normal', visible = true }) => {
  const fontSizeConfig = useTypingConfigStore(s => s.fontSizeConfig)
  const isSpace = letter === EXPLICIT_SPACE
  const color = stateColorMap[String(isSpace)][state]
  return (
    <Typography
      component="span"
      sx={{
        m: 0,
        p: 0,
        fontFamily: 'monospace',
        fontWeight: 400,
        pr: 1,
        fontSize: fontSizeConfig.foreignFont,
        color,
        transition: 'color 0.2s',
        opacity: 0.8,
      }}
    >
      {visible ? letter : '_'}
    </Typography>
  )
}

export default React.memo(Letter)
