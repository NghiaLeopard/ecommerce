//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Avatar, Box, Button, Rating, useTheme } from '@mui/material'
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
import { AppDispatch, RootState } from 'src/stores'
import { updateToCart } from 'src/stores/order-product'

// ** Types
import { TProduct } from 'src/types/products'

// ** Utils
import { likeProductAsync, unLikeProductAsync } from 'src/stores/products/actions'
import { executeUpdateCard, formatPriceToLocal, isExpiry } from 'src/utils'
import { CONFIG_ROUTE } from 'src/configs/route'
import { Divider } from '@mui/material'
import { TItemOrderMe, TOrderProduct } from 'src/types/order-product'

type TCardOrderMe = {
  item: TItemOrderMe
}

export default function CardOrderMe({ item }: TCardOrderMe) {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  // ** Auth
  const { user, setUser } = useAuth()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Selector

  return (
    <Box mb={5} padding='20px'>
      <Divider />
      {item.orderItems.map((orderOfMe: TOrderProduct) => {
        console.log(orderOfMe.discount)

        return (
          <Box key={orderOfMe.product} sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
            <Box sx={{ border: `1px solid rgba(${theme.palette.customColors.main},0.2)` }}>
              <Avatar src={orderOfMe.image} sx={{ width: '90px', height: '80px', objectFit: 'contain' }} />
            </Box>
            <Box sx={{ ml: 3 }}>
              <Typography
                sx={{
                  display: 'webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {orderOfMe.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {orderOfMe.discount > 0 ? (
                  <Typography
                    color={theme.palette.primary.main}
                    fontWeight='bold'
                    fontSize='15px'
                    sx={{ textDecoration: 'line-through', color: theme.palette.error.main }}
                  >
                    {`${formatPriceToLocal(orderOfMe.price)} VNĐ`}
                  </Typography>
                ) : (
                  <Box>{''}</Box>
                )}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
                  <Typography color={theme.palette.primary.main} fontSize='15px' fontWeight='bold'>
                    {orderOfMe.discount > 0
                      ? `${formatPriceToLocal((orderOfMe.price * (100 - orderOfMe.discount)) / 100)} VNĐ`
                      : `${formatPriceToLocal(orderOfMe.price)} VNĐ`}
                  </Typography>
                  {orderOfMe.discount > 0 && (
                    <Box
                      sx={{
                        backgroundColor: 'rgba(254,238,234,1)'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: theme.palette.error.main,
                          padding: '4px 8px'
                        }}
                      >{`-${orderOfMe.discount}%`}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography>{`x${orderOfMe.amount}`}</Typography>
              </Box>
            </Box>
          </Box>
        )
      })}

      <Divider />
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
          <Typography color={theme.palette.customColors.darkPaperBg} variant='h3' fontSize='20px' fontWeight='bold'>
            {t('Sum_money')}:
          </Typography>
          <Typography fontSize='20px' color={theme.palette.primary.main}>
            {`${formatPriceToLocal(item.totalPrice)} VNĐ`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
          <Button variant='contained' sx={{ height: '40px', fontWeight: '600', mt: 3 }}>
            <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
            {t('Buy_again')}
          </Button>
          <Button variant='contained' sx={{ height: '40px', fontWeight: '600', mt: 3 }}>
            <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
            {t('View_details')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
