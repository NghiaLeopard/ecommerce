// ** Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

// ** React
import { useEffect, useState } from 'react'

// ** MUI
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
  useTheme
} from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Regex
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** Image
import LoginDark from '/public/images/login-dark.png'
import LoginLight from '/public/images/login-light.png'

// Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Context
import { LoginParams } from 'src/contexts/types'

// ** Hook
import toast from 'react-hot-toast'

// ** i18n
import { useTranslation } from 'react-i18next'
import {
  clearAuthSocialToken,
  getAuthSocialToken,
  getDeviceToken,
  getRememberAuth,
  setAuthSocialToken,
  setRememberAuth
} from 'src/helpers/storage'
import Spinner from 'src/components/spinner'
import { CONFIG_ROUTE } from 'src/configs/route'
import useFcmToken from 'src/hooks/useFcmToken'

type TProps = {}

const schema = yup.object({
  email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type'),
  password: yup
    .string()
    .required('Please enter password')
    .matches(PASSWORD_REG, 'the password is contain charact,special character,number')
})

const LoginPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t } = useTranslation()

  // ** Hook
  const { login, loginGoogle, loginFacebook } = useAuth()
  const { data: session, status } = useSession()
  const { fcmToken } = useFcmToken()

  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [isRemember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleClickShowPassword = () => setShowPassword(show => !show)

  // ** localStorage
  const authSocialToken = getAuthSocialToken()
  const rememberAuth = getRememberAuth()
  const deviceToken = getDeviceToken() || ''

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      email: 'admin@gmail.com',
      password: '123456789Kha@'
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: LoginParams) => {
    if (!Object.keys(errors)?.length) {
      login({ ...data, rememberMe: isRemember, deviceToken: deviceToken }, error => {
        const message = error?.response?.data?.message

        if (message) toast.error(message)
      })
    }
  }

  const handleLoginGoogleToken = () => {
    signIn('google')
    clearAuthSocialToken()
  }

  const handleLoginFacebookToken = () => {
    signIn('facebook')
    clearAuthSocialToken()
  }

  useEffect(() => {
    if ((session as any)?.accessToken && (session as any)?.accessToken !== authSocialToken) {
      if ((session as any)?.provider === 'google') {
        loginGoogle(
          {
            idToken: (session as any)?.accessToken,
            rememberMe: rememberAuth ? rememberAuth === 'true' : isRemember,
            deviceToken: deviceToken
          },
          error => {
            const message = error?.response?.data?.message

            if (message) toast.error(message)
          }
        )
      } else {
        loginFacebook(
          {
            idToken: (session as any)?.accessToken,
            rememberMe: rememberAuth ? rememberAuth === 'true' : isRemember,
            deviceToken: deviceToken
          },
          error => {
            const message = error?.response?.data?.message

            if (message) toast.error(message)
          }
        )
      }

      setAuthSocialToken((session as any)?.accessToken)
    }
  }, [(session as any)?.accessToken])

  return (
    <>
      {(status === 'loading' || isLoading) && <Spinner />}

      <Box
        sx={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          padding: '40px',
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
            src={theme.palette.mode === 'light' ? LoginLight : LoginDark}
            width={600}
            alt='Login Image'
            style={{ width: 'auto', height: 'auto' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography component='h1' variant='h5'>
              {`${t('Login')}`}
            </Typography>
            <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
              <Box mt={2} width='300px'>
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

              <Box mt={2} width='300px'>
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
                      label={t('Password')}
                      inputRef={ref}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('Enter_password')}
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowPassword}
                            edge='end'
                          >
                            {showPassword ? (
                              <CustomIcon icon='material-symbols:visibility-outline' />
                            ) : (
                              <CustomIcon icon='material-symbols:visibility-off-outline-rounded' />
                            )}
                          </IconButton>
                        )
                      }}
                    />
                  )}
                  name='password'
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={e => {
                        setRemember(e.target.checked), setRememberAuth(JSON.stringify(e.target.checked))
                      }}
                      checked={isRemember}
                      color='primary'
                    />
                  }
                  label={t('Remember_me')}
                />
                <Link href={CONFIG_ROUTE.FORGOT_PASSWORD} style={{ color: theme.palette.primary.main }}>
                  {`${t('Forgot_password')}`}
                </Link>
              </Box>
              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Sign_in')}
              </Button>
              <Grid container>
                <Grid item xs>
                  {t('You_have_account')}
                </Grid>
                <Grid item>
                  <Link href='/register' style={{ color: '#7367f0' }}>
                    {t('Register')}
                  </Link>
                </Grid>
              </Grid>

              <Typography sx={{ textAlign: 'center', mt: 2, mb: 2 }}>{`${t('Or')}`}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <IconButton sx={{ color: '#497ce2' }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                    onClick={handleLoginFacebookToken}
                  >
                    <path
                      fill='currentColor'
                      d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                    ></path>
                  </svg>
                </IconButton>
                <IconButton sx={{ color: theme.palette.error.main }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    role='img'
                    fontSize='1.375rem'
                    className='iconify iconify--mdi'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                    onClick={handleLoginGoogleToken}
                  >
                    <path
                      fill='currentColor'
                      d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                    ></path>
                  </svg>
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
