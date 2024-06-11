//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Avatar, Box, Button, Divider, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'

// ** Component
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import CustomIcon from 'src/components/Icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Stores
import { AppDispatch, RootState } from 'src/stores'

// ** Types
import { TItemOrderMe, TOrderProduct, TOrderedProduct } from 'src/types/order-product'

// ** Utils
import { useState } from 'react'
import { cloneDeep, executeUpdateCard, formatPriceToLocal } from 'src/utils'

// ** Store
import { cancelOrderProductAsync } from 'src/stores/order-product/actions'
import { updateToCart } from 'src/stores/order-product'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'
import { CONFIG_ROUTE } from 'src/configs/route'

type TProps = {
  item: TItemOrderMe
  tabSelected: number
}

export default function CardOrderMe({ item, tabSelected }: TProps) {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** Auth
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** State
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false)

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  const handleOnCloseDeleteProducts = () => {
    setOpenConfirmCancel(false)
  }

  const handleCancelOrder = () => {
    dispatch(cancelOrderProductAsync(item._id))
    setOpenConfirmCancel(false)
  }

  const handleUpdateToCart = (orderItems: TOrderedProduct[]) => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}
    let arrCart = cloneDeep(orderItem)

    orderItems.forEach((item: TOrderedProduct, index) => {
      arrCart = executeUpdateCard(arrCart, {
        name: item.name,
        amount: item.amount,
        slug: item.product.slug,
        price: item.price,
        product: item.product._id,
        image: item.image,
        discount: item.discount,
        discountEndDate: item.discountEndDate || null,
        discountStartDate: item.discountStartDate || null
      })

      dispatch(
        updateToCart({
          orderItem: arrCart
        })
      )
      setOrderItem(JSON.stringify({ ...dataCartParse, [user?._id]: arrCart }))
    })

    // This page is public then when adjust amount cart , you must log in
  }

  const handleBuyAgain = () => {
    handleUpdateToCart(item.orderItems)
    const listIdProduct: string[] = []

    item.orderItems.forEach((item: TOrderedProduct) => {
      listIdProduct.push(item?.product?._id)
    })

    router.push({
      pathname: CONFIG_ROUTE.MY_CART,
      query: { selected: JSON.stringify(listIdProduct) }
    })
  }

  return (
    <>
      <CustomConfirmDialog
        title='Title_cancel_order'
        content='Confirm_cancel_order'
        onClose={handleOnCloseDeleteProducts}
        open={openConfirmCancel}
        handleConfirm={handleCancelOrder}
      />
      <Box mb={5} padding='20px' sx={{ background: theme.palette.background.paper, borderRadius: '15px' }}>
        <Divider />
        {item.orderItems.map((orderOfMe: TOrderedProduct) => {
          return (
            <Box key={orderOfMe.product._id} sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
              <Box sx={{ border: `1px solid rgba(${theme.palette.customColors.main},0.2)` }}>
                <Avatar src={orderOfMe.image} sx={{ width: '90px', height: '80px', objectFit: 'contain' }} />
              </Box>
              <Box sx={{ ml: 3 }}>
                <Typography
                  sx={{
                    display: 'webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {orderOfMe.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {orderOfMe.discount > 0 ? (
                    <Typography
                      color={theme.palette.primary.main}
                      fontWeight='bold'
                      fontSize='15px'
                      sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                    >
                      {`${formatPriceToLocal(orderOfMe.price)} VNĐ`}
                    </Typography>
                  ) : (
                    <Box>{''}</Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
                    <Typography color={theme.palette.primary.main} fontSize='15px' fontWeight='bold'>
                      {orderOfMe.discount > 0
                        ? `${formatPriceToLocal((orderOfMe.price * (100 - orderOfMe.discount)) / 100)} VNĐ`
                        : `${formatPriceToLocal(orderOfMe.price)} VNĐ`}
                    </Typography>
                    {orderOfMe.discount > 0 && (
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
                        >{`-${orderOfMe.discount}%`}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography>{`x${orderOfMe.amount}`}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}

        <Divider />
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Typography color={theme.palette.customColors.darkPaperBg} variant='h3' fontSize='20px' fontWeight='bold'>
              {t('Sum_money')}:
            </Typography>
            <Typography fontSize='20px' color={theme.palette.primary.main}>
              {`${formatPriceToLocal(item.totalPrice)} VNĐ`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
            {[0, 1].includes(tabSelected) && (
              <Button
                variant='outlined'
                sx={{
                  height: '40px',
                  mt: 3,
                  color: '#da251d !important',
                  border: '1px solid #da251d !important',
                  backgroundColor: 'transparent !important'
                }}
                onClick={() => setOpenConfirmCancel(true)}
              >
                {t('Cancel_order')}
              </Button>
            )}
            <Button variant='outlined' sx={{ height: '40px', fontWeight: '600', mt: 3 }}>
              <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
              {t('View_details')}
            </Button>
            <Button variant='contained' sx={{ height: '40px', fontWeight: '600', mt: 3 }} onClick={handleBuyAgain}>
              <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
              {t('Buy_again')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
