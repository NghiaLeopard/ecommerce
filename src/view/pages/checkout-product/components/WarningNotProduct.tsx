// ** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'

// ** Configs
import { CONFIG_ROUTE } from 'src/configs/route'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

interface TWarningNotProduct {
  open: boolean
  onClose: () => void
}

export const WarningNotProduct = ({ open, onClose }: TWarningNotProduct) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** User
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  return (
    <CustomModal open={open}>
      <>
        <Box sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 10, py: 5 }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>{t('Warning')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
            <CustomIcon icon='carbon:warning' fontSize='130px' color={theme.palette.warning.main} />
          </Box>
          <Typography>{t('Warning_order_product')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='contained'
              sx={{ height: '40px', fontWeight: '600', mt: 3 }}
              onClick={() => router.push(CONFIG_ROUTE.LOGIN)}
            >
              {t('Return_home')}
            </Button>
          </Box>
        </Box>
      </>
    </CustomModal>
  )
}
