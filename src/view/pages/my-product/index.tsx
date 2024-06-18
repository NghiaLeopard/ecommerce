// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** Mui
import { Box, Grid, useTheme } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// ** Component
import CustomPagination from 'src/components/custom-pagination'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import CardProduct from '../home/components/CardProduct'
import NoData from 'src/components/no-data'

// ** Configs
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Service

// ** Type
import { TProductType } from 'src/types/product-types'
import { TProduct } from 'src/types/products'

// ** Services

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/products'
import { getListProductsLikedAsync, getListProductsViewedAsync } from 'src/stores/products/actions'
import CardSkeleton from '../home/components/cardSkeleton'

interface TProps {}

const MyProductPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** State
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [tabSelected, setTabSelected] = useState<string>('PRODUCT_LIKED')
  const [search, setSearch] = useState('')
  const [listAction, getListAction] = useState([
    {
      label: t('Product_liked'),
      value: 'PRODUCT_LIKED'
    },
    {
      label: t('Product_viewed'),
      value: 'PRODUCT_VIEWED'
    }
  ])

  // ** Ref
  const firstRender = useRef<boolean>(false)

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Selector
  const {
    isLoading,
    productsLiked,
    productsViewed,
    isErrorLikeProduct,
    isSuccessLikeProduct,
    isMessageLikeProduct,
    typeError,
    isErrorUnLikeProduct,
    isSuccessUnLikeProduct,
    isMessageUnLikeProduct
  } = useSelector((state: RootState) => state.products)

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabSelected(newValue)
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
  }

  const getListProductsLiked = () => {
    const params = {
      limit: pageSize,
      page: page,
      search: search
    }
    dispatch(
      getListProductsLikedAsync({
        params: params
      })
    )
  }

  const getListProductsViewed = () => {
    const params = {
      limit: pageSize,
      page: page,
      search: search
    }
    dispatch(
      getListProductsViewedAsync({
        params: params
      })
    )
  }

  useEffect(() => {
    if (tabSelected === 'PRODUCT_LIKED') {
      getListProductsLiked()
    } else if (tabSelected === 'PRODUCT_VIEWED') {
      getListProductsViewed()
    }
  }, [search, tabSelected])

  useEffect(() => {
    if (isMessageUnLikeProduct) {
      if (isSuccessUnLikeProduct) {
        toast.success(t('UnLike_product_success'))
        dispatch(resetInitialState())
        if (tabSelected === 'PRODUCT_LIKED') {
          getListProductsLiked()
        } else if (tabSelected === 'PRODUCT_VIEWED') {
          getListProductsViewed()
        }
      } else if (isErrorUnLikeProduct) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('UnLike_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorUnLikeProduct, isSuccessUnLikeProduct])

  useEffect(() => {
    if (isMessageLikeProduct) {
      if (isSuccessLikeProduct) {
        toast.success(t('Like_product_success'))
        dispatch(resetInitialState())
        if (tabSelected === 'PRODUCT_LIKED') {
          getListProductsLiked()
        } else if (tabSelected === 'PRODUCT_VIEWED') {
          getListProductsViewed()
        }
      } else if (isErrorLikeProduct) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Like_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorLikeProduct, isSuccessLikeProduct])

  return (
    <>
      {(loading || isLoading) && <Spinner />}
      <Box sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}>
        <Tabs
          value={tabSelected}
          onChange={handleChangeTab}
          aria-label='wrapped label tabs example'
          sx={{ borderBottom: 'none !important' }}
        >
          {listAction
            ? listAction.map((item: TProductType) => {
                return <Tab value={item.value} key={item.value} label={item.label} />
              })
            : ''}
        </Tabs>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box width='200px'>
            <InputSearch onChange={handleOnChangeSearch} />
          </Box>
        </Box>
        <Grid
          container
          spacing={{
            md: 6,
            xs: 4
          }}
          mt='10px !important'
        >
          <Grid item md={12}>
            <Grid container spacing={5}>
              {tabSelected === 'PRODUCT_LIKED' &&
                (productsLiked.data.length > 0
                  ? productsLiked?.data.map((item: TProduct) => {
                      return (
                        <>
                          <Grid item key={item?._id} xs={12} sm={6} md={3}>
                            <CardProduct item={item} key={item?._id} />
                          </Grid>
                        </>
                      )
                    })
                  : Array.from({ length: 8 }).map((_, index) => {
                      return (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                          <CardSkeleton />
                        </Grid>
                      )
                    }))}

              {tabSelected === 'PRODUCT_VIEWED' &&
                (productsViewed.data.length > 0
                  ? productsViewed?.data.map((item: TProduct) => {
                      return (
                        <>
                          <Grid item key={item?._id} xs={12} sm={6} md={3}>
                            <CardProduct item={item} key={item?._id} />
                          </Grid>
                        </>
                      )
                    })
                  : Array.from({ length: 8 }).map((_, index) => {
                      return (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                          <CardSkeleton />
                        </Grid>
                      )
                    }))}
            </Grid>
          </Grid>
        </Grid>

        <CustomPagination
          page={page}
          pageSize={pageSize}
          rowLength={PAGE_SIZE_OPTION[0]}
          pageSizeOptions={PAGE_SIZE_OPTION}
          onChangePagination={handleChangePagination}
          isHideShowed={true}
        />
      </Box>
    </>
  )
}

export default MyProductPage
