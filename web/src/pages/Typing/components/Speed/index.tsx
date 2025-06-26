import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { useContext } from 'react'
import { Box } from '@mui/joy'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <Box
      sx={{
        my: 2,
        display: 'flex',
        width: '60%',
        borderRadius: 2,
        backgroundColor: 'background.body',
        p: 2,
        py: 5,
        opacity: 0.5,
        transition: 'background-color 0.3s',
      }}
    >
      <InfoBox info={`${minutesString}:${secondsString}`} description="时间" />
      <InfoBox info={inputNumber + ''} description="输入数" />
      <InfoBox info={state.timerData.wpm + ''} description="WPM" />
      <InfoBox info={state.chapterData.correctCount + ''} description="正确数" />
      <InfoBox info={state.timerData.accuracy + ''} description="正确率" />
    </Box>
  )
}
