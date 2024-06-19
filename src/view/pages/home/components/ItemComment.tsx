// ** React
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, Button, Typography, useTheme } from '@mui/material'

// ** Component
import { CustomInputComment } from 'src/components/custom-input-comment'

// ** Types
import { TComment } from 'src/types/comments'

// ** Utils
import { toFullName } from 'src/utils'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createCommentsReplyAsync } from 'src/stores/comment/actions'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

type TItemComment = {
  item: TComment
}
export const ItemComment = ({ item }: TItemComment) => {
  // ** Translation
  const { t, i18n } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // ** user
  const { user } = useAuth()

  // ** Router
  const router = useRouter()

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()

  // State
  const [isVisibleInputComment, setIsVisibleComment] = useState(false)

  const handleCancelReply = () => {
    setIsVisibleComment(false)
  }

  const handleSubmitReply = (data: { content: string }) => {
    if (user) {
      dispatch(
        createCommentsReplyAsync({
          content: data?.content,
          parent: item?.parent ? item?.parent : item?._id,
          product: item?.product?.id,
          user: user?._id
        })
      )
    } else {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    }

    setIsVisibleComment(false)
  }

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Avatar src={item?.user?.avatar} />
      <Box width='100%'>
        <Typography fontWeight='bold'>
          {toFullName(item?.user?.lastName, item?.user?.middleName, item?.user?.firstName, i18n.language)}
        </Typography>
        <Typography>{item?.content}</Typography>
        <Box sx={{ ml: 8, mb: 2 }}>
          <Button
            sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
            onClick={() => setIsVisibleComment(prev => !prev)}
          >
            {t('Reply')}
          </Button>

          <Button sx={{ cursor: 'pointer', color: theme.palette.primary.main }}>{t('Delete')}</Button>
          <Button sx={{ cursor: 'pointer', color: theme.palette.primary.main }}>{t('Edit')}</Button>
        </Box>
        {isVisibleInputComment && (
          <Box sx={{ my: 2 }}>
            <CustomInputComment onCancel={handleCancelReply} onSubmit={handleSubmitReply} />
          </Box>
        )}
        {item?.replies?.map((itemReply: TComment) => {
          return <ItemComment key={itemReply._id} item={itemReply} />
        })}
      </Box>
    </Box>
  )
}
