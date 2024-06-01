// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, Rating, Typography, useTheme } from '@mui/material'

// **Form

// **Yup

// ** Regex

// ** I18n

// ** Type
import { TProduct } from 'src/types/products'

// ** Component
import Spinner from 'src/components/spinner'
import CustomIcon from 'src/components/Icon'

// ** Hooks

// ** Service
import { getDetailProductsPublic } from 'src/services/products'

// ** Utils

// ** Redux

// ** Store

// ** utils
import { formatPriceToLocal } from 'src/utils'

type TProps = {}

const ProductDetail: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataDetailProduct, setDataDetailProduct] = useState<TProduct | any>({})

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

  const handleAddToCart = (data: TProduct) => {}

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
              {dataDetailProduct?.discount > 0 && (
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
                {dataDetailProduct?.discount > 0
                  ? `${formatPriceToLocal((dataDetailProduct?.price * (100 - dataDetailProduct?.discount)) / 100)} VNĐ`
                  : `${formatPriceToLocal(dataDetailProduct?.price)} VNĐ`}
              </Typography>

              {dataDetailProduct?.discount && (
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

            <Box sx={{ display: 'flex', direction: 'column', gap: 5, mt: '20px' }}>
              <Button
                variant='outlined'
                sx={{ height: '40px', fontWeight: '600', mt: 2 }}
                onClick={() => handleAddToCart(dataDetailProduct)}
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
