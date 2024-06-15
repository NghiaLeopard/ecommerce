// ** Next
import { NextPage } from 'next'

// ** React
import { ReactNode, useState } from 'react'

// ** Mui
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'

// ** layout
import { useTheme } from '@mui/material'

// ** component
import HorizontalLayout from './Horizontal'

type TProps = {
  children: ReactNode
}

const LayoutNotApp: NextPage<TProps> = ({ children }) => {
  // ** Hook
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout open={open} toggleDrawer={toggleDrawer} isHidden={true} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          width: '100vw',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            width: 'calc(100vw - 32px)',
            height: `100vh - ${theme.mixins.toolbar.minHeight}`,
            maxWidth: 'unset !important',
            padding: '0px !important'
          }}
        >
          <>{children}</>
        </Container>
      </Box>
    </Box>
  )
}

export default LayoutNotApp
