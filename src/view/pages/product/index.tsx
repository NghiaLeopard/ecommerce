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
import NoData from 'src/components/no-data'
import Spinner from 'src/components/spinner'
import CustomTextField from 'src/components/text-field'
import CardReviewProduct from '../home/components/CardReviewProduct'
import CardProductRelated from '../home/components/CardProductRelated'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Service
import { getAllReviews } from 'src/services/reviews'
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

// ** Config
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Type
import { TReviewsProduct } from 'src/types/reviews'
import toast from 'react-hot-toast'
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { resetInitialState } from 'src/stores/reviews'
import CardSkeletonRelated from '../home/components/CardSkeletonRelated'
import { CustomCarousel } from 'src/components/custom-carousel'

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
  const [listReviewsProduct, setListReviewsProduct] = useState<TReviewsProduct[]>([])
  const [amountCart, setAmountCart] = useState(1)

  // ** Dispatch
  const dispatch = useDispatch()

  // ** Auth
  const { user } = useAuth()

  // ** Selector
  const { orderItem } = useSelector((state: RootState) => state.orderProduct)
  const {
    isLoading,
    isErrorDelete,
    isSuccessDelete,
    isMessageDelete,
    isErrorUpdate,
    isSuccessUpdate,
    isMessageUpdate,
    typeError
  } = useSelector((state: RootState) => state.reviews)

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  }

  const { productSlug } = router?.query

  const isExpiryDay = isExpiry(dataDetailProduct?.discountStartDate, dataDetailProduct?.discountEndDate)

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
      query: { selected: JSON.stringify(item._id) }
    })
  }

  const fetchAllReviewsProduct = async () => {
    const params = {
      limit: 10,
      page: 1,
      productId: dataDetailProduct?._id,
      isPublic: true
    }
    try {
      const res = await getAllReviews({ params: params })
      setListReviewsProduct(res?.data?.reviews)
    } catch (error) {}
  }

  useEffect(() => {
    if (dataDetailProduct?._id) {
      fetchAllReviewsProduct()
    }
  }, [dataDetailProduct?._id, isSuccessUpdate, isSuccessDelete])

  useEffect(() => {
    if (productSlug) {
      fetchDetailProduct(productSlug as string)
    }
  }, [i18n.language, productSlug, isSuccessUpdate, isSuccessDelete])

  useEffect(() => {
    if (productSlug) {
      fetchProductRelated(productSlug as string)
    }
  }, [i18n.language, productSlug])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_reviews_product_success'))
        dispatch(resetInitialState())
        fetchAllReviewsProduct()
      } else if (isErrorDelete) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Delete_reviews_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorUpdate, isSuccessDelete])

  useEffect(() => {
    if (isMessageUpdate) {
      if (isSuccessUpdate) {
        toast.success(t('Update_reviews_product_success'))
        dispatch(resetInitialState())
        fetchAllReviewsProduct()
      } else if (isErrorUpdate) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Update_reviews_product_error'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorDelete, isSuccessUpdate])

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
            borderRadius: '15px'
          }}
          md={12}
          xs={12}
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
                {dataDetailProduct?.averageRating > 0 ? (
                  <Box sx={{ display: 'flex', alignContent: 'center', gap: 1 }}>
                    <Typography
                      sx={{ textDecoration: 'underline', color: theme.palette.primary.main }}
                      fontWeight='600'
                      fontSize='18px'
                    >
                      {dataDetailProduct?.averageRating}
                    </Typography>
                    <Rating
                      name='half-rating'
                      defaultValue={2.5}
                      value={dataDetailProduct?.averageRating}
                      precision={0.5}
                    />
                  </Box>
                ) : (
                  <Typography>Chưa có đánh giá</Typography>
                )}
              </Box>
              <Typography>|</Typography>
              {dataDetailProduct?.totalReviews ? (
                <>
                  <Typography>
                    {dataDetailProduct?.totalReviews} {t('Ratings')}
                  </Typography>

                  <Typography>|</Typography>
                </>
              ) : (
                <></>
              )}
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
                disabled={dataDetailProduct?.countInStock === 0}
              >
                <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
                {t('Add_to_cart')}
              </Button>

              <Button
                disabled={dataDetailProduct?.countInStock === 0}
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
        <Grid container item md={9} xs={12} width='100%'>
          <Box width='100%'>
            <Box sx={{ width: '100%', background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}>
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

            {listReviewsProduct.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  background: theme.palette.background.paper,
                  borderRadius: '15px',
                  px: 4,
                  py: 5,
                  mt: 5
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
                  {t('Review')}
                </Box>
                <Box width='100%' height='auto'>
                  <CustomCarousel
                    swipeable={false}
                    draggable={false}
                    customTransition='all .5'
                    transitionDuration={500}
                    ssr={true}
                    keyBoardControl={true}
                    showDots={true}
                    removeArrowOnDeviceType={['tablet', 'mobile']}
                    responsive={responsive}
                  >
                    {listReviewsProduct?.map((item: TReviewsProduct) => {
                      return <CardReviewProduct key={item._id} item={item} />
                    })}
                  </CustomCarousel>
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid container item md={3} xs={12} mt={{ md: 0, xs: 5 }}>
          <Grid
            item
            sx={{
              height: '100%',
              width: '100%',
              background: theme.palette.background.paper,
              borderRadius: '15px',
              px: 4,
              py: 5
            }}
            md={12}
            marginLeft={{ md: 5, xs: 0 }}
          >
            <Box>
              <Box
                sx={{
                  backgroundColor: theme.palette.customColors.bodyBg,
                  padding: 2,
                  borderRadius: '10px'
                }}
              >
                {t('Product_same')}
              </Box>

              {dataProductRelated.length > 0
                ? dataProductRelated.map((item: TProduct, index) => {
                    return <CardProductRelated item={item} key={item?._id} />
                  })
                : Array.from({ length: 3 }).map((_, index) => {
                    return <CardSkeletonRelated key={index} />
                  })}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ProductDetail
