//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

// ** MUI
import { Avatar, Box, Button, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Helper

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Stores
import { AppDispatch } from 'src/stores'

// ** Types

// ** Utils
import { Divider } from '@mui/material'
import { TItemOrderMe, TOrderProduct } from 'src/types/order-product'
import { formatPriceToLocal } from 'src/utils'

type TProps = {
  item: TItemOrderMe
}

export default function CardOrderMe({ item }: TProps) {
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

  return (
    <>
      <Box mb={5} padding='20px' sx={{ background: theme.palette.background.paper, borderRadius: '15px' }}>
        <Divider />
        {item.orderItems.map((orderOfMe: TOrderProduct) => {
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
            <Button variant='outlined' sx={{ height: '40px', fontWeight: '600', mt: 3 }}>
              <CustomIcon icon='icon-park-outline:buy' style={{ marginTop: '-2px', marginRight: '3px' }} />
              {t('View_details')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}
