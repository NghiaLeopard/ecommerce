// ** React
import { useEffect, useState } from 'react'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  useTheme,
  FormControlLabel,
  Switch
} from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

// ** Store
import { AppDispatch, RootState } from 'src/stores'

// ** i18next
import { getDetailUsers } from 'src/services/users'

// ** Redux
import { createUsersAsync, editUsersAsync } from 'src/stores/user/actions'
import { useTranslation } from 'react-i18next'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { CustomSelect } from 'src/components/custom-select'
import { convertBase64, toFullName } from 'src/utils'
import { getAllRoles } from 'src/services/role'
import { getAuthMe } from 'src/services/auth'
import { EMAIL_REG } from 'src/configs/regex'

// firstName: { type: String },
//     lastName: { type: String },
//     middleName: { type: String },
//     email: { type: String, required: true, unique: true },
//     password: { type: String },
//     role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
//     phoneNumber: { type: String },
//     address: { type: String },
//     avatar: { type: String },
//     city: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "City",
//     },
//     status: {
//       type: Number,
//       default: 1,
//       enum: [0, 1],
//     },

type TDefaultValue = {
  email: string
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

const schema = yup.object({
  email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type'),
  fullName: yup.string().required('Please enter email'),
  phoneNumber: yup.string().required('Please enter email').min(8, 'The number phone is min 8 number'),
  role: yup.string().required('Please enter role'),
  city: yup.string().nonNullable(),
  address: yup.string().nonNullable(),
  status: yup.number().nonNullable()
})

export const CreateEditUsers = ({ open, onClose, idUsers }: TCreateEditUsers) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [allRole, setAllRole] = useState([])

  // ** Redux
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
    address: '',
    status: 1
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

  const handleOnSubmit = (data: TDefaultValue) => {
    if (!idUsers) {
      // dispatch(createUsersAsync({ name: data?.name, permissions: [] }))
    } else {
      // dispatch(editUsersAsync({ name: data?.name, permissions: [], idUsers: idUsers }))
    }
  }

  const fetchDetailUsers = async (idUsers: string) => {
    const res = await getDetailUsers(idUsers)
    const data = res.data
    if (data) {
      reset({
        email: data?.email,
        role: data?.role?._id,
        fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
        phoneNumber: data?.phoneNumber,
        city: data?.city,
        address: data?.address
      })
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  const fetchRole = async () => {
    setLoading(true)
    try {
      setLoading(true)

      const response = await getAllRoles({ params: { limit: -1, page: -1 } })
      const roleArr = response?.data?.roles.map((item: any) => ({
        name: item.name,
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

  useEffect(() => {
    if (!open) {
      reset({
        email: '',
        role: '',
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
                            <span>{t('upload-image')}</span>
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
                            label={t('email')}
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
                              placeholder={t('choose_your_role')}
                            />
                            {Boolean(errors.role) && (
                              <FormHelperText
                                sx={{
                                  color: `${theme.palette.error.main} !important`
                                }}
                              >
                                {t('enter_your_role')}
                              </FormHelperText>
                            )}
                          </Box>
                        )}
                        name='role'
                      />
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Box mt={2}>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label={Boolean(value) ? t('Active') : t('Block')}
                          />
                        )}
                        name='status'
                      />
                    </Box>
                  </Grid>
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
                            label={t('full_name')}
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
                            label={t('phone_number')}
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
                            label={t('address')}
                            placeholder={t('enter_your_address')}
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
                              options={[{ value: '1', name: 'No data', id: 0 }]}
                              value={value}
                              placeholder={t('choose_your_city')}
                              inputRef={ref}
                              error={Boolean(errors.city)}
                            />
                            {Boolean(errors.city) && (
                              <FormHelperText
                                sx={{
                                  color: `${theme.palette.error.main} !important`
                                }}
                              >
                                {t('enter_your_role')}
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
              {t('change')}
            </Button>
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
