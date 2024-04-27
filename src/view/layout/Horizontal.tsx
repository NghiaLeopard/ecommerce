// ** Next
import { NextPage } from 'next'

// ** Mui
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

// ** Style
import { styled, useTheme } from '@mui/material/styles'

// ** components
import CustomIcon from 'src/components/Icon'
import UserDropDown from 'src/components/user-dropdown'

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

type TProps = {
  open: boolean
  toggleDrawer: () => void
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background:
    theme.palette.mode === 'light' ? theme.palette.customColors.lightPaperBg : theme.palette.customColors.darkPaperBg,
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const HorizontalLayout: NextPage<TProps> = ({ open, toggleDrawer }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='absolute' open={open}>
        <Toolbar
          sx={{
            pr: '30px',
            margin: '0 20px' // keep right padding when drawer closed
          }}
        >
          {open && (
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <CustomIcon icon='ic:round-menu' />
            </IconButton>
          )}
          <Typography component='h1' variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <UserDropDown />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default HorizontalLayout
