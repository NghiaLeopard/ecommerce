// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** MUI
import { Box, Button, CssBaseline, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import Spinner from 'src/components/spinner'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import * as yup from 'yup'

// ** Regex
import { PASSWORD_REG } from 'src/configs/regex'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Image
import ResetPasswordDark from '/public/images/reset-password-dark.png'
import ResetPasswordLight from '/public/images/reset-password-light.png'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// Store
import { resetPasswordAuthSync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'
import { AppDispatch, RootState } from 'src/stores'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** yup
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

type TProps = {}

const schema = yup.object({
  newPassword: yup
    .string()
    .required('Please enter password')
    .matches(PASSWORD_REG, 'the password is contain charact,special character,number'),
  confirmNewPassword: yup
    .string()
    .required('Please enter confirm password')
    .matches(PASSWORD_REG, 'the password is contain charact,special character,number')
    .oneOf([yup.ref('newPassword'), ''], 'The confirm password is must match password')
})

const ResetPasswordPage: NextPage<TProps> = () => {
  // ** Theme
  const theme = useTheme()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // ** Auth
  const { logout } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Translation
  const { t } = useTranslation()

  // ** Selector
  const { isLoading, typeError, isErrorResetPassword, messageResetPassword, isSuccessResetPassword } = useSelector(
    (state: RootState) => state.auth
  )

  // ** State
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const handleClickShowNewPassword = () => setShowNewPassword(show => !show)
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword(show1 => !show1)

  const secretKey = router?.query?.secretKey

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: { newPassword: string; confirmNewPassword: string }) => {
    dispatch(resetPasswordAuthSync({ secretKey: secretKey as string, newPassword: data?.newPassword }))
  }

  useEffect(() => {
    if (isSuccessResetPassword) {
      toast.success(t('Reset_password_success'))
      dispatch(resetInitialState())
    } else if (isErrorResetPassword) {
      const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
      if (errorConfig) {
        toast.error(t(`${errorConfig}`))
      } else {
        toast.error(t('Reset_password_error'))
      }
      dispatch(resetInitialState())
    }
  }, [isErrorResetPassword, isSuccessResetPassword])

  return (
    <>
      {isLoading && <Spinner />}

      <Box
        sx={{
          display: 'flex',
          height: '100%',
          padding: '40px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px'
        }}
      >
        <Box
          display={{
            sm: 'flex',
            xs: 'none'
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
            src={theme.palette.mode === 'light' ? ResetPasswordLight : ResetPasswordDark}
            width={0}
            alt='Login Image'
            style={{ width: '538px', height: 'auto' }}
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
              {t('Reset_password')}
            </Typography>
            <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
              <Box mt={2} width='300px' sx={{ mb: '15px' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CustomTextField
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      fullWidth
                      label={t('New_password')}
                      inputRef={ref}
                      type={showNewPassword ? 'text' : 'password'}
                      error={Boolean(errors.newPassword)}
                      placeholder={t('Enter_new_password')}
                      helperText={errors.newPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowNewPassword}
                            edge='end'
                          >
                            {showNewPassword ? (
                              <CustomIcon icon='material-symbols:visibility-outline' />
                            ) : (
                              <CustomIcon icon='material-symbols:visibility-off-outline-rounded' />
                            )}
                          </IconButton>
                        )
                      }}
                    />
                  )}
                  name='newPassword'
                />
              </Box>

              <Box mt={2} width='300px'>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CustomTextField
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      fullWidth
                      label={t('Confirm_new_password')}
                      inputRef={ref}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      placeholder={t('Confirm_new_password')}
                      error={Boolean(errors.confirmNewPassword)}
                      helperText={errors.confirmNewPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmNewPassword}
                            edge='end'
                          >
                            {showConfirmNewPassword ? (
                              <CustomIcon icon='material-symbols:visibility-outline' />
                            ) : (
                              <CustomIcon icon='material-symbols:visibility-off-outline-rounded' />
                            )}
                          </IconButton>
                        )
                      }}
                    />
                  )}
                  name='confirmNewPassword'
                />
              </Box>

              <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Submit')}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default ResetPasswordPage
