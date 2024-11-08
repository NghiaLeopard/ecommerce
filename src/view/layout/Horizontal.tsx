// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** Mui
import { Button } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Components
import CustomIcon from 'src/components/Icon'
import UserDropDown from 'src/view/layout/components/user-dropdown'
import CartProduct from './components/cart-product'
import LanguageDropDown from './components/language-dropdown'
import ModeToggle from './components/mode-toggle'

// ** React
import { useTranslation } from 'react-i18next'
import NotificationDropdown from './components/notification-dropdown'

// ** i18n

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

type TProps = {
  open: boolean
  toggleDrawer: () => void
  isHidden?: boolean
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

const HorizontalLayout: NextPage<TProps> = ({ isHidden = false, open, toggleDrawer }) => {
  // ** Hook
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  const handleNavigateLogin = () => {
    if (router.asPath !== '/') {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    } else {
      router.replace('/login')
    }
  }

  const handleClickHome = () => {
    router.push('/')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position='absolute' open={open}>
        <Toolbar
          sx={{
            pr: '30px',
            margin: '0 20px' // keep right padding when drawer closed
          }}
        >
          {!isHidden && (
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

          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            sx={{ flexGrow: 1 }}
            onClick={handleClickHome}
            style={{ cursor: 'pointer' }}
          >
            {t('Leopard')}
          </Typography>

          <LanguageDropDown />
          <ModeToggle />
          {user !== null ? (
            <>
              <CartProduct />
              <NotificationDropdown />
              <UserDropDown />
            </>
          ) : (
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }} onClick={handleNavigateLogin}>
              {t('Login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default HorizontalLayout
