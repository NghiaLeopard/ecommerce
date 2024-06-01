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
  const [radioSelected, setRadioSelected] = useState('')
  const [tabSelected, setTabSelected] = useState<string>('')
  const [search, setSearch] = useState('')

  const firstRender = useRef<boolean>(false)

  const handleChangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const getListProductsPublic = async () => {
    setLoading(true)
    const params = {
      limit: 10,
      page: 1,
      search: search,
      minStar: Number(radioSelected),
      productType: tabSelected
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

  const handleFilterProduct = (value: string) => {
    setRadioSelected(value)
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

  useEffect(() => {
    if (firstRender.current) {
      getListProductsPublic()
    }
  }, [radioSelected, search, tabSelected])

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
        <Grid item md={3}>
          <Box
            sx={{
              border: `1px solid rgba(${theme.palette.customColors.main},0.2)`,
              p: '10px !important',
              borderRadius: '10px'
            }}
          >
            <FilterProduct value={radioSelected} onChange={handleFilterProduct} />
          </Box>
        </Grid>
        <Grid item md={9}>
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
