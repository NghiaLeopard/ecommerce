// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'

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
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import InputSearch from 'src/components/input-search'
import CustomPagination from 'src/components/custom-pagination'

type TProps = {}

const VALUE_OPTIONS_STATUS = {
  WAIT_PAYMENT: 0,
  WAIT_DELIVERY: 1,
  DONE: 2,
  CANCEL: 3,
  ALL: 4
}

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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [tabSelected, setTabSelected] = useState<number>(VALUE_OPTIONS_STATUS.ALL)
  const [search, setSearch] = useState('')

  // ** Selector
  const { orderItem, orderItemMe } = useSelector((state: RootState) => state.orderProduct)

  const OBJECT_TYPE_STATUS = [
    { label: t('All'), value: VALUE_OPTIONS_STATUS.ALL },
    { label: t('Wait_payment'), value: VALUE_OPTIONS_STATUS.WAIT_PAYMENT },
    { label: t('Wait_delivery'), value: VALUE_OPTIONS_STATUS.WAIT_DELIVERY },
    {
      label: t('Done'),
      value: VALUE_OPTIONS_STATUS.DONE
    },
    { label: t('Cancel'), value: VALUE_OPTIONS_STATUS.CANCEL }
  ]

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabSelected(newValue)
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
  }

  useEffect(() => {
    const data = router?.query
    if (data.selected) {
      setCheckboxSelected([data?.selected as string])
    }
  }, [router.query])

  const fetchAllOrderMe = () => {
    const status = tabSelected === 4 ? '' : tabSelected
    const params = {
      limit: pageSize,
      page: 1,
      order: 'created asc',
      search: search,
      status: status
    }
    dispatch(getAllOrderMeAsync({ params: params }))
  }

  useEffect(() => {
    fetchAllOrderMe()
  }, [pageSize, page, search, tabSelected])

  return (
    <>
      {loading && <Spinner />}

      <Tabs
        value={tabSelected}
        onChange={handleChangeTab}
        aria-label='wrapped label tabs example'
        sx={{ borderBottom: 'none !important' }}
      >
        {OBJECT_TYPE_STATUS
          ? OBJECT_TYPE_STATUS.map((item: { label: string; value: number }) => {
              return <Tab value={item.value} key={item.value} label={item.label} />
            })
          : ''}
      </Tabs>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end',mb: 3 }}>
        <Box width='200px'>
          <InputSearch onChange={handleOnChangeSearch} />
        </Box>
      </Box>
      {orderItemMe.length > 0 ? (
        <>
          {orderItemMe.map((item: TItemOrderMe) => {
            return (
              <Box key={item._id}>
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

      <CustomPagination
        page={page}
        pageSize={pageSize}
        rowLength={PAGE_SIZE_OPTION[0]}
        pageSizeOptions={PAGE_SIZE_OPTION}
        onChangePagination={handleChangePagination}
        isHideShowed={true}
      />
    </>
  )
}

export default MyOrderPage
