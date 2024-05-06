// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** React
import { Fragment, MouseEvent, useState } from 'react'

// ** Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { Badge, Divider, Typography, styled } from '@mui/material'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Components
import CustomIcon from '../../../../components/Icon'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Config
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Utils
import { toFullName } from 'src/utils'

interface TProps {}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`
}))

const UserDropDown: NextPage<TProps> = () => {
  const route = useRouter()
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigateMyProfile = () => {
    route.push(`${CONFIG_ROUTE.MY_PROFILE}`)
    handleClose()
  }

  const handleNavigateChangePassword = () => {
    route.push(`${CONFIG_ROUTE.CHANGE_PASSWORD}`)
    handleClose()
  }

  const handleNavigateManageSystem = () => {
    route.push(`${CONFIG_ROUTE.DASHBOARD}`)
    handleClose()
  }

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.avatar ? (
                  <Image
                    src={user?.avatar || ''}
                    alt='avatar'
                    width={0}
                    height={0}
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                ) : (
                  <CustomIcon icon='gravity-ui:person' />
                )}
              </Avatar>
            </StyledBadge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 2, px: 2 }}>
          <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.avatar ? (
                <Image
                  src={user?.avatar || ''}
                  alt='avatar'
                  width={0}
                  height={0}
                  style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                />
              ) : (
                <CustomIcon icon='gravity-ui:person' />
              )}
            </Avatar>
          </StyledBadge>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>
              {toFullName(user?.lastName || '', user?.middleName || '', user?.firstName || '', i18n.language)}
            </Typography>

            <Typography>{user?.role?.name}</Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleNavigateManageSystem}>
          <Avatar>
            <CustomIcon icon='arcticons:nextdns-manager' />
          </Avatar>

          {t('manege-system')}
        </MenuItem>
        <MenuItem onClick={handleNavigateMyProfile}>
          <Avatar>
            <CustomIcon icon='healthicons:ui-user-profile' />
          </Avatar>

          {t('my-profile')}
        </MenuItem>

        <MenuItem onClick={handleNavigateChangePassword}>
          <Avatar>
            <CustomIcon icon='arcticons:password' />
          </Avatar>
          {t('change-password')}
        </MenuItem>

        <MenuItem onClick={logout}>
          <Avatar>
            <CustomIcon icon='tabler:logout' />
          </Avatar>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropDown
