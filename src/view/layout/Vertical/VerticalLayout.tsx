// ** Next
import { NextPage } from 'next'

// ** Mui
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'

// ** Style
import { styled } from '@mui/material/styles'

// components
import { ListVerticalLayout } from './ListVerticalLayout'

// ** Custom
import CustomIcon from 'src/components/Icon'

const drawerWidth: number = 240

type TProps = {
  open: boolean
  toggleDrawer: () => void
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(12),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(12)
      }
    })
  }
}))

const VerticalLayout: NextPage<TProps> = ({ open, toggleDrawer }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant='permanent' open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <CustomIcon icon='icon-park-outline:left' />
          </IconButton>
        </Toolbar>
        <Divider />
        <ListVerticalLayout openVertical={open} />
      </Drawer>
    </Box>
  )
}

export default VerticalLayout
