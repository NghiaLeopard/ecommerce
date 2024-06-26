// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** React
import { Fragment, MouseEvent, useEffect, useRef, useState } from 'react'

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
import Spinner from 'src/components/spinner'
import CustomIcon from '../../../../components/Icon'
import { MessageNotification } from './components/messageNotification'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Store
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/notification'
import { getAllNotificationAsync, markReadAllNotificationAsync } from 'src/stores/notification/actions'

// ** Config
import { OBJECT_TYPE_ERROR_MAP } from 'src/configs/error'
import { firebaseApp } from 'src/configs/firebase'
import { CONTEXT_NOTIFICATION } from 'src/configs/permission'

// ** Other
import { getMessaging, onMessage } from 'firebase/messaging'
import toast from 'react-hot-toast'

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
  const [limit, setLimit] = useState(10)

  // ** Ref
  const wrapperList = useRef<HTMLDivElement>(null)

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

  const handleOnScroll = () => {
    const divEle = wrapperList.current
    const heightDiv = divEle?.clientHeight || 0
    const heightScroll = divEle?.scrollHeight || 0
    const maxScroll = heightScroll - heightDiv
    const scrollCurrent = divEle?.scrollTop || 0
    if (scrollCurrent >= maxScroll && limit < notification.total) {
      setLimit(prev => prev + 10)
    }
  }

  const getListNotification = () => {
    dispatch(
      getAllNotificationAsync({
        params: {
          limit: limit,
          page: 1
        }
      })
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const messaging = getMessaging(firebaseApp)
      const unsubscribe = onMessage(messaging, payload => {
        getListNotification()
      })

      return () => {
        unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    getListNotification()
  }, [limit])

  useEffect(() => {
    if (isMessageMarkRead) {
      if (isSuccessMarkRead) {
        toast.success(t('Marked_notification_success'))
        dispatch(resetInitialState())
        getListNotification()
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
        getListNotification()
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
        getListNotification()
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
              <Badge color='primary' badgeContent={notification?.totalNew}>
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
              <Typography color={theme.palette.customColors.lightPaperBg}>{notification?.totalNew} new</Typography>
            </Box>
            <CustomIcon icon='solar:letter-bold' color={theme.palette.primary.main} fontSize='28px' />
          </Box>
        </Box>
        <Divider sx={{ width: '100%' }} />

        <Box
          ref={wrapperList}
          onScroll={handleOnScroll}
          sx={{ maxHeight: '270px', overflowY: 'scroll', overflowX: 'hidden' }}
        >
          {notification?.data?.map((item: TNotification) => {
            return (
              <Box key={item?.title}>
                <Divider sx={{ width: '100%' }} />
                <MenuItem sx={{ width: '100%' }} onClick={() => handleClickItemNotification(item)}>
                  <MessageNotification data={item} />
                </MenuItem>
              </Box>
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
