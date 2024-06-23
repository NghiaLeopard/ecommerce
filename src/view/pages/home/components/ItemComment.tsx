// ** Next
import { useRouter } from 'next/router'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'
import { CustomInputComment } from 'src/components/custom-input-comment'

// ** Types
import { TComment } from 'src/types/comments'

// ** Utils
import { toFullName } from 'src/utils'

// ** Stores
import { AppDispatch, RootState } from 'src/stores'
import { createCommentsReplyAsync, deleteCommentsMeAsync, editCommentsMeAsync } from 'src/stores/comment/actions'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'
import CustomConfirmDialog from 'src/components/custom-confirm-dialog'

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

  // ** Redux
  const dispatch: AppDispatch = useDispatch()
  const { isSuccessDeleteMe, isSuccessUpdateMe } = useSelector((state: RootState) => state.comments)

  // State
  const [isVisibleInputComment, setIsVisibleComment] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [openDeleteComments, setOpenDeleteComments] = useState(false)

  const handleOnCloseDeleteComments = () => {
    setOpenDeleteComments(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCancelReply = () => {
    setIsVisibleComment(false)
    setIsEdit(false)
  }

  const handleSubmitReply = (data: { content: string }) => {
    if (user) {
      if (data?.content) {
        dispatch(
          createCommentsReplyAsync({
            content: data?.content,
            parent: item?.parent ? item?.parent : item?._id,
            product: item?.product?.id,
            user: user?._id
          })
        )
      }
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

  const handleDeleteComment = () => {
    dispatch(deleteCommentsMeAsync(item?._id))
  }

  const handleEditComment = (data: { content: string }) => {
    if (data?.content) {
      dispatch(
        editCommentsMeAsync({
          content: data?.content,
          user: item?.user?.id,
          product: item?.product?.id,
          commentId: item?._id
        })
      )
    }
  }

  useEffect(() => {
    if (isSuccessDeleteMe) {
      setAnchorEl(null)
    }
  }, [isSuccessDeleteMe])

  useEffect(() => {
    if (isSuccessUpdateMe) {
      setAnchorEl(null)
      handleCancelReply()
    }
  }, [isSuccessUpdateMe])

  return (
    <>
      <CustomConfirmDialog
        title={t('Title_delete_comment')}
        content={t('Confirm_delete_comment')}
        onClose={handleOnCloseDeleteComments}
        open={openDeleteComments}
        handleConfirm={() => {
          handleDeleteComment()
          handleOnCloseDeleteComments()
        }}
      />

      <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
        <Avatar src={item?.user?.avatar} alt='image avatar' />
        <Box width='100%'>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box width='100%'>
              <Typography fontWeight='bold'>
                {toFullName(item?.user?.lastName, item?.user?.middleName, item?.user?.firstName, i18n.language)}
              </Typography>
              {isEdit ? (
                <CustomInputComment
                  contentFather={item?.content}
                  isEdit={isEdit}
                  onSubmit={handleEditComment}
                  onCancel={handleCancelReply}
                />
              ) : (
                <Typography>{item?.content}</Typography>
              )}
            </Box>
            {item?.user?.id === user?._id && (
              <IconButton onClick={handleClick}>
                <CustomIcon icon='mage:dots' />
              </IconButton>
            )}
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem
                onClick={() => {
                  setIsEdit(true), setAnchorEl(null)
                }}
              >
                <CustomIcon icon='carbon:edit' />
                <Typography ml={2}>{t('Edit')}</Typography>
              </MenuItem>
              <MenuItem onClick={() => setOpenDeleteComments(true)}>
                <CustomIcon icon='fluent:comment-dismiss-24-regular' />
                <Typography ml={2}>{t('Delete')}</Typography>
              </MenuItem>
            </Menu>
          </Box>
          {!isEdit && (
            <Box sx={{ ml: 8, mb: 2 }}>
              <Button
                sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                onClick={() => setIsVisibleComment(prev => !prev)}
              >
                {t('Reply')}
              </Button>
            </Box>
          )}
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
    </>
  )
}
