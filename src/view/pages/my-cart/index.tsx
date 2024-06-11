// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'
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
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'

// ** utils
import { useRouter } from 'next/router'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Type
import { TOrderProduct } from 'src/types/order-product'
import { CONFIG_ROUTE } from 'src/configs/route'
import { ItemProductCart } from './components/ItemProductCart'

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
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  // ** Memo
  const memoAllId = useMemo(() => {
    return orderItem.map((item: TOrderProduct) => item.product)
  }, [orderItem])

  const memoProductSelected = useMemo(() => {
    const newArr: TOrderProduct[] = []

    orderItem.map((item: TOrderProduct) => {
      if (checkboxSelected.includes(item.product)) {
        newArr.push({ ...item })
      }
    })

    return newArr
  }, [checkboxSelected, orderItem])

  const memoTotalPriceProductSelected = useMemo(() => {
    const total = memoProductSelected.reduce((result, current: TOrderProduct) => {
      const currentPrice = current.discount > 0 ? (current.price * (100 - current.discount)) / 100 : current.price

      return (result += currentPrice * current.amount)
    }, 0)

    return total
  }, [memoProductSelected])

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
      setCheckboxSelected([])
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

  const handleNavigationCheckOut = () => {
    const productQuery = memoProductSelected.map(item => ({
      amount: item.amount,
      product: item.product
    }))
    router.push({
      pathname: CONFIG_ROUTE.CHECKOUT_PRODUCT,
      query: { totalPrice: memoTotalPriceProductSelected, products: JSON.stringify(productQuery) }
    })
  }

  useEffect(() => {
    const data = router?.query?.selected as string
    if (data) {
      if (typeof JSON.parse(data) === 'string') {
        setCheckboxSelected([JSON.parse(data)])
      } else {
        const dataParse = JSON.parse(data)
        setCheckboxSelected([...dataParse])
      }
    }
  }, [router.query])

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
                <Tooltip title={t('Delete_all')}>
                  <span>
                    <IconButton onClick={handleDeleteManyCart} disabled={checkboxSelected.length <= 0}>
                      <CustomIcon icon='mingcute:delete-2-fill' />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
            {orderItem.map((item: TOrderProduct) => {
              return (
                <ItemProductCart
                  key={item.product}
                  item={item}
                  checkboxSelected={checkboxSelected}
                  handleChangeCheckbox={handleChangeCheckbox}
                />
              )
            })}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
              <Typography color={theme.palette.customColors.darkPaperBg} variant='h3' fontSize='25px' fontWeight='bold'>
                {t('Sum_money')}:
              </Typography>
              <Typography fontSize='25px' color={theme.palette.primary.main}>
                {`${formatPriceToLocal(memoTotalPriceProductSelected)} VNĐ`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: '8px' }}>
            <Button
              variant='contained'
              sx={{ height: '40px', fontWeight: '600', mt: 3 }}
              disabled={checkboxSelected.length <= 0}
              onClick={handleNavigationCheckOut}
            >
              <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-3px', marginRight: '2px' }} />
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
