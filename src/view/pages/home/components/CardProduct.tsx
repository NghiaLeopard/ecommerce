import { Box, Button, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import CustomIcon from 'src/components/Icon'
import { TProduct } from 'src/types/products'
import { formatPriceToLocal } from 'src/utils'

type TCardProduct = {
  item: TProduct
}

export default function CardProduct({ item }: TCardProduct) {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()

  const slug = router.query

  const handleNavigationPage = (slug: string) => {
    router.push(`/product/${slug}`)
  }

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
            '-webkit-box-orient': 'vertical'
          }}
          onClick={() => handleNavigationPage(item.slug)}
        >
          {item.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {item.discount > 0 && (
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
            {item.discount > 0
              ? `${formatPriceToLocal((item.price * (100 - item.discount)) / 100)} VNĐ`
              : `${formatPriceToLocal(item.price)} VNĐ`}
          </Typography>
          <Box sx={{ backgroundColor: 'rgba(254,238,234,1)', color: theme.palette.error.main, padding: '0px 6px' }}>
            {`-${item.discount}%`}
          </Box>
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

        <Button type='submit' variant='outlined' fullWidth sx={{ height: '40px', fontWeight: '600', mt: 2 }}>
          <CustomIcon icon='mdi:cart-outline' style={{ marginRight: '5px' }} />
          {t('Add_to_cart')}
        </Button>

        <Button type='submit' variant='contained' fullWidth sx={{ height: '40px', fontWeight: '600', mt: 2 }}>
          <CustomIcon icon='icon-park-twotone:buy' style={{ marginRight: '5px' }} />
          {t('Buy_now')}
        </Button>
      </CardContent>
    </Card>
  )
}
