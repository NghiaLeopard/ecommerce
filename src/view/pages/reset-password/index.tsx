// ** Next
import { NextPage } from 'next'
import Image from 'next/image'

// ** MUI
import { Box, Button, CssBaseline, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'

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
import RegisterDark from '/public/images/register-dark.png'
import RegisterLight from '/public/images/register-light.png'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// Store
import { AppDispatch, RootState } from 'src/stores'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** yup
import { yupResolver } from '@hookform/resolvers/yup'

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

  // ** Translation
  const { t } = useTranslation()

  // ** Selector
  const {} = useSelector((state: RootState) => state.auth)

  // ** State
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const handleClickShowNewPassword = () => setShowNewPassword(show => !show)
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword(show1 => !show1)

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
    // dispatch(ResetPasswordAuthSync({ currentPassword: data?.currentPassword, newPassword: data?.newPassword }))
  }

  // useEffect(() => {
  //   if (messageResetPassword) {
  //     if (isErrorResetPassword) {
  //       toast.error(messageResetPassword)
  //     } else if (isSuccessResetPassword) {
  //       toast.success(messageResetPassword)
  //       setTimeout(() => {
  //         logout()
  //       }, 500)
  //     }
  //   }
  // }, [isErrorResetPassword, isSuccessResetPassword, messageResetPassword])

  return (
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
          src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
          width={0}
          height={0}
          alt='Login Image'
          style={{ width: '63.5%', height: '100%' }}
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
  )
}

export default ResetPasswordPage
