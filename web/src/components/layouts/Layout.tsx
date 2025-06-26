import Footer from '../Footer'
import type React from 'react'
import { Box } from '@mui/joy'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        pb: 2,
      }}
    >
      {children}
      <Footer />
    </Box>
  )
}
