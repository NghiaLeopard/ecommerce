// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, IconButton, Rating, Tooltip, Typography, useTheme } from '@mui/material'

// ** Type
import { TProduct } from 'src/types/products'

// ** Component
import CustomIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import NoData from 'src/components/no-data'
import CardProductRelated from '../home/components/CardProductRelated'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Service
import { getAllProductsRelevant, getDetailProductsPublic } from 'src/services/products'

// ** Utils
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

// ** Redux

// ** Store
import { RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'

// ** utils
import { useDispatch, useSelector } from 'react-redux'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'
import { CONFIG_ROUTE } from 'src/configs/route'

type TProps = {}

const ProductDetail: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** State
  const [loading, setLoading] = useState(false)
  const [dataDetailProduct, setDataDetailProduct] = useState<TProduct | any>({})
  const [dataProductRelated, setDataProductRelated] = useState<TProduct[]>([])
  const [amountCart, setAmountCart] = useState(1)

  // ** Dispatch
  const dispatch = useDispatch()

  // ** Auth
  const { user } = useAuth()

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)

  const { productSlug } = router?.query

  const fetchDetailProduct = async (slug: string) => {
    setLoading(true)
    try {
      const res = await getDetailProductsPublic(slug)
      setLoading(false)
      setDataDetailProduct(res.data)
    } catch (error) {
      setLoading(false)
    }
  }

  const fetchProductRelated = async (slug: string) => {
    setLoading(true)
    try {
      const res = await getAllProductsRelevant({ params: { slug } })
      setLoading(false)
      setDataProductRelated(res.data.products)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleChangeAmountCart = (amount: number) => {
    setAmountCart(prev => (prev += amount))
  }

  const handleUpdateToCart = (item: TProduct, amount: number) => {
    if (amount === -1 && amountCart <= 1) return
    const dataCart = getOrderItem()
    const dataCartParse = dataCart ? JSON.parse(dataCart) : {}

    const arrCart = executeUpdateCard(orderItem, {
      name: item.name,
      amount: amount,
      slug: item.slug,
      price: item.price,
      product: item._id,
      image: item.image,
      discount: item.discount,
      discountEndDate: item.discountEndDate || null,
      discountStartDate: item.discountStartDate || null
    })

    // This page is public then when adjust amount cart , you must log in

    if (user?._id) {
      setAmountCart(prev => (prev += amount))

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

  const handleBuyProduct = (item: TProduct) => {
    handleUpdateToCart(item, 1)
    router.push({
      pathname: CONFIG_ROUTE.MY_CART,
      query: { selected: item._id }
    })
  }

  const isExpiryDay = isExpiry(dataDetailProduct?.discountStartDate, dataDetailProduct?.discountEndDate)

  useEffect(() => {
    if (productSlug) {
      fetchDetailProduct(productSlug as string)
    }
  }, [i18n.language, productSlug])

  useEffect(() => {
    if (productSlug) {
      fetchProductRelated(productSlug as string)
    }
  }, [i18n.language, productSlug])

  console.log(dataDetailProduct)

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        <Grid
          container
          item
          sx={{
            padding: '20px',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '15px',
            m: 1
          }}
          md={12}
          xs={12}
          spacing={5}
        >
          <Grid item xs={12} md={5}>
            <Image
              alt='Image detail product'
              src={dataDetailProduct?.image}
              width={0}
              height='300'
              style={{
                width: '100%',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography
              variant='h4'
              color={theme.palette.primary.main}
              fontWeight='bold'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {dataDetailProduct?.name}
            </Typography>
            <Box>
              <Typography sx={{ mt: '5xpx' }}>
                {dataDetailProduct?.countInStock > 0
                  ? `Còn ${dataDetailProduct?.countInStock} sản phẩm trong kho`
                  : t('Out_in_stock')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>
                  {dataDetailProduct?.averageRating > 0
                    ? `${(<b>{dataDetailProduct?.averageRating}</b>)}`
                    : 'Chưa có đánh giá'}
                </Typography>
                {dataDetailProduct?.averageRating > 0 && (
                  <Rating name='half-rating' defaultValue={2.5} precision={0.5} />
                )}
              </Box>
              <Typography>|</Typography>
              <Typography>
                {t('Sold_product')} {dataDetailProduct?.sold} {t('Product')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <CustomIcon icon='carbon:location' />
              {dataDetailProduct?.location?._id && <Typography>{dataDetailProduct.location.name}</Typography>}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: theme.palette.customColors.bodyBg,
                width: '100%',
                padding: 2,
                borderRadius: '10px'
              }}
            >
              {dataDetailProduct?.discount > 0 && isExpiryDay && (
                <Typography
                  color={theme.palette.primary.main}
                  fontWeight='bold'
                  variant='h6'
                  sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                >
                  {`${formatPriceToLocal(dataDetailProduct?.price)} VNĐ`}
                </Typography>
              )}
              <Typography color={theme.palette.primary.main} fontWeight='bold' variant='h4'>
                {dataDetailProduct?.discount > 0 && isExpiryDay
                  ? `${formatPriceToLocal((dataDetailProduct?.price * (100 - dataDetailProduct?.discount)) / 100)} VNĐ`
                  : `${formatPriceToLocal(dataDetailProduct?.price)} VNĐ`}
              </Typography>

              {dataDetailProduct?.discount && isExpiryDay && (
                <Box
                  sx={{ backgroundColor: 'rgba(254,238,234,1)', color: theme.palette.error.main, padding: '0px 6px' }}
                >
                  {`-${dataDetailProduct.discount}%`}
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexBasis: '10%', gap: 2, mt: '5px' }}>
              <Tooltip title='Delete'>
                <IconButton
                  sx={{
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: theme.palette.common.white
                  }}
                  onClick={() => handleChangeAmountCart(-1)}
                >
                  <CustomIcon icon='ic:baseline-minus' />
                </IconButton>
              </Tooltip>
              <CustomTextField
                value={amountCart}
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
                  onClick={() => handleChangeAmountCart(1)}
                  sx={{
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: theme.palette.common.white
                  }}
                >
                  <CustomIcon icon='ph:plus-bold' />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', direction: 'column', gap: 5, mt: '20px' }}>
              <Button
                variant='outlined'
                sx={{ height: '40px', fontWeight: '600', mt: 2 }}
                onClick={() => handleUpdateToCart(dataDetailProduct, amountCart)}
                disabled={dataDetailProduct.countInStock === 0}
              >
                <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
                {t('Add_to_cart')}
              </Button>

              <Button
                disabled={dataDetailProduct.countInStock === 0}
                variant='contained'
                sx={{ height: '40px', fontWeight: '600', mt: 2 }}
                onClick={() => handleBuyProduct(dataDetailProduct)}
              >
                <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
                {t('Buy_now')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid container mt={{ md: 5, xs: 0 }} width='100%'>
        <Grid
          container
          item
          md={9}
          xs={12}
          sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '15px'
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.customColors.bodyBg,
                  width: '100%',
                  padding: 2,
                  borderRadius: '10px'
                }}
              >
                {t('Description_product')}
              </Box>
              <div
                dangerouslySetInnerHTML={{ __html: dataDetailProduct?.description }}
                style={{ marginTop: '10px' }}
              ></div>
            </Box>
          </Box>
        </Grid>

        <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              background: theme.palette.background.paper,
              borderRadius: '15px',
              px: 4,
              py: 5
            }}
            marginLeft={{ md: 5, xs: 0 }}
          >
            <Box>
              <Box
                sx={{
                  backgroundColor: theme.palette.customColors.bodyBg,
                  width: '100%',
                  padding: 2,
                  borderRadius: '10px'
                }}
              >
                {t('Product_same')}
              </Box>

              {dataProductRelated.length > 0 ? (
                dataProductRelated.map((item: TProduct) => {
                  return <CardProductRelated item={item} key={item?._id} />
                })
              ) : (
                <Box sx={{ padding: '30px' }}>
                  <NoData widthImage={80} heightImage={80} textImage='No_data' />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductDetail
