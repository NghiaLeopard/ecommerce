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

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Service
import { getDetailProductsPublic } from 'src/services/products'

// ** Utils
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

// ** Redux

// ** Store
import { updateToCart } from 'src/stores/cart-product'
import { RootState } from 'src/stores'

// ** utils
import { useDispatch, useSelector } from 'react-redux'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

type TProps = {}

const ProductDetail: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataDetailProduct, setDataDetailProduct] = useState<TProduct | any>({})
  const [amountCart, setAmountCart] = useState(1)
  const dispatch = useDispatch()
  const { user } = useAuth()

  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

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

  const handleChangeAmountCart = (item: TProduct, amount: number) => {
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

  const isExpiryDay = isExpiry(dataDetailProduct.discountStartDate, dataDetailProduct.discountEndDate)

  useEffect(() => {
    if (productSlug) {
      fetchDetailProduct(productSlug as string)
    }
  }, [i18n.language])

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
              src={dataDetailProduct?.image || ''}
              alt='Image detail product'
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
                '-webkit-line-clamp': '2',
                '-webkit-box-orient': 'vertical'
              }}
            >
              {dataDetailProduct?.name}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <Typography>
              {dataDetailProduct?.countInStock > 0
                ? `Còn ${dataDetailProduct?.countInStock} sản phẩm trong kho`
                : t('Sold_product')}
            </Typography>

            <Box sx={{ display: 'flex', flexBasis: '10%', gap: 2 }}>
              <Tooltip title='Delete'>
                <IconButton
                  sx={{
                    backgroundColor: `${theme.palette.primary.main} !important`,
                    color: theme.palette.common.white
                  }}
                  onClick={() => handleChangeAmountCart(dataDetailProduct, -1)}
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
                  onClick={() => handleChangeAmountCart(dataDetailProduct, 1)}
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

                // onClick={() => handleUpdateToCart(dataDetailProduct)}
              >
                <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
                {t('Add_to_cart')}
              </Button>

              <Button variant='contained' sx={{ height: '40px', fontWeight: '600', mt: 2 }}>
                <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
                {t('Buy_now')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Box
        sx={{
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          m: 1
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
          Description_product
        </Box>
        <div dangerouslySetInnerHTML={{ __html: dataDetailProduct?.description }} style={{ marginTop: '10px' }}></div>
      </Box>
    </>
  )
}

export default ProductDetail
