// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, MouseEvent, useEffect, useMemo, useState } from 'react'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Mui
import { Badge, Button, Typography, useTheme } from '@mui/material'
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

// ** Utils
import { formatPriceToLocal } from 'src/utils'

// ** Store
import { RootState } from 'src/stores'
import { updateToCart } from 'src/stores/cart-product'
import { TOrderProduct } from 'src/types/cart-product'

// ** Helper
import { getOrderItem } from 'src/helpers/storage'

// ** Stores

interface TProps {}

const CartProduct: NextPage<TProps> = () => {
  // ** Router
  const route = useRouter()

  // ** Translation
  const { t } = useTranslation()

  // ** Auth
  const { user, setUser } = useAuth()

  // ** Theme
  const theme = useTheme()

  // ** Dispatch
  const dispatch = useDispatch()

  // ** useState
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** useSelector
  const { userData } = useSelector((state: RootState) => state.auth)
  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

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

  const handleNavigationItem = (slug: string) => {
    route.push(`/product/${slug}`)
    handleClose()
  }

  const handleNavigationViewCart = () => {
    route.push('/my-cart')
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
        updateToCart({
          orderItem: orderParse[user?._id] || []
        })
      )
    }
  }, [])

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
          <IconButton onClick={handleClick}>
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
      {user?._id && orderItem.length >= 1 && (
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
          {orderItem.map((item: TOrderProduct) => {
            return (
              <MenuItem onClick={() => handleNavigationItem(item.slug)} key={item.name}>
                <Avatar src={item.image} />
                <Box sx={{ width: '250px' }}>
                  <Typography
                    sx={{
                      display: 'webkit-box',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      '-webkit-line-clamp': '1',
                      '-webkit-box-orient': 'vertical'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.discount > 0 && (
                      <Typography
                        color={theme.palette.primary.main}
                        fontWeight='bold'
                        sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                      >
                        {`${formatPriceToLocal(item.price)} VNĐ`}
                      </Typography>
                    )}
                    <Typography color={theme.palette.primary.main} fontWeight='bold'>
                      {item.discount > 0
                        ? `${formatPriceToLocal((item.price * (100 - item.discount)) / 100)} VNĐ`
                        : `${formatPriceToLocal(item.price)} VNĐ`}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            )
          })}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '8px' }}>
            <Button
              variant='contained'
              sx={{ height: '40px', fontWeight: '600', mt: 2 }}
              onClick={handleNavigationViewCart}
            >
              <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
              {t('View_cart')}
            </Button>
          </Box>
        </Menu>
      )}
    </Fragment>
  )
}

export default CartProduct