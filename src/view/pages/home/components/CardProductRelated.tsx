//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Box, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Stores
import { RootState } from 'src/stores'

// ** Types
import { TProduct } from 'src/types/products'

// ** Utils
import { useMemo } from 'react'
import { formatPriceToLocal, isExpiry } from 'src/utils'

type TCardProduct = {
  item: TProduct
}

export default function CardProductRelated({ item }: TCardProduct) {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  const handleNavigationPage = (slug: string) => {
    router.push(`/product/${slug}`)
  }

  const isExpiryDay = useMemo(() => {
    return isExpiry(item.discountStartDate || null, item.discountEndDate || null)
  }, [item])

  return (
    <Card sx={{ maxWidth: '400px', mt: '15px' }}>
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
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
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
        {item?.location?.id && <Typography>{item?.location?.name}</Typography>}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '-8px' }}>
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
      </CardContent>
    </Card>
  )
}