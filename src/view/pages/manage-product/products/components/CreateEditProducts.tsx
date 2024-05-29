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
import { CustomDatePicker } from 'src/components/custom-date-picker'
import { CustomDraftWysiwyg } from 'src/components/custom-draft-wysiwyg'
import { CustomSelect } from 'src/components/custom-select'
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// ** Service
import { getAllRoles } from 'src/services/role'
import { getAllProductTypes } from 'src/services/product-types'

// ** Utils
import { convertBase64, convertHtmlToDraft, stringToSlug } from 'src/utils'

// ** Draft-js
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

type TDefaultValue = {
  name: string
  status: number
  image?: string
  type: string
  countInStock: string
  price: string
  description: EditorState
  discount: string
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

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [allProductTypes, setAllProductTypes] = useState([])

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    name: '',
    status: 0,
    image: '',
    type: '',
    countInStock: '',
    price: '',
    description: EditorState.createEmpty(),
    discount: '',
    slug: '',
    discountStartDate: null,
    discountEndDate: null
  }

  const schema = yup.object({
    name: yup.string().required(t('Required_field')),
    slug: yup.string().required(t('Required_field')),
    price: yup
      .string()
      .required(t('Required_field'))
      .test('Price', t('least_1000_in_price'), value => {
        return Number(value) >= 1000
      }),
    countInStock: yup
      .string()
      .required(t('Required_field'))
      .test('Count in stock', t('least_1_in_count'), value => {
        return Number(value) >= 1
      }),
    discount: yup
      .string()
      .notRequired()
      .test('Discount', t('least_1_in_discount'), (value, context) => {
        if (value) {
          const discountStartDate = context?.parent.discountStartDate
          const discountEndDate = context?.parent.discountEndDate
          if (!discountStartDate) {
            setError('discountStartDate', { type: 'required_start_discount', message: t('required_start_discount') })
          }
          if (!discountEndDate) {
            setError('discountEndDate', {
              type: 'required_end_discount',
              message: t('required_end_discount')
            })
          }
        } else {
          clearErrors('discountStartDate')
          clearErrors('discountEndDate')
        }

        return !value || Number(value) >= 1
      }),
    discountStartDate: yup
      .date()
      .notRequired()
      .test('required_start_discount', t('required_start_discount'), (value, context) => {
        const discount = context?.parent.discount

        return !discount || (discount && value)
      })
      .test('required_less_start_discount', t('required_than_start_discount'), (value, context) => {
        const discountEndDate = context?.parent.discountEndDate
        if (discountEndDate && value && discountEndDate.getTime() > value.getTime()) {
          clearErrors('discountStartDate')
        }

        return !discountEndDate || (discountEndDate && value && discountEndDate.getTime() > value.getTime())
      }),
    discountEndDate: yup
      .date()
      .notRequired()
      .test('required_end_discount', t('required_end_discount'), (value, context) => {
        const discountStartDate = context?.parent.discountStartDate

        return !discountStartDate || (discountStartDate && value)
      })
      .test('required_less_end_discount', t('required_less_end_discount'), (value, context) => {
        const discountStartDate = context?.parent.discountStartDate

        if (discountStartDate && value && discountStartDate.getTime() < value.getTime()) {
          clearErrors('discountEndDate')
        }

        return !discountStartDate || (discountStartDate && value && discountStartDate.getTime() < value.getTime())
      }),
    type: yup.string().required(t('Required_field')),
    image: yup.string().nonNullable(),
    description: yup.object().required(),
    status: yup.number().required(t('Required_field'))
  })

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: any) => {
    if (!idProducts) {
      dispatch(
        createProductsAsync({
          name: data.name,
          status: data.status,
          image: avatar,
          type: data.type,
          countInStock: data.countInStock,
          price: data.price,
          description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
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
          status: data.status,
          image: avatar,
          type: data.type,
          countInStock: data.countInStock,
          price: data.price,
          description: data.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
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
      console.log(data)
      if (data) {
        reset({
          name: data.name,
          status: data.status,
            type: data.type,
          countInStock: data.countInStock,
          price: data.price,
          description: convertHtmlToDraft(data.description),
          discount: data.discount,
          slug: data.slug,
          discountStartDate: data.discountStartDate,
          discountEndDate: data.discountEndDate
        })
        setAvatar(data.image)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleUploadAvatar = async (file: File) => {
    const base64 = await convertBase64(file)
    setAvatar(base64 as string)
  }

  const fetchAllProductTypes = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllProductTypes({ params: { limit: -1, page: -1 } })
      const productTypesArr = response?.data?.productTypes.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllProductTypes(productTypesArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProductTypes()
  }, [])

  useEffect(() => {
    if (!open || !idProducts) {
      setAvatar('')
      reset({
        name: '',
        status: 0,
        image: '',
        type: '',
        countInStock: '',
        price: '',
        description: '',
        discount: '',
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
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  mb: '4px'
                                }}
                              >
                                {t('Type_product')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                options={allProductTypes}
                                value={value}
                                placeholder={t('Select')}
                                inputRef={ref}
                                error={Boolean(errors.type)}
                              />
                              {Boolean(errors.type) && (
                                <FormHelperText
                                  sx={{
                                    color: `${theme.palette.error.main} !important`
                                  }}
                                >
                                  {t('Select')}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                          name='type'
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
                              label={t('Discount(percent)')}
                              placeholder={t('Enter_discount')}
                              inputRef={ref}
                              error={Boolean(errors.discount)}
                              helperText={errors.discount?.message}
                            />
                          )}
                          name='discount'
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
                              minDate={new Date()}
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
                    <Grid item md={12} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: { onChange, onBlur, value, ref } }) => (
                            <CustomDraftWysiwyg
                              onEditorStateChange={onChange}
                              onBlur={onBlur}
                              editorState={value as EditorState}
                              error={Boolean(errors.description)}
                              label={t('Description')}
                              placeholder={t('Enter_your_description')}
                              helperText={t('Enter_your_description')}
                            />
                          )}
                          name='description'
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
