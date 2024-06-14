// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Switch,
  Typography,
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

// ** i18next

// ** Components
import { CustomSelect } from 'src/components/custom-select'
import Spinner from 'src/components/spinner'

// ** Configs

// **
import { getAllCity } from 'src/services/city'

// ** Utils
import { separationFullName } from 'src/utils'
import { getOrderProductsDetail } from 'src/services/order-product'
import { UpdateOrderProductsAsync } from 'src/stores/order-product/actions'
import { TItemOrderCMS } from 'src/types/order-product'

type TDefaultValue = {
  fullName: string
  phoneNumber: string
  address: string
  city: string
  isPaid: number
  isDelivered: number
}

interface TUpdateOrderProduct {
  open: boolean
  onClose: () => void
  orderId: string
}

export const UpdateOrderProduct = ({ open, onClose, orderId }: TUpdateOrderProduct) => {
  // ** Theme
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** State
  const [loading, setLoading] = useState(false)
  const [allCity, setAllCity] = useState([])
  const [orderDetail, setOrderDetail] = useState<TItemOrderCMS>({} as any)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    fullName: '',
    address: '',
    city: '',
    phoneNumber: '',
    isPaid: 0,
    isDelivered: 0
  }

  const schema = yup.object({
    fullName: yup.string().required('Please enter full name'),
    phoneNumber: yup.string().required('Please enter phone number').min(8, 'The number phone is min 8 number'),
    city: yup.string().required(),
    address: yup.string().required(),
    isPaid: yup.number().required(),
    isDelivered: yup.number().required()
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
    console.log(data)
    if (data) {
      dispatch(
        UpdateOrderProductsAsync({
          _id: orderId,
          orderItems: orderDetail?.orderItems,
          shippingAddress: {
            fullName: data?.fullName,
            address: data?.address,
            city: data?.city,
            phone: data?.phoneNumber
          },
          isPaid: Boolean(data.isPaid) ? true : false,
          isDelivered: Boolean(data.isDelivered) ? true : false
        })
      )
    }
  }

  const fetchDetailOrderProduct = async () => {
    setLoading(true)
    try {
      const res = await getOrderProductsDetail(orderId)
      setLoading(false)
      setOrderDetail(res.data)
      console.log(res.data)
      if (res.data) {
        reset({
          fullName: res?.data?.shippingAddress?.fullName,
          phoneNumber: res?.data?.shippingAddress?.phone,
          city: res?.data?.shippingAddress?.city,
          address: res?.data?.shippingAddress?.address,
          isPaid: res?.data?.isPaid ? 1 : 0,
          isDelivered: res?.data?.isDelivered ? 1 : 0
        })
      }
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
    fetchAllCity()
  }, [])

  useEffect(() => {
    if (orderId) {
      fetchDetailOrderProduct()
    }
  }, [open, orderId])

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
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderRadius: '15px',
              px: 4,
              py: 5,
              width: { md: '70vh', sx: '50vh' }
            }}
          >
            <Typography textAlign='center' variant='h3'>
              {t('Update_order_product')}
            </Typography>
            <Grid container>
              <Grid container item md={12} xs={12} mt={{ md: 0, xs: 5 }}>
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
                    <Grid item md={12} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
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
                    <Grid item md={12} xs={12}>
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
                    <Grid item md={12} xs={12}>
                      <Box mt={2}>
                        <Controller
                          control={control}
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
                    <Grid item md={12} xs={12}>
                      <Box>
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
                      <Box mt={2} sx={{ width: '277px' }}>
                        <InputLabel>{t('Paid_status')}</InputLabel>

                        <Controller
                          control={control}
                          name='isPaid'
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
                    <Grid item md={6} xs={12}>
                      <Box mt={2} sx={{ width: '277px' }}>
                        <InputLabel>{t('Delivery_status')}</InputLabel>
                        <Controller
                          control={control}
                          name='isDelivered'
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
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {orderId ? t('Update') : t('Create')}
              </Button>
            </Box>
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
