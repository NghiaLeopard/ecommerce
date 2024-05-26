// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, FormHelperText, Grid, IconButton, InputLabel, useTheme } from '@mui/material'

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
import { createPaymentTypeAsync, editPaymentTypeAsync } from 'src/stores/payment-type/actions'

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getAllPaymentType, getDetailPaymentType } from 'src/services/payment-type'
import { PAYMENT_TYPES } from 'src/configs/payment'
import { CustomSelect } from 'src/components/custom-select'

type TDefaultValue = {
  name: string
  type: string
}

interface TCreateEditPaymentType {
  open: boolean
  onClose: () => void
  idPaymentType: string
}

export const CreateEditPaymentType = ({ open, onClose, idPaymentType }: TCreateEditPaymentType) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const paymentType = PAYMENT_TYPES()

  const defaultValues: TDefaultValue = {
    name: '',
    type: ''
  }

  const schema = yup.object({
    name: yup.string().required(t('Enter_name_Payment_type')),
    type: yup.string().required(t('Enter_price_Payment_type'))
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
    if (!idPaymentType) {
      dispatch(
        createPaymentTypeAsync({
          name: data.name,
          type: data.type
        })
      )
    } else {
      dispatch(
        editPaymentTypeAsync({
          idPaymentType: idPaymentType,
          name: data.name,
          type: data.type
        })
      )
    }
  }

  console.log(Object.values(paymentType))

  const fetchDetailPaymentType = async (idPaymentType: string) => {
    setLoading(true)
    try {
      const res = await getDetailPaymentType(idPaymentType)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          name: data?.name,
          type: data?.type
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idPaymentType) {
      reset({
        name: '',
        type: ''
      })
    } else if (idPaymentType) {
      fetchDetailPaymentType(idPaymentType)
    }
  }, [open, idPaymentType])

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
              borderRadius: '15px',
              px: 4,
              py: 20,
              background: theme.palette.background.paper
            }}
          >
            <Box sx={{ width: '350px' }}>
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
                    label={t('Name_payment_type')}
                    placeholder={t('Enter_name_payment_type')}
                    inputRef={ref}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
                name='name'
              />
            </Box>
            <Box mt={2} width='350px'>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Box>
                    <InputLabel
                      sx={{
                        fontSize: '13px',
                        mb: '0.25rem',
                        color: Boolean(errors.type) ? theme.palette.error.main : theme.palette.customColors.bodyBg
                      }}
                    >
                      {t('type')}
                    </InputLabel>
                    <CustomSelect
                      fullWidth
                      value={value}
                      inputRef={ref}
                      options={Object.values(paymentType)}
                      onChange={onChange}
                      error={Boolean(errors.type)}
                      placeholder={t('Select_payment_type')}
                    />
                    {Boolean(errors.type) && (
                      <FormHelperText
                        sx={{
                          color: `${theme.palette.error.main} !important`
                        }}
                      >
                        {t('Select_payment_type')}
                      </FormHelperText>
                    )}
                  </Box>
                )}
                name='type'
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
              {idPaymentType ? t('Update') : t('Create')}
            </Button>
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
