// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Switch,
  useTheme
} from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

// ** Store
import { AppDispatch } from 'src/stores'
import { createUsersAsync, editUsersAsync } from 'src/stores/user/actions'

// ** i18next
import { getDetailUsers } from 'src/services/users'

// ** Components
import Spinner from 'src/components/spinner'
import { CustomSelect } from 'src/components/custom-select'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** Configs
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// **
import { getAllRoles } from 'src/services/role'

// ** Utils
import { convertBase64, separationFullName, toFullName } from 'src/utils'

type TDefaultValue = {
  email: string
  password?: string
  role: string
  fullName: string
  phoneNumber: string
  address?: string
  city?: string
  status?: number
}

interface TCreateEditUsers {
  open: boolean
  onClose: () => void
  idUsers: string
}

export const CreateEditUsers = ({ open, onClose, idUsers }: TCreateEditUsers) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [password, setPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [allRole, setAllRole] = useState([])

  const handleClickPassword = () => setPassword(show => !show)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    email: '',
    password: '',
    role: '',
    fullName: '',
    phoneNumber: '',
    city: '',
    address: '',
    status: 1
  }

  const schema = yup.object({
    email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type'),
    password: idUsers
      ? yup.string().nonNullable()
      : yup
          .string()
          .required('Please enter email')
          .matches(PASSWORD_REG, 'the password is contain charact,special character,number'),
    fullName: yup.string().required('Please enter email'),
    phoneNumber: yup.string().required('Please enter email').min(8, 'The number phone is min 8 number'),
    role: yup.string().required('Please enter role'),
    city: yup.string().nonNullable(),
    address: yup.string().nonNullable(),
    status: yup.number().nonNullable()
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: TDefaultValue) => {
    const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language)

    if (!idUsers) {
      dispatch(
        createUsersAsync({
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          email: data.email,
          password: data.password || '',
          role: data.role,
          phoneNumber: data.phoneNumber,
          city: '',
          address: data.address || '',
          avatar: avatar
        })
      )
    } else {
      dispatch(
        editUsersAsync({
          idUsers: idUsers,
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          email: data.email,
          password: data.password || '',
          role: data.role,
          phoneNumber: data.phoneNumber,
          address: data.address || '',
          avatar: avatar,
          city: '',
          status: Number(data.status)
        })
      )
    }
  }

  const fetchDetailUsers = async (idUsers: string) => {
    setLoading(true)
    try {
      const res = await getDetailUsers(idUsers)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          email: data?.email,
          role: data?.role?._id,
          fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
          phoneNumber: data?.phoneNumber,
          city: data?.city,
          address: data?.address,
          status: data.status,
          password: data.password
        })
        setAvatar(data.avatar)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  const fetchAllRole = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllRoles({ params: { limit: -1, page: -1 } })
      const roleArr = response?.data?.roles.map((item: any) => ({
        name: item.name,
        value: item._id
      }))

      setAllRole(roleArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllRole()
  }, [])

  useEffect(() => {
    if (!open || !idUsers) {
      setAvatar('')
      reset({
        email: '',
        role: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        city: '',
        address: ''
      })
    } else if (idUsers) {
      fetchDetailUsers(idUsers)
    }
  }, [open, idUsers])

  return (
    <CustomModal open={open}>
      <>
        {loading && <Spinner />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose}>
            <CustomIcon icon='typcn:delete' />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          <Grid container sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 20 }}>
            <Grid container item md={6} xs={12}>
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
                  {!idUsers && (
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
                              label={t('Password')}
                              inputRef={ref}
                              type={password ? 'text' : 'password'}
                              error={Boolean(errors.password)}
                              helperText={errors.password?.message}
                              InputProps={{
                                endAdornment: (
                                  <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickPassword}
                                    edge='end'
                                  >
                                    {password ? (
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
                    </Grid>
                  )}
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
                                  : theme.palette.customColors.bodyBg
                              }}
                            >
                              {t('role')}
                            </InputLabel>
                            <CustomSelect
                              fullWidth
                              value={value}
                              inputRef={ref}
                              options={allRole}
                              onChange={onChange}
                              error={Boolean(errors.role)}
                              placeholder={t('Enter_your_role')}
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
                  </Grid>
                  {idUsers && (
                    <Grid item md={6} xs={12}>
                      <Box mt={2} sx={{ width: '277px' }}>
                        <Controller
                          control={control}
                          name='status'
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={Boolean(value)}
                                  onChange={() => onChange(Boolean(value) ? 0 : 1)}
                                  value={value}
                                />
                              }
                              label={Boolean(value) ? t('Active') : t('Block')}
                            />
                          )}
                        />
                      </Box>
                    </Grid>
                  )}
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
                            placeholder={t('Enter_your_phone')}
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
                                  : // loi
                                    theme.palette.customColors.bodyBg
                              }}
                            >
                              {t('city')}
                            </InputLabel>
                            <CustomSelect
                              fullWidth
                              onChange={onChange}
                              options={[{ value: '1', label: 'No data' }]}
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
              {idUsers ? t('Update') : t('Create')}
            </Button>
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
