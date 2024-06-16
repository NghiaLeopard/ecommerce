// ** Next
import { NextPage } from 'next'

// ** React
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Typography, useTheme } from '@mui/material'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Redux
import { useDispatch } from 'react-redux'

// ** Store
import { AppDispatch } from 'src/stores'

// ** utils
import { useRouter } from 'next/router'
import CustomIcon from 'src/components/Icon'

type TProps = {}

const PaymentPage: NextPage<TProps> = () => {
  // **Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Auth
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        borderRadius: '15px',
        px: 4,
        py: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        columnGap: 2
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
          <CustomIcon icon='carbon:warning' fontSize='130px' color={theme.palette.warning.main} />
        </Box>
        <Typography variant='h3' textAlign='center'>
          {t(`Payment_error`)}
        </Typography>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
          <CustomIcon icon='ep:success-filled' fontSize='130px' color={theme.palette.success.main} />
        </Box>
        <Typography variant='h3' textAlign='center'>
          {t(`Payment_success`)}
        </Typography>
      </Box>

      <Button variant='contained' onClick={() => router.push('/')}>
        {t('Back_home')}
      </Button>
    </Box>
  )
}

export default PaymentPage
