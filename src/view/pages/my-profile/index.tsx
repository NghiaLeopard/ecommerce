// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, Button, FormHelperText, Grid, IconButton, InputLabel, useTheme } from '@mui/material'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Regex
import { EMAIL_REG } from 'src/configs/regex'

// ** I18n

// ** Component
import CustomIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** Hooks

// ** Service
import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'
import { getAllCity } from 'src/services/city'

// ** Utils
import toast from 'react-hot-toast'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/auth'
import { updateAuthMeSync } from 'src/stores/auth/actions'

// ** utils
import { CustomSelect } from 'src/components/custom-select'
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
  role: yup.string().required('Please enter role'),
  city: yup.string().required('Please enter city'),
  address: yup.string().required('Please enter address')
})

const MyProfilePage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [allRole, setAllRole] = useState([])
  const [allCity, setAllCity] = useState([])
  const dispatch: AppDispatch = useDispatch()

  const { isErrorUpdateMe, isSuccessUpdateMe, isLoading, messageUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const defaultValues: TDefaultValue = {
    email: '',
    role: '',
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
    setLoading(true)
    await getAuthMe()
      .then(res => {
        setLoading(false)
        const data = res?.data
        if (data) {
          setAvatar(data?.avatar)
          reset({
            email: data?.email,
            role: data?.role?._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            phoneNumber: data?.phoneNumber,
            city: data?.city,
            address: data?.address
          })
        }
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchRole = async () => {
    setLoading(true)
    try {
      setLoading(true)

      const response = await getAllRoles({ params: { limit: -1, page: -1 } })
      const roleArr = response?.data?.roles.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllRole(roleArr)
    } catch (error) {
      setLoading(true)
    }
  }

  useEffect(() => {
    fetchRole()
  }, [])

  const fetchAllCity = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllCity({ params: { limit: -1, page: -1 } })
      const CityArr = response?.data?.cities.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllCity(CityArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCity()
  }, [])

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
        role: data?.role,
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

  // ? : don't helpful, isLoading = true , loading = false to loading = true, isLoading = false
  // render layout will one moment render form , UX is awful!
  // example ? <Spinner /> : <form> , will have  a little time appear form then hide form.
  return (
    <>
      {loading || (isLoading && <Spinner />)}

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
                          <span>{t('Upload_avatar')}</span>
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
                          disabled
                          required
                          onChange={onChange}
                          onBlur={onBlur}
                          value={value}
                          fullWidth
                          label={t('Email')}
                          placeholder={t('Enter_your_email')}
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
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Box>
                          <InputLabel
                            sx={{
                              fontSize: '13px',
                              mb: '0.25rem',
                              color: Boolean(errors.role)
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.bodyBg},0.42)`
                            }}
                          >
                            {t('Role')}
                          </InputLabel>
                          <CustomSelect
                            fullWidth
                            value={value}
                            inputRef={ref}
                            options={allRole}
                            onChange={onChange}
                            error={Boolean(errors.role)}
                          />
                          {Boolean(errors.role) && (
                            <FormHelperText
                              sx={{
                                color: `${theme.palette.error.main} !important`
                              }}
                            >
                              {t('Enter_your_role')}
                            </FormHelperText>
                          )}
                        </Box>
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
                          label={t('Full_name')}
                          placeholder={t('Enter_your_full_name')}
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
                          label={t('Phone_number')}
                          placeholder={t('Enter_your_phone_number')}
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
                          placeholder={t('Enter_your_address')}
                          inputRef={ref}
                          error={Boolean(errors.address)}
                          helperText={errors.address?.message}
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
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Box>
                          <InputLabel
                            sx={{
                              fontSize: '13px',
                              mb: '4px',
                              color: Boolean(errors.role)
                                ? theme.palette.error.main
                                : `rgba(${theme.palette.customColors.bodyBg},0.42)`
                            }}
                          >
                            {t('City')}
                          </InputLabel>
                          <CustomSelect
                            fullWidth
                            onChange={onChange}
                            options={allCity}
                            value={value}
                            placeholder={t('Enter_your_city')}
                            inputRef={ref}
                            error={Boolean(errors.city)}
                          />
                          {Boolean(errors.city) && (
                            <FormHelperText
                              sx={{
                                color: `${theme.palette.error.main} !important`
                              }}
                            >
                              {t('Enter_your_city')}
                            </FormHelperText>
                          )}
                        </Box>
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
            {t('Update')}
          </Button>
        </Box>
      </form>
    </>
  )
}

export default MyProfilePage
