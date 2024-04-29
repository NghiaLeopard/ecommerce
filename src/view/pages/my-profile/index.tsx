// ** Next
import { NextPage } from 'next'

// ** MUI
import { Avatar, Box, Button, Grid, useTheme } from '@mui/material'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Regex
import { EMAIL_REG } from 'src/configs/regex'

// ** React
import CustomIcon from 'src/components/Icon'

// ** Image
import { t } from 'i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'

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
  phoneNumber: yup.string().required('Please enter email'),
  role: yup.string().required('Please enter email'),
  city: yup.string().required('Please enter email'),
  address: yup.string().required('Please enter email')
})

const MyProfilePage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { user } = useAuth()
  console.log(user)

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

  const handleOnSubmit = (data: TDefaultValue) => {}

  const handleUploadAvatar = (file: File) => {}

  // useEffect(() => {
  //   if (user) {
  //     reset({
  //       email: '',
  //       role: '',
  //       fullName: '',
  //       phoneNumber: '',
  //       city: '',
  //       address: ''
  //     })
  //   }
  // }, [user])

  return (
    <Box>
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
                    <Avatar sx={{ width: 100, height: 100 }}>
                      <CustomIcon icon='gravity-ui:person' fontSize={60} />
                    </Avatar>
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
                      rules={{
                        required: true
                      }}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <CustomTextField
                          onChange={onChange}
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
      </form>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' sx={{ mt: 3, mb: 2 }}>
          {t('Change')}
        </Button>
      </Box>
    </Box>
  )
}

export default MyProfilePage
