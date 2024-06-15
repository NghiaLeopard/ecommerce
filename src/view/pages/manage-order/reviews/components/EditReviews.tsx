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

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getDetailReviews } from 'src/services/reviews'
import { CustomTextArea } from 'src/components/text-area'
import { editReviewsAsync } from 'src/stores/reviews/actions'

// ** Utils

type TDefaultValue = {
  star: string
  content: string
}

interface TEditReviews {
  open: boolean
  onClose: () => void
  idReviews: string
}

export const EditReviews = ({ open, onClose, idReviews }: TEditReviews) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** state
  const [loading, setLoading] = useState(false)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    star: '',
    content: ''
  }

  const schema = yup.object({
    star: yup.string().required(t('Required_field')),
    content: yup.string().required(t('Required_field'))
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
    dispatch(
      editReviewsAsync({
        reviewId: idReviews,
        content: data.content,
        star: +data.star
      })
    )
  }

  const fetchDetailReviews = async (idReviews: string) => {
    setLoading(true)
    try {
      const res = await getDetailReviews(idReviews)
      const data = res.data
      setLoading(false)
      if (data) {
        reset({
          star: data?.star,
          content: data?.content
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idReviews) {
      reset({
        star: '',
        content: ''
      })
    } else if (idReviews) {
      fetchDetailReviews(idReviews)
    }
  }, [open, idReviews])

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant='h3'>{idReviews ? t('Edit_product_type') : t('Create_product_type')}</Typography>
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
                        onChange(e.target.value)
                      }}
                      onBlur={onBlur}
                      value={value}
                      fullWidth
                      label={t('Star')}
                      placeholder={t('Enter_star')}
                      inputRef={ref}
                      error={Boolean(errors.star)}
                      helperText={errors.star?.message}
                    />
                  )}
                  name='star'
                />
              </Box>
              <Box mt={2} width='350px'>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <CustomTextArea
                      onChange={e => onChange(e.target.value)}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                      placeholder='Enter_content'
                      error={Boolean(errors.content)}
                      helperText={errors.content?.message}
                      label={t('Content')}
                    />
                  )}
                  name='content'
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {idReviews ? t('Update') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
