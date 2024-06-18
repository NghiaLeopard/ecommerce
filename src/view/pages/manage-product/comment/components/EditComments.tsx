// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import { CustomTextArea } from 'src/components/text-area'
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Redux
import { useDispatch } from 'react-redux'

// ** Store
import { editCommentsAsync } from 'src/stores/comment/actions'
import { AppDispatch } from 'src/stores'

// ** Components
import Spinner from 'src/components/spinner'

// ** Services
import { getDetailComments } from 'src/services/comments'

// ** Types
import { TComment } from 'src/types/comments'

// ** Utils

type TDefaultValue = {
  content: string
}

interface TEditComments {
  open: boolean
  onClose: () => void
  idComment: string
}

export const EditComments = ({ open, onClose, idComment }: TEditComments) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** state
  const [loading, setLoading] = useState(false)
  const [detailCommentData, setDetailCommentData] = useState<TComment>({} as any)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    content: ''
  }

  const schema = yup.object({
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

  console.log(detailCommentData)

  const handleOnSubmit = (data: TDefaultValue) => {
    dispatch(
      editCommentsAsync({
        commentId: idComment,
        content: data.content,
        product: detailCommentData?.product?.id,
        user: detailCommentData?.user?.id
      })
    )
  }

  const fetchDetailComment = async (idComment: string) => {
    setLoading(true)
    try {
      const res = await getDetailComments(idComment)
      const data = res.data
      setLoading(false)
      setDetailCommentData(data)
      if (data) {
        reset({
          content: data?.content
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !idComment) {
      reset({
        content: ''
      })
    } else if (idComment) {
      fetchDetailComment(idComment)
    }
  }, [open, idComment])

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
            <Typography variant='h3'> {t('Edit_comment')}</Typography>
            <IconButton onClick={onClose}>
              <CustomIcon icon='typcn:delete' />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
            <Box>
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
                {idComment ? t('Update') : t('Create')}
              </Button>
            </Box>
          </form>
        </Box>
      </>
    </CustomModal>
  )
}
