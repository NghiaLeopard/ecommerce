// ** Next
import { NextPage } from 'next'

// ** React
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, Button, Checkbox, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'
import NoData from 'src/components/no-data'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils
import { executeUpdateCard, formatPriceToLocal } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { updateToCart } from 'src/stores/cart-product'

// ** utils
import { useRouter } from 'next/router'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Type
import { TOrderProduct } from 'src/types/cart-product'

type TProps = {}

const MyCartPage: NextPage<TProps> = () => {
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

  // ** State
  const [loading, setLoading] = useState(false)
  const [checkboxSelected, setCheckboxSelected] = useState<string[]>([])

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

  // ** Meno
  const memoAllId = useMemo(() => {
    return orderItem.map((item: TOrderProduct) => item.product)
  }, [orderItem])

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

  const handleDeleteManyCart = () => {
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}
    const filteredCart = orderItem.filter((item: TOrderProduct) => !checkboxSelected.includes(item.product))
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

  const handleChangeCheckbox = (id: string) => {
    const hadArr = checkboxSelected.includes(id)
    if (hadArr) {
      const filteredArr = checkboxSelected.filter((item: string) => item !== id)
      setCheckboxSelected([...filteredArr])
    } else {
      setCheckboxSelected(prev => [...prev, id])
    }
  }

  const handleChangeManyCheckbox = (value: string) => {
    const hadArr = checkboxSelected.length === orderItem.length
    if (hadArr) {
      setCheckboxSelected([])
    } else {
      setCheckboxSelected(memoAllId)
    }
  }

  return (
    <>
      {loading && <Spinner />}

      {orderItem.length > 0 ? (
        <>
          <Box sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 5 }}>
              <Box sx={{ width: 'calc(10% - 100px)' }}>
                <Tooltip title={t('Select_all')}>
                  <Checkbox
                    checked={memoAllId.every(id => checkboxSelected.includes(id))}
                    value={memoAllId}
                    onChange={e => handleChangeManyCheckbox(e.target.value)}
                  />
                </Tooltip>
              </Box>
              <Typography sx={{ width: '80px', marginLeft: '20px' }}>{t('Image')}</Typography>
              <Typography sx={{ flexBasis: '35%' }}>{t('Name_product')}</Typography>
              <Typography sx={{ flexBasis: '20%' }}>{t('Price_original')}</Typography>
              <Typography sx={{ flexBasis: '20%' }}>{t('PriceDiscount')}</Typography>
              <Typography sx={{ flexBasis: '10%' }}>{t('Count')}</Typography>
              <Box sx={{ flexBasis: '5%' }}>
                <Tooltip title='Delete'>
                  <IconButton onClick={handleDeleteManyCart} disabled={checkboxSelected.length <= 0}>
                    <CustomIcon icon='mingcute:delete-2-fill' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {orderItem.map((item: TOrderProduct) => {
              return (
                <>
                  <Divider />

                  <Box key={item.product} sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
                    <Box sx={{ width: 'calc(10% - 120px)' }}>
                      <Checkbox
                        checked={checkboxSelected.includes(item.product)}
                        value={item.product}
                        onChange={e => handleChangeCheckbox(e.target.value)}
                      />
                    </Box>
                    <Avatar src={item.image} sx={{ width: '120px', height: '100px' }} />
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
                    <Box sx={{ display: 'flex', flexBasis: '10%', gap: 2 }}>
                      <Tooltip title='Create'>
                        <IconButton
                          sx={{
                            backgroundColor: `${theme.palette.primary.main} !important`,
                            color: theme.palette.common.white
                          }}
                          onClick={() => handleChangeAmountCart(item, -1)}
                        >
                          <CustomIcon icon='ic:baseline-minus' />
                        </IconButton>
                      </Tooltip>
                      <CustomTextField
                        value={item.amount}
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
                      <Tooltip title='Create'>
                        <IconButton
                          onClick={() => handleChangeAmountCart(item, 1)}
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
                        <IconButton onClick={() => handleDeleteCart(item.product)}>
                          <CustomIcon icon='mingcute:delete-2-fill' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '8px' }}>
            <Button
              variant='contained'
              sx={{ height: '40px', fontWeight: '600', mt: 3 }}
              disabled={checkboxSelected.length <= 0}
            >
              {t('Buy_now')}
            </Button>
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
            width: '100%'
          }}
        >
          <NoData widthImage={80} heightImage={80} textImage='No_data' />
        </Box>
      )}
    </>
  )
}

export default MyCartPage
