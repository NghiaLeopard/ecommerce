// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, IconButton, Rating, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import { CustomTextArea } from 'src/components/text-area'
import CustomModal from 'src/components/custom-modal'

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
import { createReviewsAsync, editReviewsMeAsync } from 'src/stores/reviews/actions'

// ** Type
import { TReviewsProduct } from 'src/types/reviews'

// ** Utils

type TDefaultValue = {
  star: string
  content: string
}

interface TModalUpdateReviews {
  open: boolean
  onClose: () => void
  item: TReviewsProduct
}

export const ModalUpdateReviews = ({ open, onClose, item }: TModalUpdateReviews) => {
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
      editReviewsMeAsync({
        product: item?.product?._id,
        content: data.content,
        star: +data.star,
        user: item?.user?._id,
        reviewId: item?._id
      })
    )

    onClose()
  }

  useEffect(() => {
    if (item) {
      reset({
        star: String(item?.star),
        content: item?.content
      })
    }
  }, [item])

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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <IconButton onClick={onClose}>
              <CustomIcon icon='typcn:delete' />
            </IconButton>
          </Box>
          <Typography variant='h3' textAlign='center'>
            {t('Review_product')}
          </Typography>

          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box>
              <Box sx={{ width: '350px' }}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Rating
                      defaultValue={0}
                      value={+value}
                      onChange={(e: any) => onChange(e?.target?.value)}
                      ref={ref}
                      onBlur={onBlur}
                      precision={0.5}
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
                      placeholder={t('Enter_content')}
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
                {t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
