//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Box, Button, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Helper
import { getOrderItem, setOrderItem } from 'src/helpers/storage'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Stores
import { RootState } from 'src/stores'
import { updateToCart } from 'src/stores/cart-product'

// ** Types
import { TProduct } from 'src/types/products'

// ** Utils
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'

type TCardProduct = {
  item: TProduct
}

export default function CardProduct({ item }: TCardProduct) {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const slug = router.query
  const { user } = useAuth()

  const dispatch = useDispatch()

  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

  const handleNavigationPage = (slug: string) => {
    router.push(`/product/${slug}`)
  }

  const handleUpdateToCart = (item: TProduct) => {
    const orderItemStorage = getOrderItem()
    const orderParse = orderItemStorage ? JSON.parse(orderItemStorage) : {}

    const arrOrderList = executeUpdateCard(orderItem, {
      name: item.name,
      amount: 1,
      price: item.price,
      product: item._id,
      image: item.image,
      discount: item.discount,
      slug: item.slug,
      discountEndDate: item.discountEndDate || null,
      discountStartDate: item.discountStartDate || null
    })

    if (user?._id) {
      dispatch(
        updateToCart({
          orderItem: arrOrderList
        })
      )

      setOrderItem(JSON.stringify({ ...orderParse, [user?._id]: arrOrderList }))
    } else {
      router.replace({
        pathname: 'login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const isExpiryDay = isExpiry(item.discountStartDate || null, item.discountEndDate || null)

  return (
    <Card sx={{ maxWidth: '450px' }}>
      <CardMedia component='img' height='194' image={item.image} alt='Image' />
      <CardContent sx={{ padding: '15px 15px !important' }}>
        <Typography
          variant='h4'
          color={theme.palette.primary.main}
          fontWeight='bold'
          sx={{
            cursor: 'pointer',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            height: '60px'
          }}
          onClick={() => handleNavigationPage(item.slug)}
        >
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {item.discount > 0 && isExpiryDay && (
            <Typography
              color={theme.palette.primary.main}
              fontWeight='bold'
              variant='h6'
              sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
            >
              {`${formatPriceToLocal(item.price)} VNĐ`}
            </Typography>
          )}
          <Typography color={theme.palette.primary.main} fontWeight='bold' variant='h4'>
            {item.discount && isExpiryDay
              ? `${formatPriceToLocal((item.price * (100 - item.discount)) / 100)} VNĐ`
              : `${formatPriceToLocal(item.price)} VNĐ`}
          </Typography>
          {item.discount > 0 && isExpiryDay && (
            <Box sx={{ backgroundColor: 'rgba(254,238,234,1)', color: theme.palette.error.main, padding: '0px 6px' }}>
              {`-${item.discount}%`}
            </Box>
          )}
        </Box>
        <Typography>
          {item.countInStock > 0 ? `Còn ${item.countInStock} sản phẩm trong kho` : 'Sản phẩm đã hết hàng'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{item.averageRating > 0 ? `${(<b>{item.averageRating}</b>)}` : 'Chưa có đánh giá'}</Typography>
            {item.averageRating > 0 && <CustomIcon icon='emojione:star'></CustomIcon>}
          </Box>

          <CardActions sx={{ padding: '0' }}>
            <IconButton aria-label='add to favorites'>
              <CustomIcon icon='mdi:heart' />
            </IconButton>
          </CardActions>
        </Box>

        <Button
          variant='outlined'
          fullWidth
          sx={{ height: '40px', fontWeight: '600', mt: 2 }}
          onClick={() => handleUpdateToCart(item)}
        >
          <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
          {t('Add_to_cart')}
        </Button>

        <Button variant='contained' fullWidth sx={{ height: '40px', fontWeight: '600', mt: 2 }}>
          <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
          {t('Buy_now')}
        </Button>
      </CardContent>
    </Card>
  )
}
