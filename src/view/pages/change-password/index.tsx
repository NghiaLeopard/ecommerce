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
import { changePasswordAuthSync } from 'src/stores/auth/actions'

// ** Toast
import toast from 'react-hot-toast'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** yup
import { yupResolver } from '@hookform/resolvers/yup'

type TProps = {}

const schema = yup.object({
  currentPassword: yup
    .string()
    .required('Please enter email')
    .matches(PASSWORD_REG, 'the password is contain charact,special character,number'),
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

const ChangePasswordPage: NextPage<TProps> = () => {
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const { logout } = useAuth()
  const { t } = useTranslation()

  const { isErrorChangePassword, isLoading, isSuccessChangePassword, messageChangePassword } = useSelector(
    (state: RootState) => state.auth
  )

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const handleClickShowCurrentPassword = () => setShowCurrentPassword(show => !show)
  const handleClickShowNewPassword = () => setShowNewPassword(show => !show)
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword(show1 => !show1)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    dispatch(changePasswordAuthSync({ currentPassword: data?.currentPassword, newPassword: data?.newPassword }))
  }

  useEffect(() => {
    if (messageChangePassword) {
      if (isErrorChangePassword) {
        toast.error(messageChangePassword)
      } else if (isSuccessChangePassword) {
        toast.success(messageChangePassword)
        setTimeout(() => {
          logout()
        }, 500)
      }
    }
  }, [isErrorChangePassword, isSuccessChangePassword, messageChangePassword])

  return (
    <Box
      sx={{
        display: 'flex',
        height: '89vh',
        padding: '40px',
        backgroundColor: theme.palette.background.paper
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
            {t('Change_password')}
          </Typography>
          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box mt={2} width='300px' sx={{ mb: '15px' }}>
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
                    type={showCurrentPassword ? 'text' : 'password'}
                    error={Boolean(errors.currentPassword)}
                    placeholder={t('Enter_current_password')}
                    helperText={errors.currentPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowCurrentPassword}
                          edge='end'
                        >
                          {showCurrentPassword ? (
                            <CustomIcon icon='material-symbols:visibility-outline' />
                          ) : (
                            <CustomIcon icon='material-symbols:visibility-off-outline-rounded' />
                          )}
                        </IconButton>
                      )
                    }}
                  />
                )}
                name='currentPassword'
              />
            </Box>

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
              {t('Change_password')}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default ChangePasswordPage
