// import Tooltip from '@/components/Tooltip'

import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Box, Stack, IconButton, Typography, Tooltip } from '@mui/joy'
import { Github } from 'lucide-react'

import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)
  const navigate = useNavigate()

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <Box component="footer" sx={{ width: '100%', py: 2, mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Tooltip title="前往 GitHub 项目主页">
          <IconButton
            component="a"
            href="https://github.com/mahoo12138/qwerty-learner-next"
            target="_blank"
            rel="noreferrer"
            aria-label="前往 GitHub 项目主页"
            variant="plain"
            color="neutral"
            sx={{ fontSize: 22 }}
          >
            <Github size={22} />
          </IconButton>
        </Tooltip>
        <Typography level="body-sm" sx={{ userSelect: 'none', bgcolor: 'neutral.softBg', px: 1, borderRadius: 4, fontSize: 12, color: 'text.secondary' }}>
          Build <span style={{ userSelect: 'all' }}>{typeof LATEST_COMMIT_HASH !== 'undefined' ? LATEST_COMMIT_HASH : ''}</span>
        </Typography>
      </Stack>
    </Box>
  )
}

export default Footer
