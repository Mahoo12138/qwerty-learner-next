import React from 'react'
import { Box, Typography } from '@mui/joy'

const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => {
  return (
    <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography
        level="title-lg"
        sx={{
          width: '80%',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1,
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'text.secondary',
        }}
      >
        {info}
      </Typography>
      <Typography level="body-xs" sx={{ pt: 1, color: 'text.tertiary' }}>{description}</Typography>
    </Box>
  )
}

export default React.memo(InfoBox)

export type InfoBoxProps = {
  info: string
  description: string
}
