// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** React
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, CssBaseline, Typography, useTheme } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Regex
import { EMAIL_REG } from 'src/configs/regex'

// ** Image
import ForgotPasswordDark from '/public/images/forgot-password-dark.png'
import ForgotPasswordLight from '/public/images/forgot-password-light.png'

// ** Configs
import { CONFIG_ROUTE } from 'src/configs/route'

type TProps = {}

const schema = yup.object({
  email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type')
})

const ForgotPasswordPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** Router
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: any) => {}

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          padding: { md: '40px', xs: '0px' },
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Box
          display={{
            sm: 'none',
            xs: 'none',
            md: 'flex'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minWidth: '50vw',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? ForgotPasswordLight : ForgotPasswordDark}
            width={0}
            alt='ForgotPassword Image'
            style={{ width: '500px', height: 'auto' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {`${t('Forgot_password')}`}
            </Typography>
            <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
              <Box mt={2} width='325px'>
                <Controller
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CustomTextField
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      fullWidth
                      label='Email'
                      placeholder={t('Enter_your_email')}
                      inputRef={ref}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                  name='email'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Send_request')}
              </Button>
            </form>
            <Button onClick={() => router.push(CONFIG_ROUTE.LOGIN)} fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              {t('Back_login')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ForgotPasswordPage
