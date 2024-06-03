// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Grid, useTheme } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// ** Component
import CustomPagination from 'src/components/custom-pagination'
import InputSearch from 'src/components/input-search'
import Spinner from 'src/components/spinner'
import CardProduct from './components/CardProduct'
import FilterProduct from './components/FilterProduct'

// ** Configs
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'

// ** Service
import { getAllProductTypes } from 'src/services/product-types'
import { getAllProductsPublic } from 'src/services/products'

// ** Type
import { TProductType } from 'src/types/product-types'
import { TProduct } from 'src/types/products'
import { getAllCity } from 'src/services/city'

interface TProps {}

const HomePage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** i18n
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [listProductPublic, setListProductPublic] = useState<TProduct[]>([])
  const [allProductTypes, setAllProductTypes] = useState([])
  const [reviewSelected, setReviewSelected] = useState('')
  const [citySelected, setCitySelected] = useState('')
  const [tabSelected, setTabSelected] = useState<string>('')
  const [search, setSearch] = useState('')
  const [allCities, setAllCities] = useState<{ label: string; value: string }[]>([])

  // ** Ref
  const firstRender = useRef<boolean>(false)

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const getListProductsPublic = async (review: string, search: string, tabSelected: string, city: string) => {
    setLoading(true)
    const params = {
      limit: 10,
      page: 1,
      search: search,
      minStar: Number(review),
      productType: tabSelected,
      productLocation: city
    }

    try {
      setLoading(false)
      const res = await getAllProductsPublic({ params: params })

      if (res?.data?.products) {
        setListProductPublic(res?.data?.products)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabSelected(newValue)
  }

  const handleFilterProduct = (value: string, name: string) => {
    switch (name) {
      case 'review':
        setReviewSelected(value)
        break

      case 'city':
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

  const fetchAllProductTypes = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllProductTypes({ params: { limit: -1, page: -1 } })
      const productTypesArr = response?.data?.productTypes.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllProductTypes(productTypesArr)
      setTabSelected(productTypesArr[0].value)
      firstRender.current = true
    } catch (error) {
      setLoading(false)
    }
  }

  const handleOnChangeSearch = (value: string) => {
    setSearch(value)
  }

  const fetchAllCities = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllCity({ params: { limit: -1, page: -1 } })

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
    if (firstRender.current) {
      getListProductsPublic(reviewSelected, search, tabSelected, citySelected)
    }
  }, [reviewSelected, search, tabSelected, citySelected])

  useEffect(() => {
    fetchAllProductTypes()
  }, [])

  return (
    <>
      {loading && <Spinner />}

      <Tabs
        value={tabSelected}
        onChange={handleChangeTab}
        aria-label='wrapped label tabs example'
        sx={{ borderBottom: 'none !important' }}
      >
        {allProductTypes
          ? allProductTypes.map((item: TProductType) => {
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
        <Grid item md={2.5}>
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
        <Grid item md={9.5}>
          <Grid container spacing={2}>
            {listProductPublic.map((item: TProduct) => {
              return (
                <>
                  <Grid item key={item?._id} xs={12} sm={6} md={4}>
                    <CardProduct item={item} />
                  </Grid>
                </>
              )
            })}
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
    </>
  )
}

export default HomePage
