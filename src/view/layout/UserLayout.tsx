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

type TProps = {
  children: ReactNode
}

const UserLayout: NextPage<TProps> = ({ children }) => {
  const [open, setOpen] = useState(true)
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
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          <>{children}</>
        </Container>
      </Box>
    </Box>
  )
}

export default UserLayout
