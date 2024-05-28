// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
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
import { createProductsAsync, editProductsAsync } from 'src/stores/products/actions'

// ** i18next
import { getDetailProducts } from 'src/services/products'

// ** Components
import Spinner from 'src/components/spinner'
import { CustomSelect } from 'src/components/custom-select'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** Configs
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// **
import { getAllRoles } from 'src/services/role'

// ** Utils
import { convertBase64, separationFullName, stringToSlug, toFullName } from 'src/utils'
import { getAllCity } from 'src/services/city'
import { CustomDatePicker } from 'src/components/custom-date-picker'
import { on } from 'events'

type TDefaultValue = {
  name: string
  city?: string
  status?: number
  image?: string
  type?: string
  countInStock: number
  price: number
  rating?: string
  description: string
  discount: number
  slug: string
  discountStartDate: Date | null
  discountEndDate: Date | null
}

interface TCreateEditProducts {
  open: boolean
  onClose: () => void
  idProducts: string
}

export const CreateEditProducts = ({ open, onClose, idProducts }: TCreateEditProducts) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [password, setPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [allRole, setAllRole] = useState([])
  const [allCity, setAllCity] = useState([])

  const handleClickPassword = () => setPassword(show => !show)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    name: '',
    city: '',
    status: 0,
    image: '',
    type: '',
    countInStock: 0,
    price: 0,
    rating: '',
    description: '',
    discount: 0,
    slug: '',
    discountStartDate: null,
    discountEndDate: null
  }

  const schema = yup.object({
    name: yup.string().required(t('Required_field')),
    slug: yup.string().required(t('Required_field')),
    price: yup.number().required(t('Required_field')),
    countInStock: yup.number().required(t('Required_field')),
    discount: yup.number().required(t('Required_field')),
    discountStartDate: yup.date().notRequired(),
    discountEndDate: yup.date().notRequired(),
    city: yup.string().nonNullable(),
    image: yup.string().nonNullable(),
    description: yup.string().nonNullable(),
    status: yup.number().nonNullable(),
    type: yup.string().nonNullable(),
    rating: yup.string().nonNullable()
  })

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: any) => {
    if (!idProducts) {
      dispatch(
        createProductsAsync({
          name: data.name,
          city: data.city,
          status: data.status,
          image: avatar,
          type: data.type || '',
          countInStock: data.countInStock,
          price: data.price,
          rating: data.rating || '',
          description: data.description,
          discount: data.discount,
          slug: data.slug,
          discountStartDate: data.discountStartDate,
          discountEndDate: data.discountEndDate
        })
      )
    } else {
      dispatch(
        editProductsAsync({
          idProducts: idProducts,
          name: data.name,
          city: data.city,
          status: data.status,
          image: avatar,
          type: data.type || '',
          countInStock: data.countInStock,
          price: data.price,
          rating: data.rating || '',
          description: data.description,
          discount: data.discount,
          slug: data.slug,
          discountStartDate: data.discountStartDate,
          discountEndDate: data.discountEndDate
        })
      )
    }
  }

  const fetchDetailProducts = async (idProducts: string) => {
    setLoading(true)
    try {
      const res = await getDetailProducts(idProducts)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          name: data.name,
          city: data.city,
          status: data.status,
          image: avatar ? avatar : '',
          type: data.type,
          countInStock: data.countInStock,
          price: data.price,
          rating: data.rating,
          description: data.description,
          discount: data.discount,
          slug: data.slug,
          discountStartDate: data.discountStartDate,
          discountEndDate: data.discountEndDate
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
        label: item.name,
        value: item._id
      }))

      setAllRole(roleArr)
    } catch (error) {
      setLoading(false)
    }
  }

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
    fetchAllRole()
  }, [])

  useEffect(() => {
    fetchAllCity()
  }, [])

  useEffect(() => {
    if (!open || !idProducts) {
      setAvatar('')
      reset({
        name: '',
        city: '',
        status: 0,
        image: '',
        type: '',
        countInStock: 0,
        price: 0,
        rating: '',
        description: '',
        discount: 0,
        slug: '',
        discountStartDate: null,
        discountEndDate: null
      })
    } else if (idProducts) {
      fetchDetailProducts(idProducts)
    }
  }, [open, idProducts])

  return (
    <CustomModal open={open}>
      <>
        {loading && <Spinner />}

        <Box
          sx={{
            padding: '20px',
            borderRadius: '15px'
          }}
          minWidth={{ md: '900', xs: '80vw' }}
          maxWidth={{ md: '90vw', xs: '90vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={onClose}>
              <CustomIcon icon='typcn:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Grid
              container
              sx={{
                background: theme.palette.background.paper,
                borderRadius: '15px',
                px: 4,
                py: 20
              }}
            >
              <Grid container item md={6} xs={12}>
                <Box>
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
                    <Grid item md={12} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <CustomTextField
                              onChange={e => {
                                const value = e.target.value
                                const replaced = stringToSlug(value)
                                onChange(value)
                                reset({ ...getValues(), slug: replaced })
                              }}
                              onBlur={onBlur}
                              value={value}
                              fullWidth
                              label={t('Name_product')}
                              placeholder={t('Enter_name_product')}
                              inputRef={ref}
                              error={Boolean(errors.name)}
                              helperText={errors.name?.message}
                            />
                          )}
                          name='name'
                        />
                      </Box>
                    </Grid>

                    <Grid item md={12} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <CustomTextField
                              disabled
                              onBlur={onBlur}
                              value={value}
                              fullWidth
                              label={t('Slug')}
                              placeholder={t('Enter_slug')}
                              inputRef={ref}
                              error={Boolean(errors.slug)}
                              helperText={errors.slug?.message}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                            />
                          )}
                          name='slug'
                        />
                      </Box>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Box mt={2} sx={{ width: '277px' }}>
                        <Controller
                          control={control}
                          name='status'
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <FormControl component='fieldset' variant='standard'>
                              <FormLabel component='legend'>{t('Status')}</FormLabel>
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
                            </FormControl>
                          )}
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
                              label={t('Price')}
                              placeholder={t('Enter_price')}
                              inputRef={ref}
                              error={Boolean(errors.price)}
                              helperText={errors.price?.message}
                            />
                          )}
                          name='price'
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
                              label={t('Count_in_stock')}
                              placeholder={t('Enter_your_count')}
                              inputRef={ref}
                              error={Boolean(errors.countInStock)}
                              helperText={errors.countInStock?.message}
                            />
                          )}
                          name='countInStock'
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
                              label={t('Description')}
                              placeholder={t('Enter_your_description')}
                              inputRef={ref}
                              error={Boolean(errors.description)}
                              helperText={errors.description?.message}
                            />
                          )}
                          name='description'
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
                                  mb: '4px'
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
                    <Grid item md={6} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <CustomDatePicker
                              onChange={(date: Date | null) => {
                                onChange(date)
                              }}
                              onBlur={onBlur}
                              selectedDate={value}
                              error={Boolean(errors.discountStartDate)}
                              label={t('Start_date_discount')}
                              helperText={errors.discountStartDate?.message}
                            />
                          )}
                          name='discountStartDate'
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
                            <CustomDatePicker
                              onChange={onChange}
                              onBlur={onBlur}
                              selectedDate={value}
                              error={Boolean(errors.discountEndDate)}
                              label={t('End_date_discount')}
                              helperText={errors.discountEndDate?.message}
                            />
                          )}
                          name='discountEndDate'
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idProducts ? t('Update') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
