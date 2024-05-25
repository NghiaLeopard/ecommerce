// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, Grid, IconButton, useTheme } from '@mui/material'

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
import { createCityAsync, editCityAsync } from 'src/stores/city/actions'

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getAllCity } from 'src/services/city'
import { getDetailCity } from 'src/services/city'

// ** Utils
import { convertBase64 } from 'src/utils'

type TDefaultValue = {
  name: string
}

interface TCreateEditCity {
  open: boolean
  onClose: () => void
  idCity: string
}

export const CreateEditCity = ({ open, onClose, idCity }: TCreateEditCity) => {
  // ** Hook
  const theme = useTheme()

  const { t, i18n } = useTranslation()

  const [loading, setLoading] = useState(false)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    name: ''
  }

  const schema = yup.object({
    name: yup.string().required(t('Please_enter_name'))
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
    if (!idCity) {
      dispatch(
        createCityAsync({
          name: data.name
        })
      )
    } else {
      dispatch(
        editCityAsync({
          idCity: idCity,
          name: data.name
        })
      )
    }
  }

  const fetchDetailCity = async (idCity: string) => {
    setLoading(true)
    try {
      const res = await getDetailCity(idCity)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          name: data?.name
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idCity) {
      reset({
        name: ''
      })
    } else if (idCity) {
      fetchDetailCity(idCity)
    }
  }, [open, idCity])

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
                    label={t('Name_city')}
                    placeholder={t('Enter_your_city')}
                    inputRef={ref}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
                name='name'
              />
            </Box>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
              {idCity ? t('Update') : t('Create')}
            </Button>
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
