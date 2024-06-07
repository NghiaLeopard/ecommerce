// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Redux
import { useDispatch } from 'react-redux'

// ** Store
import { AppDispatch } from 'src/stores'
import { createDeliveryTypeAsync, editDeliveryTypeAsync } from 'src/stores/delivery-type/actions'

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getAllDeliveryType, getDetailDeliveryType } from 'src/services/delivery-type'

type TDefaultValue = {
  name: string
  price: string
}

interface TCreateEditDeliveryType {
  open: boolean
  onClose: () => void
  idDeliveryType: string
}

export const CreateEditDeliveryType = ({ open, onClose, idDeliveryType }: TCreateEditDeliveryType) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** State
  const [loading, setLoading] = useState(false)

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    name: '',
    price: ''
  }

  const schema = yup.object({
    name: yup.string().required(t('Enter_name_delivery_type')),
    price: yup
      .string()
      .required(t('Enter_price_delivery_type'))
      .test('Price delivery', 'Price delivery is at the least 1000', value => {
        if (Number(value) >= 1000) {
          return true
        }

        return false
      })
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
    if (!idDeliveryType) {
      dispatch(
        createDeliveryTypeAsync({
          name: data.name,
          price: Number(data.price)
        })
      )
    } else {
      dispatch(
        editDeliveryTypeAsync({
          idDeliveryType: idDeliveryType,
          name: data.name,
          price: Number(data.price)
        })
      )
    }
  }

  const fetchDetailDeliveryType = async (idDeliveryType: string) => {
    setLoading(true)
    try {
      const res = await getDetailDeliveryType(idDeliveryType)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          name: data?.name,
          price: data?.price
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idDeliveryType) {
      reset({
        name: '',
        price: ''
      })
    } else if (idDeliveryType) {
      fetchDetailDeliveryType(idDeliveryType)
    }
  }, [open, idDeliveryType])

  return (
    <CustomModal open={open}>
      <>
        {loading && <Spinner />}

        <Box
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`,
            borderRadius: '15px',
            padding: '30px'
          }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '50vw', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 3 }}>
            <Typography variant='h3'>{idDeliveryType ? t('Edit_delivery_type') : t('Create_delivery_type')}</Typography>
            <IconButton onClick={onClose}>
              <CustomIcon icon='typcn:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CustomTextField
                      onChange={e => {
                        onChange(e.target.value)
                      }}
                      onBlur={onBlur}
                      value={value}
                      fullWidth
                      label={t('Name_delivery_type')}
                      placeholder={t('  ')}
                      inputRef={ref}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                    />
                  )}
                  name='name'
                />
              </Box>
              <Box mt={2} width='100%'>
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
                      label={t('Price')}
                      placeholder={t('Enter_price_delivery_type')}
                      inputRef={ref}
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message}
                    />
                  )}
                  name='price'
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idDeliveryType ? t('Update') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
