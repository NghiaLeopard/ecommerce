// ** Next
import { NextPage } from 'next'

// ** Mui
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'

// ** React
import { ReactNode, useState } from 'react'

// ** layout
import HorizontalLayout from './Horizontal'
import VerticalLayout from './Vertical/VerticalLayout'
import { useTheme } from '@mui/material'

type TProps = {
  children: ReactNode
}

const UserLayout: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = useState(true)
  const theme = useTheme()
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <HorizontalLayout open={open} toggleDrawer={toggleDrawer} />
      <VerticalLayout open={open} toggleDrawer={toggleDrawer} />
      <Box
        component='main'
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container
          sx={{
            m: 4,
            width: `calc(100% - 32px)`,
            height: `100vh - ${theme.mixins}`,
            maxWidth: 'calc(100% - 32px) !important',
            padding: '0px !important'
          }}
        >
          <>{children}</>
        </Container>
      </Box>
    </Box>
  )
}

export default UserLayout
