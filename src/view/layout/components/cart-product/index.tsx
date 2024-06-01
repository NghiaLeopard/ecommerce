// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Mui
import { Badge, Divider, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

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

// ** Store
import { RootState } from 'src/stores'
import { TOrderProduct } from 'src/types/cart-product'
import { getOrderItem } from 'src/helpers/storage'
import { addToCart } from 'src/stores/cart-product'

interface TProps {}

const CartProduct: NextPage<TProps> = () => {
  const route = useRouter()
  const { t, i18n } = useTranslation()
  const { user, logout, setUser } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** useSelector
  const { userData } = useSelector((state: RootState) => state.auth)
  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

  const dispatch = useDispatch()

  const open = Boolean(anchorEl)

  const totalMount = useMemo(() => {
    const total = orderItem.reduce((result, current: TOrderProduct) => {
      return result + current.amount
    }, 0)

    return total
  }, [orderItem])

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

  useEffect(() => {
    if (userData) {
      setUser(userData)
    }
  }, [userData])

  useEffect(() => {
    const getOrderItemStorage = getOrderItem()
    const orderParse = getOrderItemStorage ? JSON.parse(getOrderItemStorage) : []
    if (user?._id) {
      dispatch(
        addToCart({
          orderItem: orderParse[user?._id] || []
        })
      )
    }
  }, [])

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
          <IconButton>
            {orderItem.length >= 1 ? (
              <Badge badgeContent={totalMount} color='primary'>
                <CustomIcon icon='mdi:cart' />
              </Badge>
            ) : (
              <CustomIcon icon='mdi:cart' />
            )}
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

          {t('Manage_system')}
        </MenuItem>
        <MenuItem onClick={handleNavigateMyProfile}>
          <Avatar>
            <CustomIcon icon='healthicons:ui-user-profile' />
          </Avatar>

          {t('My_profile')}
        </MenuItem>

        <MenuItem onClick={handleNavigateChangePassword}>
          <Avatar>
            <CustomIcon icon='arcticons:password' />
          </Avatar>
          {t('Change_password')}
        </MenuItem>

        <MenuItem onClick={logout}>
          <Avatar>
            <CustomIcon icon='tabler:logout' />
          </Avatar>
          {`${t('Logout')}`}
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default CartProduct
