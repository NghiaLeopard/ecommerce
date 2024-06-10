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
import { TItemOrderMe, TOrderProduct } from 'src/types/order-product'
import { CONFIG_ROUTE } from 'src/configs/route'
import { getAllOrderMeAsync } from 'src/stores/order-product/actions'
import CardOrderMe from './components/CardOrderMe'

type TProps = {}

const MyOrderPage: NextPage<TProps> = () => {
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
  const { orderItem, orderItemMe } = useSelector((state: RootState) => state.orderProduct)

  useEffect(() => {
    const data = router?.query
    if (data.selected) {
      setCheckboxSelected([data?.selected as string])
    }
  }, [router.query])

  const fetchAllOrderMe = () => {
    const params = {
      limit: 10,
      page: 1,
      order: 'created asc'
    }
    dispatch(getAllOrderMeAsync({ params: params }))
  }

  useEffect(() => {
    fetchAllOrderMe()
  }, [])

  return (
    <>
      {loading && <Spinner />}

      {orderItemMe.length > 0 ? (
        <>
          {orderItemMe.map((item: TItemOrderMe) => {
            return (
              <Box key={item._id} sx={{ background: theme.palette.background.paper, borderRadius: '15px' }}>
                <CardOrderMe item={item} />
              </Box>
            )
          })}
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

export default MyOrderPage
