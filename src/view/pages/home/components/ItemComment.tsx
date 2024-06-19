// ** MUI
import { Avatar, Box, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomInputComment } from 'src/components/custom-input-comment'

// ** Types
import { TComment } from 'src/types/comments'

// ** Utils
import { toFullName } from 'src/utils'

type TItemComment = {
  item: TComment
}
export const ItemComment = ({ item }: TItemComment) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // State
  const [isVisibleInputComment, setIsVisibleComment] = useState(false)

  const handleCancelReply = () => {
    setIsVisibleComment(false)
    console.log('hah')
  }

  const handleSubmitReply = () => {}

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Avatar />
      <Box width='100%'>
        <Typography fontWeight='bold'>
          {toFullName(item?.user?.lastName, item?.user?.middleName, item?.user?.firstName, i18n.language)}
        </Typography>
        <Typography>{item?.content}</Typography>
        <Typography
          sx={{ ml: 12, my: 2, cursor: 'pointer' }}
          color={theme.palette.primary.main}
          onClick={() => setIsVisibleComment(prev => !prev)}
        >
          {t('Reply')}
        </Typography>
        {isVisibleInputComment && <CustomInputComment onCancel={handleCancelReply} onSubmit={handleSubmitReply} />}
      </Box>
    </Box>
  )
}
