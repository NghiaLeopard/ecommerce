// ** Next
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Avatar, Box, Checkbox, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Service
import { getDetailProducts } from 'src/services/products'

// ** Store
import { RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'

// ** Types
import { TOrderProduct } from 'src/types/order-product'

// ** Other
import { useAuth } from 'src/hooks/useAuth'
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

type TProps = {
  item: TOrderProduct
  checkboxSelected: string[]
  handleChangeCheckbox: (value: string) => void
}

export const ItemProductCart = ({ item, checkboxSelected, handleChangeCheckbox }: TProps) => {
  // ** Theme
  const theme = useTheme()

  // ** auth
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  // ** State
  const [itemState, setItemState] = useState<any>({})

  // ** Dispatch
  const dispatch = useDispatch()

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  const handleDeleteCart = (id: string) => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}
    const filteredCart = orderItem.filter((item: TOrderProduct) => item.product !== id)
    if (user?._id) {
      dispatch(
        updateToCart({
          orderItem: filteredCart
        })
      )
      setOrderItem(JSON.stringify({ ...dataCartParse, [user?._id]: filteredCart }))
    } else {
      router.replace({
        pathname: 'login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleChangeAmountCart = (item: TOrderProduct, amount: number) => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}

    const arrCart = executeUpdateCard(orderItem, {
      name: item.name,
      amount: amount,
      slug: item.slug,
      price: item.price,
      product: item.product,
      image: item.image,
      discount: item.discount,
      discountEndDate: item.discountEndDate,
      discountStartDate: item.discountStartDate
    })

    // This page is public then when adjust amount cart , you must log in

    if (user?._id) {
      dispatch(
        updateToCart({
          orderItem: arrCart
        })
      )
      setOrderItem(JSON.stringify({ ...dataCartParse, [user?._id]: arrCart }))
    } else {
      router.replace({
        pathname: 'login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const fetchDetailProductCart = async () => {
    try {
      const res = await getDetailProducts(item.product)
      setItemState({
        name: res?.data?.name,
        amount: item.amount,
        image: res?.data?.image,
        price: res?.data?.price,
        discount: res?.data.discount,
        product: res?.data?._id,
        slug: res?.data?.slug,
        discountEndDate: res?.data?.discountEndDate || null,
        discountStartDate: res?.data?.discountStartDate || null
      })
    } catch (error) {}
  }

  const isExpiryDay = isExpiry(itemState.discountStartDate || null, itemState.discountEndDate || null)

  useEffect(() => {
    fetchDetailProductCart()
  }, [item.amount])

  return (
    <Box>
      <Divider />

      <Box sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
        <Box sx={{ width: 'calc(10% - 120px)' }}>
          <Checkbox
            checked={checkboxSelected.includes(itemState.product)}
            value={itemState.product}
            onChange={e => handleChangeCheckbox(e.target.value)}
          />
        </Box>
        <Avatar src={itemState.image} sx={{ width: '120px', height: '100px' }} />
        <Typography
          sx={{
            display: 'webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexBasis: '35%'
          }}
        >
          {itemState.name}
        </Typography>
        <Box sx={{ flexBasis: '20%' }}>
          {itemState.discount > 0 ? (
            <Typography
              color={theme.palette.primary.main}
              fontWeight='bold'
              fontSize='20px'
              sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
            >
              {`${formatPriceToLocal(itemState.price)} VNĐ`}
            </Typography>
          ) : (
            <Box>{''}</Box>
          )}
        </Box>
        <Box sx={{ flexBasis: '20%', display: 'flex', gap: 2 }}>
          <Typography color={theme.palette.primary.main} fontSize='20px' fontWeight='bold'>
            {itemState.discount > 0
              ? `${formatPriceToLocal((itemState.price * (100 - itemState.discount)) / 100)} VNĐ`
              : `${formatPriceToLocal(itemState.price)} VNĐ`}
          </Typography>
          {itemState.discount > 0 && isExpiryDay && (
            <Box
              sx={{
                backgroundColor: 'rgba(254,238,234,1)'
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: theme.palette.error.main,
                  padding: '4px 8px'
                }}
              >{`-${itemState.discount}%`}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexBasis: '10%', gap: 2 }}>
          <Tooltip title='Minus'>
            <IconButton
              sx={{
                backgroundColor: `${theme.palette.primary.main} !important`,
                color: theme.palette.common.white
              }}
              onClick={() => handleChangeAmountCart(itemState, -1)}
            >
              <CustomIcon icon='ic:baseline-minus' />
            </IconButton>
          </Tooltip>
          <CustomTextField
            value={itemState.amount}
            sx={{
              '.MuiInputBase-input': {
                width: '20px'
              },
              '.MuiInputBase-root': {
                border: 'none',
                borderBottom: '1px solid',
                borderRadius: '0 !important'
              }
            }}
          />
          <Tooltip title='Plus'>
            <IconButton
              onClick={() => handleChangeAmountCart(itemState, 1)}
              sx={{
                backgroundColor: `${theme.palette.primary.main} !important`,
                color: theme.palette.common.white
              }}
            >
              <CustomIcon icon='ph:plus-bold' />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ flexBasis: '5%' }}>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDeleteCart(itemState.product)}>
              <CustomIcon icon='mingcute:delete-2-fill' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}
