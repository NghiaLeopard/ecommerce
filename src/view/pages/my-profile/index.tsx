// ** Next
import { NextPage } from 'next'

// ** MUI
import { Avatar, Box, Button, Grid, IconButton, useTheme } from '@mui/material'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Regex
import { EMAIL_REG } from 'src/configs/regex'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** I18n
import { t } from 'i18next'

// ** Component
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import FallbackSpinner from 'src/components/fall-back'
import CustomIcon from 'src/components/Icon'

// ** Hooks

// ** Service
import { getAuthMe } from 'src/services/auth'

// ** Context
import { UserDataType } from 'src/contexts/types'

// ** Utils
import toast from 'react-hot-toast'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/apps/auth'
import { updateAuthMeSync } from 'src/stores/apps/auth/actions'

// ** utils
import { convertBase64, separationFullName, toFullName } from 'src/utils'

type TProps = {}

type TDefaultValue = {
  email: string
  role: string
  fullName: string
  phoneNumber: string
  address: string
  city: string
}

const schema = yup.object({
  email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type'),
  fullName: yup.string().required('Please enter email'),
  phoneNumber: yup.string().required('Please enter email').min(8, 'The number phone is min 8 number'),
  role: yup.string().required('Please enter email'),
  city: yup.string().required('Please enter email'),
  address: yup.string().required('Please enter email')
})

const MyProfilePage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { i18n } = useTranslation()

  const [loading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserDataType | null>(null)
  const [avatar, setAvatar] = useState('')
  const [roleId, setRoleID] = useState('')
  const dispatch: AppDispatch = useDispatch()
  console.log(user)

  const { isErrorUpdateMe, isSuccessUpdateMe, isLoading, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const defaultValues: TDefaultValue = {
    email: user?.email || '',

    // @ts-ignore
    role: user?.role?.name || '',
    fullName: '',
    phoneNumber: '',
    city: '',
    address: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const fetchAuMe = async () => {
    setIsLoading(true)
    await getAuthMe()
      .then(res => {
        setIsLoading(false)
        setUser(res)
        const data = res?.data
        if (data) {
          setRoleID(data?.role?._id)
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            role: data?.role?.name,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            phoneNumber: data?.phoneNumber,
            city: data?.city,
            address: data?.address
          })
        }
      })
      .catch(e => {
        setIsLoading(false)
        setUser(null)
      })
  }
  const handleOnSubmit = (data: any) => {
    const { firstName, lastName, middleName } = separationFullName(data?.fullName, i18n.language)
    dispatch(
      updateAuthMeSync({
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        address: data?.address,
        role: roleId,
        avatar
      })
    )
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  useEffect(() => {
    fetchAuMe()
  }, [i18n.language])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
      }
      dispatch(resetInitialState())
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  return (
    <>
      {isLoading || loading ? (
        <FallbackSpinner />
      ) : (
        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          <Grid container>
            <Grid
              container
              item
              md={6}
              xs={12}
              sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}
            >
              <Box sx={{ width: '100%', height: '100%' }}>
                <Grid container spacing={4}>
                  <Grid item md={12} xs={12} mt={5}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <Box position='relative'>
                        {avatar && (
                          <IconButton
                            edge='start'
                            color='inherit'
                            onClick={() => setAvatar('')}
                            sx={{
                              my: '60px',
                              ml: '70px',
                              position: 'absolute',
                              zIndex: 1,
                              color: 'red'
                            }}
                          >
                            <CustomIcon icon='line-md:account-delete'></CustomIcon>
                          </IconButton>
                        )}
                        {avatar ? (
                          <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                            <CustomIcon icon='gravity-ui:person' fontSize={60} />
                          </Avatar>
                        ) : (
                          <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                            <CustomIcon icon='gravity-ui:person' fontSize={60} />
                          </Avatar>
                        )}
                      </Box>

                      <Box>
                        <WrapperFileUpload
                          uploadFunc={handleUploadAvatar}
                          objectAcceptFile={{
                            'image/jpeg': ['.jpg', '.jpeg']
                          }}
                        >
                          <Button
                            fullWidth
                            variant='outlined'
                            sx={{ width: 'auto', display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}
                          >
                            <CustomIcon icon='gravity-ui:camera'></CustomIcon>
                            <span>{t('upload_image')}</span>
                          </Button>
                        </WrapperFileUpload>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
                      <Controller
                        control={control}
                        rules={{
                          required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <CustomTextField
                            required
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            fullWidth
                            label={t('Email')}
                            placeholder={t('enter_your_email')}
                            inputRef={ref}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                          />
                        )}
                        name='email'
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
                      <Controller
                        control={control}
                        rules={{
                          required: true
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <CustomTextField
                            disabled
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            fullWidth
                            label={t('Role')}
                            placeholder={t('enter_your_role')}
                            inputRef={ref}
                            error={Boolean(errors.role)}
                            helperText={errors.role?.message}
                          />
                        )}
                        name='role'
                      />
                    </Box>
                  </Grid>{' '}
                </Grid>
              </Box>
            </Grid>

            <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  background: theme.palette.background.paper,
                  borderRadius: '15px',
                  px: 4,
                  py: 5
                }}
                marginLeft={{ md: 5, xs: 0 }}
              >
                <Grid container spacing={4}>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
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
                            label={t('Full_Name')}
                            placeholder={t('enter_your_full_name')}
                            inputRef={ref}
                            error={Boolean(errors.fullName)}
                            helperText={errors.fullName?.message}
                          />
                        )}
                        name='fullName'
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <CustomTextField
                            onChange={e => {
                              const numValue = e.target.value.replace(/\D/g, '')
                              onChange(numValue)
                            }}
                            inputProps={{
                              pattern: '[0-9]*',
                              inputMode: 'numeric'
                            }}
                            onBlur={onBlur}
                            value={value}
                            fullWidth
                            label={t('Phone_Number')}
                            placeholder={t('enter_your_phone_number')}
                            inputRef={ref}
                            error={Boolean(errors.phoneNumber)}
                            helperText={errors.phoneNumber?.message}
                          />
                        )}
                        name='phoneNumber'
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
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
                            label={t('Address')}
                            placeholder={t('enter_your_address')}
                            inputRef={ref}
                            error={Boolean(errors.city)}
                            helperText={errors.city?.message}
                          />
                        )}
                        name='address'
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
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
                            label={t('City')}
                            placeholder={t('enter_your_city')}
                            inputRef={ref}
                            error={Boolean(errors.city)}
                            helperText={errors.city?.message}
                          />
                        )}
                        name='city'
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
              {t('Change')}
            </Button>
          </Box>
        </form>
      )}
    </>
  )
}

export default MyProfilePage