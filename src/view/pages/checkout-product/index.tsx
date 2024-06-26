// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme
} from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'
import NoData from 'src/components/no-data'
import Spinner from 'src/components/spinner'
import { CreateDeliveryAddress } from './components/CreateDeliveryAddress'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils
import { formatPriceToLocal, toFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState, updateToCart } from 'src/stores/order-product'
import { createOrderProductsAsync } from 'src/stores/order-product/actions'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Type
import { TOrderProduct } from 'src/types/order-product'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Services
import { getAllCity } from 'src/services/city'
import { getAllDeliveryType } from 'src/services/delivery-type'
import { getAllPaymentType } from 'src/services/payment-type'
import { createUrlPaymentVNPay } from 'src/services/payment'
import { WarningNotProduct } from './components/WarningNotProduct'

// ** Other
import Swal from 'sweetalert2'

type TProps = {}

type TAddresses = {
  firstName: string
  lastName: string
  middleName: string
  phoneNumber: string
  address: string
  city: string
  isDefault: boolean
}

const CheckOutProductPage: NextPage<TProps> = () => {
  // **Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Auth
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Selector
  const { isLoading, isErrorCreateOrderMe, isMessageCreateOrderMe, isSuccessCreateOrderMe, typeError, orderItem } =
    useSelector((state: RootState) => state.orderProduct)

  // ** State
  const [loading, setLoading] = useState(false)
  const [listDeliveryType, setListDeliveryType] = useState<{ label: string; value: string; price: number }[]>([])
  const [listPaymentType, setListPaymentType] = useState<{ label: string; value: string }[]>([])
  const [deliveryTypeSelected, setDeliveryTypeSelected] = useState('')
  const [paymentTypeSelected, setPaymentTypeSelected] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openModalWarning, setOpenModalWarning] = useState(false)
  const [allCity, setAllCity] = useState<{ label: string; value: string }[]>([])

  const handleFormatProduct = (item: Record<string, string>[]) => {
    return orderItem.filter((order: TOrderProduct) => item.some(subItem => subItem.product === order.product))
  }

  const memoQueryProduct = useMemo(() => {
    const result = {
      totalPrice: 0,
      products: []
    }
    const data: any = router?.query
    if (data) {
      result.totalPrice = data.totalPrice || 0

      // ** check because json don't accept undefine
      result.products = data.products ? handleFormatProduct(JSON.parse(data.products)) : []
    }

    return { ...result }
  }, [router.query, orderItem])

  const memoAddressDefault = useMemo(() => {
    return user?.addresses?.find((item: TAddresses) => item.isDefault)
  }, [user])

  const memoLabelCity = useMemo(() => {
    return allCity.find(item => item.value === memoAddressDefault.city)
  }, [memoAddressDefault, allCity, user])

  const memoPriceDeliveryType = useMemo(() => {
    const findDelivery = listDeliveryType.find(item => item.value === deliveryTypeSelected)

    return findDelivery?.price || 0
  }, [deliveryTypeSelected, listDeliveryType])

  const handleCloseModal = () => {
    setOpenCreate(false)
  }

  const handleChangeDeliverySelected = (value: string) => {
    setDeliveryTypeSelected(value)
  }

  const handleChangePaymentSelected = (value: string) => {
    setPaymentTypeSelected(value)
  }

  const getListDeliveryType = async () => {
    try {
      const res = await getAllDeliveryType({ params: { page: -1, limit: -1 } })

      if (res.data.deliveryTypes) {
        const dataDeliveryTypes = res.data.deliveryTypes.map((item: any) => {
          return { label: item.name, value: item._id, price: item.price }
        })

        setListDeliveryType(dataDeliveryTypes)
        setDeliveryTypeSelected(dataDeliveryTypes[0].value)
      }
    } catch (error) {}
  }

  const getListPaymentType = async () => {
    try {
      const res = await getAllPaymentType({ params: { page: -1, limit: -1 } })
      if (res.data.paymentTypes) {
        const dataPaymentTypes = res.data.paymentTypes.map((item: any) => {
          return { label: item.name, value: item._id }
        })

        setListPaymentType(dataPaymentTypes)
        setPaymentTypeSelected(dataPaymentTypes[0].value)
      }
    } catch (error) {}
  }

  const handleClickPayment = async (type: string, orderId: string, totalPrice: number) => {
    try {
      switch (type) {
        case 'VN Pay': {
          const res = await createUrlPaymentVNPay({
            totalPrice,
            language: i18n.language === 'vi' ? 'vn' : i18n.language,
            orderId
          })

          console.log(res?.data)

          window.open(res?.data, '_blank')

          break
        }

        default:
          break
      }
    } catch (error) {}
  }

  const handleOrderProduct = () => {
    const findPaymentMethod = listDeliveryType.find(item => item.value === deliveryTypeSelected)
    const shippingPrice = findPaymentMethod ? findPaymentMethod.price : 0
    const totalPrice = +memoQueryProduct.totalPrice + Number(shippingPrice)

    if (user) {
      dispatch(
        createOrderProductsAsync({
          orderItems: memoQueryProduct.products,
          itemsPrice: +memoQueryProduct.totalPrice,
          fullName: toFullName(user?.lastName, user?.middleName, user?.firstName, i18n.language),
          address: user?.address,
          city: user?.city,
          phone: user?.phoneNumber,
          user: user?._id,
          paymentMethod: paymentTypeSelected,
          deliveryMethod: deliveryTypeSelected,
          shippingPrice: shippingPrice,
          totalPrice: totalPrice
        })
      ).then(res => {
        const orderPayment = listPaymentType.find(
          (item: { value: string; label: string }) => item.value === res?.payload?.data?.paymentMethod
        )

        if (orderPayment) {
          handleClickPayment(orderPayment?.label, res?.payload?.data?._id, res?.payload?.data?.totalPrice)
        }
      })
    }
  }

  const fetchAllCity = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllCity({ params: { limit: -1, page: -1 } })
      const CityArr = response?.data?.cities.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllCity(CityArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListDeliveryType()
  }, [])

  useEffect(() => {
    getListPaymentType()
  }, [])

  useEffect(() => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}

    if (isMessageCreateOrderMe) {
      if (isSuccessCreateOrderMe) {
        toast.success(t('Order_product_success'))
        dispatch(resetInitialState())
        Swal.fire({
          title: 'Congratulation!',
          text: t('Order_product_success'),
          icon: 'success',
          confirmButtonText: t('Done_order')
        }).then(result => {
          if (result.isConfirmed) {
          }
        })
        const filterOrderItem = orderItem.filter(
          (item: TOrderProduct) =>
            !memoQueryProduct.products.some((itemMemo: TOrderProduct) => itemMemo.product === item.product)
        )

        dispatch(
          updateToCart({
            orderItem: filterOrderItem
          })
        )
        setOrderItem(JSON.stringify({ ...dataCartParse, [user?._id]: filterOrderItem }))
      } else if (isErrorCreateOrderMe) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Order_product_error'))
        }
        dispatch(resetInitialState())
        Swal.fire({
          title: 'Error!',
          text: t('Warning_order_product'),
          icon: 'error',
          confirmButtonText: t('Done_order')
        })
      }
    }
  }, [isErrorCreateOrderMe, isSuccessCreateOrderMe])

  useEffect(() => {
    fetchAllCity()
  }, [])

  useEffect(() => {
    // ** router always just only value
    if (!router?.query?.products) {
      setOpenModalWarning(true)
    }
  }, [router])

  return (
    <>
      <CreateDeliveryAddress open={openCreate} onClose={handleCloseModal} tabActiveDefault={1} />
      <WarningNotProduct open={openModalWarning} onClose={handleCloseModal} />

      {(loading || isLoading) && <Spinner />}
      <Box
        sx={{
          padding: '30px',
          background: theme.palette.background.paper,
          borderRadius: '15px',
          px: 4,
          py: 5,
          width: '100%'
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomIcon icon='mdi:address-marker' color={theme.palette.primary.main} />
            <Typography>{t('Delivery_address')}</Typography>
          </Box>
          {!memoAddressDefault ? (
            <Button variant='contained' sx={{ marginTop: '5px' }} onClick={() => setOpenCreate(true)}>
              {t('Add_address')}
            </Button>
          ) : (
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3, marginTop: '10px', alignItems: 'center' }}
            >
              <Typography fontWeight='bold'>
                {memoAddressDefault.phoneNumber}{' '}
                {toFullName(
                  memoAddressDefault.lastName,
                  memoAddressDefault.middleName,
                  memoAddressDefault.firstName,
                  i18n.language
                )}
              </Typography>
              <Typography>
                {memoLabelCity ? memoLabelCity?.label : ''} {memoAddressDefault.address}
              </Typography>
              <Button variant='contained' sx={{ marginTop: '5px' }} onClick={() => setOpenCreate(true)}>
                {t('Change_address')}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {memoQueryProduct?.products?.length > 0 ? (
        <>
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '15px',
              px: 4,
              py: 5,
              width: '100%',
              marginTop: '30px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 5 }}>
              <Typography sx={{ width: '100px', marginLeft: '20px' }}>{t('Image')}</Typography>
              <Typography sx={{ flexBasis: '35%' }}>{t('Name_product')}</Typography>
              <Typography sx={{ flexBasis: '20%' }}>{t('Price_original')}</Typography>
              <Typography sx={{ flexBasis: '20%' }}>{t('Price_discount')}</Typography>
              <Typography sx={{ flexBasis: '10%' }}>{t('Count')}</Typography>
            </Box>
            {memoQueryProduct?.products?.map((item: TOrderProduct) => {
              return (
                <Box key={item.product}>
                  <Divider />

                  <Box key={item.product} sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
                    <Avatar src={`${item.image}`} sx={{ width: '120px', height: '100px' }} />
                    <Typography
                      sx={{
                        display: 'webkit-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '-webkit-line-clamp': '1',
                        '-webkit-box-orient': 'vertical',
                        flexBasis: '35%'
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box sx={{ flexBasis: '20%' }}>
                      {item.discount > 0 ? (
                        <Typography
                          color={theme.palette.primary.main}
                          fontWeight='bold'
                          fontSize='20px'
                          sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                        >
                          {`${formatPriceToLocal(item.price)} VNĐ`}
                        </Typography>
                      ) : (
                        <Box>{''}</Box>
                      )}
                    </Box>
                    <Typography
                      color={theme.palette.primary.main}
                      fontSize='20px'
                      fontWeight='bold'
                      sx={{ flexBasis: '20%' }}
                    >
                      {item.discount > 0
                        ? `${formatPriceToLocal((item.price * (100 - item.discount)) / 100)} VNĐ`
                        : `${formatPriceToLocal(item.price)} VNĐ`}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexBasis: '10%',
                        fontSize: '18px',
                        gap: 2,
                        color: theme.palette.primary.main,
                        fontWeight: 'bold'
                      }}
                    >
                      {item.amount}
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            padding: '30px',
            background: theme.palette.background.paper,
            borderRadius: '15px',
            px: 4,
            py: 5,
            width: '100%',
            marginTop: '10px'
          }}
        >
          <NoData widthImage={80} heightImage={80} textImage='No_data' />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column !important',
          columnGap: '20px',
          background: theme.palette.background.paper,
          borderRadius: '15px',
          px: 4,
          py: 5,
          width: '100%',
          marginTop: '30px'
        }}
      >
        <FormControl>
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
            <FormLabel
              id='demo-radio-buttons-group-label'
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold', marginTop: '3px', width: '180px' }}
            >
              {t('Delivery_type')}
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              value={deliveryTypeSelected}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChangeDeliverySelected(e.target.value)
              }}
              name='radio-buttons-group'
            >
              {listDeliveryType.map(item => {
                return (
                  <FormControlLabel
                    checked={deliveryTypeSelected === item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                    key={item.value}
                  />
                )
              })}
            </RadioGroup>
          </Box>
        </FormControl>

        <FormControl sx={{ marginTop: '20px' }}>
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
            <FormLabel
              id='demo-radio-buttons-group-label'
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold', marginTop: '3px', width: '180px' }}
            >
              {t('Payment_type')}
            </FormLabel>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              value={paymentTypeSelected}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChangePaymentSelected(e.target.value)
              }}
              name='radio-buttons-group'
            >
              {listPaymentType.map(item => {
                return (
                  <FormControlLabel
                    checked={paymentTypeSelected === item.value}
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                    key={item.value}
                  />
                )
              })}
            </RadioGroup>
          </Box>
        </FormControl>

        <Box
          sx={{
            display: 'flex',

            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography sx={{ width: '200px', fontSize: '20px' }}>{`${t('Price_item')}:`}</Typography>
            <Typography sx={{ width: '200px', fontSize: '20px' }}>{`${formatPriceToLocal(
              memoQueryProduct.totalPrice
            )} VNĐ`}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography sx={{ width: '200px', fontSize: '20px' }}>{`${t('Price_shipping')}:`}</Typography>
            <Typography sx={{ width: '200px', fontSize: '20px' }}>{`${formatPriceToLocal(
              memoPriceDeliveryType
            )} VNĐ`}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography sx={{ width: '200px', fontSize: '20px' }}>{`${t('Total_price')}:`}</Typography>
            <Typography
              sx={{ width: '200px', fontSize: '20px', color: theme.palette.primary.main, fontWeight: '600' }}
            >{`${formatPriceToLocal(+memoQueryProduct.totalPrice + memoPriceDeliveryType)} VNĐ`}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '8px' }}>
        <Button variant='contained' sx={{ height: '40px', fontWeight: '600', mt: 3 }} onClick={handleOrderProduct}>
          {t('Order')}
        </Button>
      </Box>
    </>
  )
}

export default CheckOutProductPage
