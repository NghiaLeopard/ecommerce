// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, Checkbox, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material'

// **Form
import { useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Regex
import { EMAIL_REG } from 'src/configs/regex'

// ** I18n

// ** Component
import Spinner from 'src/components/spinner'

// ** Hooks

// ** Service
import { getAuthMe } from 'src/services/auth'
import { getAllCity } from 'src/services/city'
import { getAllRoles } from 'src/services/role'

// ** Utils
import toast from 'react-hot-toast'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/auth'
import { updateAuthMeSync } from 'src/stores/auth/actions'

// ** utils
import { convertBase64, formatPriceToLocal, separationFullName, toFullName } from 'src/utils'
import { TOrderProduct } from 'src/types/cart-product'
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'

type TProps = {}

const MyCartPage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)
  const dispatch: AppDispatch = useDispatch()

  const { orderItem } = useSelector((state: RootState) => state.cartProduct)

  return (
    <>
      {loading && <Spinner />}

      <Box sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 5 }}>
          <Box sx={{ width: 'calc(10% - 100px)' }}>
            <Tooltip title={t('Selected_all')}>
              <Checkbox />
            </Tooltip>
          </Box>
          <Typography sx={{ width: '80px', marginLeft: '20px' }}>{t('Image')}</Typography>
          <Typography sx={{ flexBasis: '35%' }}>{t('Name_product')}</Typography>
          <Typography sx={{ flexBasis: '20%' }}>{t('Price_original')}</Typography>
          <Typography sx={{ flexBasis: '20%' }}>{t('PriceDiscount')}</Typography>
          <Typography sx={{ flexBasis: '10%' }}>{t('Count')}</Typography>
          <Box sx={{ flexBasis: '5%' }}>
            <Tooltip title='Delete'>
              <IconButton>
                <CustomIcon icon='mingcute:delete-2-fill' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />

        {orderItem.map((item: TOrderProduct) => {
          return (
            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 'calc(10% - 120px)' }}>
                <Checkbox />
              </Box>
              <Avatar src={item.image} sx={{ width: '120px', height: '100px' }} />
              <Typography
                sx={{
                  display: 'webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '-webkit-line-clamp': '1',
                  '-webkit-box-orient': 'vertical',
                  flexBasis: '35%'
                }}
              >
                {item.name}
              </Typography>
              {item.discount > 0 && (
                <Typography
                  color={theme.palette.primary.main}
                  fontWeight='bold'
                  fontSize='20px'
                  sx={{ textDecoration: 'line-through', color: theme.palette.error.main, flexBasis: '20%' }}
                >
                  {`${formatPriceToLocal(item.price)} VNĐ`}
                </Typography>
              )}
              <Typography
                color={theme.palette.primary.main}
                fontSize='20px'
                fontWeight='bold'
                sx={{ flexBasis: '20%' }}
              >
                {item.discount > 0
                  ? `${formatPriceToLocal((item.price * (100 - item.discount)) / 100)} VNĐ`
                  : `${formatPriceToLocal(item.price)} VNĐ`}
              </Typography>
              <Box sx={{ display: 'flex', flexBasis: '10%', gap: 6 }}>
                <Tooltip title='Create'>
                  <IconButton>
                    <CustomIcon icon='ph:plus-bold' />
                  </IconButton>
                </Tooltip>
                <CustomTextField
                  value={item.amount}
                  sx={{
                    '.MuiInputBase-root': {
                      border: 'none',
                      borderBottom: '1px solid',
                      borderRadius: '0 !important'
                    }
                  }}
                />
                <Tooltip title='Create'>
                  <IconButton>
                    <CustomIcon icon='ph:plus-bold' />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ flexBasis: '5%' }}>
                <Tooltip title='Delete'>
                  <IconButton>
                    <CustomIcon icon='mingcute:delete-2-fill' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default MyCartPage
