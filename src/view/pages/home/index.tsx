// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

// ** Mui
import { Box, Grid, useTheme } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// ** Component
import CustomPagination from 'src/components/custom-pagination'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import CardProduct from './components/CardProduct'
import CardSkeleton from './components/CardSkeleton'
import FilterProduct from './components/FilterProduct'

// ** Configs
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Service
import { getAllProductTypes } from 'src/services/product-types'
import { getAllProductsPublic } from 'src/services/products'

// ** Type
import { TProductType } from 'src/types/product-types'
import { TProduct } from 'src/types/products'

// ** Services
import { getAllCity } from 'src/services/city'

// ** Store
import { resetInitialState } from 'src/stores/products'
import { RootState } from 'src/stores'
import ChatBoxAi from 'src/components/chat-box-ai'

interface TProps {}

type TServerSide = {
  dataServer: []
  listProductTypesServer: Record<string, string>[]
  paramsServer: {
    limit: number
    page: number
    totalPage: number
    orderBy: string
    productType: string
  }
}

const HomePage: NextPage<TServerSide> = ({ dataServer, listProductTypesServer, paramsServer }: TServerSide) => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  // ** State
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [tabSelected, setTabSelected] = useState<string>('')
  const [listProductPublic, setListProductPublic] = useState<TProduct[]>([])
  const [allProductTypes, setAllProductTypes] = useState<Record<string, string>[]>([])
  const [reviewSelected, setReviewSelected] = useState('')
  const [citySelected, setCitySelected] = useState('')
  const [search, setSearch] = useState('')
  const [allCities, setAllCities] = useState<{ label: string; value: string }[]>([])

  // ** Ref
  const firstRender = useRef<boolean>(false)
  const serverRender = useRef<boolean>(false)

  // ** Dispatch
  const dispatch = useDispatch()

  // ** Selector
  const {
    isLoading,
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
    if (!firstRender.current) {
      firstRender.current = true
    }
    setTabSelected(newValue)
  }

  const getListProductsPublic = async (review: string, search: string, tabSelected: string, city: string) => {
    setLoading(true)

    const params = {
      limit: 10,
      page: 1,
      search: search,
      maxStar: +review,
      productType: tabSelected,
      productLocation: city
    }

    try {
      const res = await getAllProductsPublic({ params: params })
      setLoading(false)

      if (res?.data?.products) {
        setListProductPublic(res?.data?.products)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleFilterProduct = (value: string, name: string) => {
    switch (name) {
      case 'review':
        if (!firstRender.current) {
          firstRender.current = true
        }
        setReviewSelected(value)
        break

      case 'city':
        if (!firstRender.current) {
          firstRender.current = true
        }
        setCitySelected(value)
        break

      default:
        break
    }
  }

  const handleDeleteAll = () => {
    setReviewSelected('')
    setCitySelected('')
  }

  const handleOnChangeSearch = (value: string) => {
    if (!firstRender.current && !!serverRender.current) {
      firstRender.current = true
    }
    setSearch(value)
  }

  const fetchAllCities = async () => {
    setLoading(true)
    try {
      const response = await getAllCity({ params: { limit: -1, page: -1 } })
      setLoading(false)

      const productTypesArr = response?.data?.cities.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllCities(productTypesArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (!!firstRender.current && !!serverRender.current) {
      getListProductsPublic(reviewSelected, search, tabSelected, citySelected)
    }
  }, [reviewSelected, search, tabSelected, citySelected])

  console.log(!!firstRender.current, !!serverRender.current)

  // ** always only render: serverRender = false
  useEffect(() => {
    if (!serverRender.current && !!dataServer.length && !!listProductTypesServer.length && paramsServer?.productType) {
      setAllProductTypes(
        listProductTypesServer.map(item => ({
          value: item?._id,
          label: item?.name
        }))
      )
      setListProductPublic(dataServer)
      setTabSelected(paramsServer?.productType)
      setPage(paramsServer?.page)
      setPageSize(paramsServer?.limit)
      serverRender.current = true
    }
  }, [dataServer, listProductTypesServer, paramsServer?.productType])

  useEffect(() => {
    if (isMessageUnLikeProduct) {
      if (isSuccessUnLikeProduct) {
        toast.success(t('UnLike_product_success'))
        dispatch(resetInitialState())
        getListProductsPublic(reviewSelected, search, tabSelected, citySelected)
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
        getListProductsPublic(reviewSelected, search, tabSelected, citySelected)
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

      <ChatBoxAi />
      <Tabs
        value={tabSelected}
        onChange={handleChangeTab}
        aria-label='wrapped label tabs example'
        sx={{ borderBottom: 'none !important' }}
      >
        {allProductTypes
          ? allProductTypes.map((item: any) => {
              return <Tab value={item.value} key={item.value} label={item.label} />
            })
          : ''}
      </Tabs>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Box width='200px'>
          <InputSearch onChange={value => handleOnChangeSearch(value)} />
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
        <Grid item md={3} sm={12} xs={12}>
          <Box
            sx={{
              border: `1px solid rgba(${theme.palette.customColors.main},0.2)`,
              p: '10px !important',
              borderRadius: '10px'
            }}
          >
            <FilterProduct
              valueReview={reviewSelected}
              valueCities={citySelected}
              onChange={handleFilterProduct}
              dataCities={allCities}
              deleteAll={handleDeleteAll}
            />
          </Box>
        </Grid>
        <Grid item md={9}>
          <Grid container spacing={5}>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => {
                  return (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <CardSkeleton />
                    </Grid>
                  )
                })
              : listProductPublic.map((item: TProduct) => {
                  return (
                    <Grid item key={item?._id} xs={12} sm={6} md={4}>
                      <CardProduct item={item} />
                    </Grid>
                  )
                })}

            <CustomPagination
              marginTop='20'
              page={page}
              pageSize={pageSize}
              rowLength={PAGE_SIZE_OPTION[0]}
              pageSizeOptions={PAGE_SIZE_OPTION}
              onChangePagination={handleChangePagination}
              isHideShowed={true}
              totalPage={paramsServer?.totalPage}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default HomePage
