//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Avatar, Box, Button, Divider, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'

// ** Component
import CustomIcon from 'src/components/Icon'
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'
import { ModelReviewOrder } from './components/ModalReviewOrder'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Stores
import { AppDispatch, RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'
import { cancelOrderProductMeAsync } from 'src/stores/order-product/actions'
import { resetInitialState } from 'src/stores/reviews'

// ** Types
import { TItemOrderMe, TOrderedProduct } from 'src/types/order-product'

// ** Utils
import { useEffect, useState } from 'react'
import { cloneDeep, executeUpdateCard, formatDate, formatPriceToLocal } from 'src/utils'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { OBJECT_ACTION_STATUS } from 'src/configs/order'
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Service
import { getDetailOrderMe } from 'src/services/order-product'

// ** Other
import toast from 'react-hot-toast'

type TProps = {}

export default function DetailMyOrder({}: TProps) {
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
  const [item, setItem] = useState<TItemOrderMe>({} as any)
  const [openModalReview, setOpenModalReview] = useState({
    open: false,
    userId: '',
    productId: ''
  })

  // ** Selector
  const { isSuccessCreate, isErrorCreate, isMessageCreate, typeError, isLoading } = useSelector(
    (state: RootState) => state.reviews
  )

  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  const arrCountInStockItems: number[] = []

  const orderId = router?.query?.orderId

  const handleOnCloseDeleteProducts = () => {
    setOpenConfirmCancel(false)
  }

  const handleCloseModalReview = () => {
    setOpenModalReview({
      open: false,
      userId: '',
      productId: ''
    })
  }

  const handleCancelOrder = () => {
    dispatch(cancelOrderProductMeAsync(orderId as string))
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

  const fetchDetailOrderOfMe = async (orderId: string) => {
    try {
      const res = await getDetailOrderMe(orderId)
      setItem(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenModalReview = (productId: string, userId: string) => {
    setOpenModalReview({
      open: true,
      userId: userId,
      productId: productId
    })
  }

  useEffect(() => {
    if (orderId) {
      fetchDetailOrderOfMe(orderId as string)
    }
  }, [orderId])

  useEffect(() => {
    if (isMessageCreate) {
      if (isSuccessCreate) {
        toast.success(t('Create_order_success'))
        dispatch(resetInitialState())
        handleCloseModalReview()
      } else if (isErrorCreate) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Create_order_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorCreate, isSuccessCreate])

  return (
    <>
      <CustomConfirmDialog
        title='Title_cancel_order'
        content='Confirm_cancel_order'
        onClose={handleOnCloseDeleteProducts}
        open={openConfirmCancel}
        handleConfirm={handleCancelOrder}
      />

      <ModelReviewOrder
        open={openModalReview.open}
        productId={openModalReview.productId}
        userId={openModalReview.userId}
        onClose={handleCloseModalReview}
      />

      <Box mb={5} padding='20px' sx={{ background: theme.palette.background.paper, borderRadius: '15px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => router.back()}>
            <CustomIcon icon='ep:back' />
            <Typography color={theme.palette.primary.main}>Back</Typography>
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {OBJECT_ACTION_STATUS[item.status]?.value === '2' && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CustomIcon icon='hugeicons:truck-delivery'></CustomIcon>
                <Typography color={theme.palette.success.main} fontSize='17px' fontWeight='700'>
                  {t('Order_has_been_delivery')}
                </Typography>
                <span>|</span>
                <Box>{''}</Box>
              </Box>
            )}
            <Typography fontSize='17px' color={theme.palette.primary.main} fontWeight='600' textTransform='uppercase'>
              {t(`${OBJECT_ACTION_STATUS[item?.status]?.label}`)}
            </Typography>
          </Box>
        </Box>

        <Divider />
        {item?.orderItems?.map((orderOfMe: TOrderedProduct) => {
          arrCountInStockItems.push(orderOfMe.product.countInStock)

          return (
            <Box key={orderOfMe.product._id} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
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
              <Box>
                {OBJECT_ACTION_STATUS[item.status]?.value === '2' && (
                  <Button
                    variant='outlined'
                    sx={{ height: '40px', fontWeight: '600', mt: 3 }}
                    onClick={() => handleOpenModalReview(orderOfMe?.product?._id, user?._id)}
                  >
                    <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
                    {t('Review')}
                  </Button>
                )}
              </Box>
            </Box>
          )
        })}

        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='18px'
                fontWeight='bold'
                width='200px'
              >
                {t('Delivery_address')}:
              </Typography>
              <Typography fontSize='18px' color={theme.palette.primary.main} width='200px'>
                {`${item?.shippingAddress?.address} ${item?.shippingAddress?.city?.name}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='18px'
                fontWeight='bold'
                width='200px'
              >
                {t('Phone_number')}:
              </Typography>
              <Typography fontSize='18px' color={theme.palette.primary.main} width='200px'>
                {`0${item?.shippingAddress?.phone}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='18px'
                fontWeight='bold'
                width='200px'
              >
                {t('Name_user')}:
              </Typography>
              <Typography fontSize='18px' color={theme.palette.primary.main} width='200px'>
                {`${item?.shippingAddress?.fullName} `}
              </Typography>
            </Box>

            {[0, 1].includes(+item?.status) && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                <CustomIcon icon='mdi:payment-clock' />
                {!!item?.isPaid ? (
                  <span style={{ color: theme.palette.success.main }}>{t('Order_has_been_paid')}:</span>
                ) : (
                  <span style={{ color: theme.palette.error.main }}>{t('Order_has_not_been_paid')}</span>
                )}

                <Typography fontWeight='600'>{formatDate(item?.paidAt)}</Typography>
              </Box>
            )}
            <Box>
              {[0, 1].includes(+item?.status) && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                  <CustomIcon icon='icon-park:delivery' />

                  {!!item?.isDelivered ? (
                    <span style={{ color: theme.palette.success.main }}>{t('Order_has_been_delivery')}</span>
                  ) : (
                    <span style={{ color: theme.palette.error.main }}>{t('Order_has_not_been_delivery')}</span>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='20px'
                fontWeight='bold'
                width='150px'
              >
                {t('Price_item')}:
              </Typography>
              <Typography fontSize='20px' color={theme.palette.primary.main} width='150px'>
                {`${formatPriceToLocal(item.itemsPrice)} VNĐ`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='20px'
                fontWeight='bold'
                width='150px'
              >
                {t('Price_shipping')}:
              </Typography>
              <Typography fontSize='20px' color={theme.palette.primary.main} width='150px'>
                {`${formatPriceToLocal(item.shippingPrice)} VNĐ`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
              <Typography
                color={theme.palette.customColors.darkPaperBg}
                variant='h3'
                fontSize='20px'
                fontWeight='bold'
                width='150px'
              >
                {t('Sum_money')}:
              </Typography>
              <Typography fontSize='20px' color={theme.palette.primary.main} width='150px'>
                {`${formatPriceToLocal(item.totalPrice)} VNĐ`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
          {OBJECT_ACTION_STATUS[item.status]?.value !== '2' && (
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

          <Button
            variant='contained'
            sx={{ height: '40px', fontWeight: '600', mt: 3 }}
            onClick={handleBuyAgain}
            disabled={arrCountInStockItems.some(item => item === 0)}
          >
            <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
            {t('Buy_again')}
          </Button>
        </Box>
      </Box>
    </>
  )
}
