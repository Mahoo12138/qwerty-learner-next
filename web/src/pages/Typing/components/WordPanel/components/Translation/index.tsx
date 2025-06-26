import { SoundIcon } from '@/components/WordPronunciationIcon/SoundIcon'
import useSpeech from '@/hooks/useSpeech'
import { useTypingConfigStore } from '@/store/typing'
import { useCallback, useMemo } from 'react'
import { Box, Typography, IconButton, Tooltip } from '@mui/joy'

export type TranslationProps = {
  trans: string
  showTrans?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function Translation({ trans, showTrans = true, onMouseEnter, onMouseLeave }: TranslationProps) {
  const pronunciationConfig = useTypingConfigStore(s => s.pronunciationConfig)
  const fontSizeConfig = useTypingConfigStore(s => s.fontSizeConfig)
  const isTextSelectable = useTypingConfigStore(s => s.isTextSelectable)
  const isShowTransRead = typeof window !== 'undefined' && window.speechSynthesis && pronunciationConfig.isTransRead
  const speechOptions = useMemo(() => ({ volume: pronunciationConfig.transVolume }), [pronunciationConfig.transVolume])
  const { speak, speaking } = useSpeech(trans, speechOptions)

  const handleClickSoundIcon = useCallback(() => {
    speak(true)
  }, [speak])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pb: 2,
        pt: 2.5,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Typography
        level="body-md"
        sx={{
          maxWidth: 600,
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: 'text.primary',
          transition: 'color 0.3s',
          pl: isShowTransRead ? 2 : 0,
          userSelect: isTextSelectable ? 'text' : 'none',
          fontSize: fontSizeConfig.translateFont,
        }}
      >
        {showTrans ? trans : '\u00A0'}
      </Typography>
      {isShowTransRead && showTrans && (
        <Tooltip title="朗读释义">
          <IconButton size="sm" variant="plain" onClick={handleClickSoundIcon} sx={{ ml: 1 }}>
            <SoundIcon animated={speaking} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
