// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, MouseEvent, useEffect, useState } from 'react'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'

// ** Mui
import { Badge, Button, Divider, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'

// ** Components
import CustomIcon from '../../../../components/Icon'
import { MessageNotification } from './components/messageNotification'
import Spinner from 'src/components/spinner'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/notification'
import { getAllNotificationAsync, markReadAllNotificationAsync } from 'src/stores/notification/actions'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'

// ** Other
import toast from 'react-hot-toast'
import { CONTEXT_NOTIFICATION } from 'src/configs/permission'

interface TProps {}

type TNotification = {
  body: string
  context: string
  createdAt: string
  referenceId: string
  title: string
  _id: string
}

const NotificationDropdown: NextPage<TProps> = () => {
  // ** Router
  const route = useRouter()

  // ** Translation
  const { t } = useTranslation()

  // ** useAuth
  const { user } = useAuth()

  // ** Theme
  const theme = useTheme()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Dispatch
  const dispatch: AppDispatch = useDispatch()
  const {
    isLoading,
    notification,
    typeError,
    isErrorMarkRead,
    isSuccessMarkRead,
    isMessageMarkRead,
    isSuccessDelete,
    isMessageDelete,
    isErrorDelete,
    isErrorMarkReadAll,
    isMessageMarkReadAll,
    isSuccessMarkReadAll
  } = useSelector((state: RootState) => state.notification)

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkReadAll = () => {
    dispatch(markReadAllNotificationAsync())
  }

  const handleClickItemNotification = (data: TNotification) => {
    route.push(`/${(CONTEXT_NOTIFICATION as any)?.[data?.context]}/${data?.referenceId}`)
  }

  useEffect(() => {
    dispatch(
      getAllNotificationAsync({
        params: {
          limit: -1,
          page: -1
        }
      })
    )
  }, [])

  useEffect(() => {
    if (isMessageMarkRead) {
      if (isSuccessMarkRead) {
        toast.success(t('Marked_notification_success'))
        dispatch(resetInitialState())
        dispatch(
          getAllNotificationAsync({
            params: {
              limit: -1,
              page: -1
            }
          })
        )
      } else if (isErrorMarkRead) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Marked_notification_failed'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorMarkRead, isSuccessMarkRead])

  useEffect(() => {
    if (isMessageDelete) {
      if (isSuccessDelete) {
        toast.success(t('Delete_notification_success'))
        dispatch(resetInitialState())
        dispatch(
          getAllNotificationAsync({
            params: {
              limit: -1,
              page: -1
            }
          })
        )
      } else if (isErrorDelete) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Delete_notification_failed'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorDelete, isSuccessDelete])

  useEffect(() => {
    if (isMessageMarkReadAll) {
      if (isSuccessMarkReadAll) {
        toast.success(t('Marked_all_notification_success'))
        dispatch(resetInitialState())
        dispatch(
          getAllNotificationAsync({
            params: {
              limit: -1,
              page: -1
            }
          })
        )
      } else if (isErrorMarkReadAll) {
        const errorConfig = OBJECT_TYPE_ERROR_MAP[typeError]
        if (errorConfig) {
          toast.error(t(`${errorConfig}`))
        } else {
          toast.error(t('Marked_all_notification_failed'))
        }
        dispatch(resetInitialState())
      }
    }
  }, [isErrorMarkReadAll, isSuccessMarkReadAll])

  return (
    <Fragment>
      {isLoading && <Spinner />}
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Cart')}>
          {user?._id ? (
            <IconButton onClick={handleClick}>
              <Badge color='primary' badgeContent={notification?.total}>
                <CustomIcon icon='mdi:bell' />
              </Badge>
            </IconButton>
          ) : (
            <Box sx={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
              <CustomIcon icon='mdi:bell' />
            </Box>
          )}
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            maxHeight: '400px',
            maxWidth: '420px',
            overflow: 'visible  ',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}>
          <Typography fontSize='22px' mt={2}>
            {t('Notifications')}
          </Typography>
          <Box sx={{ display: 'flex', justifyItems: 'center', gap: 3 }}>
            <Box
              sx={{
                padding: '3px 15px',
                bgcolor: theme.palette.primary.main,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography color={theme.palette.customColors.lightPaperBg}>{notification?.total} new</Typography>
            </Box>
            <CustomIcon icon='solar:letter-bold' color={theme.palette.primary.main} fontSize='28px' />
          </Box>
        </Box>
        <Divider sx={{ width: '100%' }} />

        <Box sx={{ maxHeight: '270px', overflowY: 'scroll', overflowX: 'hidden' }}>
          {notification?.data?.map((item: TNotification) => {
            return (
              <>
                <Divider sx={{ width: '100%' }} />
                <MenuItem key={item?.title} sx={{ width: '100%' }} onClick={() => handleClickItemNotification(item)}>
                  <MessageNotification data={item} />
                </MenuItem>
              </>
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ width: '100%' }} />
          <Button variant='contained' sx={{ margin: '10px 20px 5px' }} onClick={handleMarkReadAll}>
            {t('Mark_read_all_notification')}
          </Button>
        </Box>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
