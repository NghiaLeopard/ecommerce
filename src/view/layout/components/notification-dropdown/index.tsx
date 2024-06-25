// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Mui
import { Badge, Button, Divider, Typography, useTheme } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Components
import NoData from 'src/components/no-data'
import CustomIcon from '../../../../components/Icon'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Config
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Utils
import { formatPriceToLocal, isExpiry, toFullName } from 'src/utils'

// ** Store
import { RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'

// ** Type
import { TOrderProduct } from 'src/types/order-product'

// ** Helper
import { getOrderItem } from 'src/helpers/storage'
import { MessageNotification } from './components/messageNotification'

interface TProps {}

type TNotification = {
  meta: string
  title: string
  subtitle: string
}

const NotificationDropdown: NextPage<TProps> = () => {
  // ** Router
  const route = useRouter()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** useAuth
  const { user, setUser } = useAuth()

  // ** Theme
  const theme = useTheme()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Dispatch
  const dispatch = useDispatch()

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const notification: TNotification[] = [
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    },
    {
      meta: 'Today',
      title: 'Congratulation Nghia',
      subtitle: 'Won the best seller'
    }
  ]

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
          {user?._id ? (
            <IconButton onClick={handleClick}>
              <Badge color='primary'>
                <CustomIcon icon='mdi:bell' />
              </Badge>
            </IconButton>
          ) : (
            <Box sx={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
              <CustomIcon icon='mdi:bell' />
            </Box>
          )}
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
            height: '350',
            width: '350px',
            overflow: 'visible  ',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}>
          <Typography fontSize='22px' mt={2}>
            {t('Notifications')}
          </Typography>
          <Box sx={{ display: 'flex', justifyItems: 'center', gap: 3 }}>
            <Box
              sx={{
                padding: '3px 15px',
                bgcolor: theme.palette.primary.main,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography color={theme.palette.customColors.lightPaperBg}>{notification.length} new</Typography>
            </Box>
            <CustomIcon icon='solar:letter-bold' color={theme.palette.primary.main} fontSize='28px' />
          </Box>
        </Box>
        <Box sx={{ maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden' }}>
          {notification.map((item: TNotification) => {
            return (
              <>
                <Divider sx={{ width: '100%' }} />
                <MenuItem key={item?.title} sx={{ width: '100%' }}>
                  <MessageNotification data={item} />
                </MenuItem>
              </>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ width: '100%' }} />
          <Button variant='contained' sx={{ margin: '10px 20px 5px' }}>
            {t('Mark_read_all_notification')}
          </Button>
        </Box>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
