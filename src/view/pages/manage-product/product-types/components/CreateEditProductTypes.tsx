// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Redux
import { useDispatch } from 'react-redux'

// ** Store
import { AppDispatch } from 'src/stores'
import { createProductTypesAsync, editProductTypesAsync } from 'src/stores/product-types/actions'

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getDetailProductTypes } from 'src/services/product-types'

// ** Utils
import { stringToSlug } from 'src/utils'

type TDefaultValue = {
  name: string
  slug: string
}

interface TCreateEditProductTypes {
  open: boolean
  onClose: () => void
  idProductTypes: string
}

export const CreateEditProductTypes = ({ open, onClose, idProductTypes }: TCreateEditProductTypes) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    name: '',
    slug: ''
  }

  const schema = yup.object({
    name: yup.string().required(t('Enter_name_delivery_type')),
    slug: yup.string().required(t('Enter_price_delivery_type'))
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

  const handleOnSubmit = (data: TDefaultValue) => {
    if (!idProductTypes) {
      dispatch(
        createProductTypesAsync({
          name: data.name,
          slug: data.slug
        })
      )
    } else {
      dispatch(
        editProductTypesAsync({
          idProductTypes: idProductTypes,
          name: data.name,
          slug: data.slug
        })
      )
    }
  }

  const fetchDetailProductTypes = async (idProductTypes: string) => {
    setLoading(true)
    try {
      const res = await getDetailProductTypes(idProductTypes)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          name: data?.name,
          slug: data?.slug
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idProductTypes) {
      reset({
        name: '',
        slug: ''
      })
    } else if (idProductTypes) {
      fetchDetailProductTypes(idProductTypes)
    }
  }, [open, idProductTypes])

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
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between',mb: 3 }}>
            <Typography variant='h3'>{idProductTypes ? t('Edit_product_type') : t('Create_product_type')}</Typography>
            <IconButton onClick={onClose}>
              <CustomIcon icon='typcn:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box>
              <Box sx={{ width: '350px' }}>
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
                      label={t('Name_product_type')}
                      placeholder={t('Enter_name_product_type')}
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
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idProductTypes ? t('Update') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
