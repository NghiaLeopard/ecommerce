// ** React
import { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, IconButton, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import { GridMoreVertIcon } from '@mui/x-data-grid'

// ** Component
import CustomIcon from 'src/components/Icon'
import { Badge } from '@mui/material'
import { useDispatch } from 'react-redux'
import { deleteNotificationAsync, markReadNotificationAsync } from 'src/stores/notification/actions'
import { AppDispatch } from 'src/stores'
import { formatDate } from 'src/utils'

type TNotification = {
  body: string
  context: string
  createdAt: string
  referenceId: string
  title: string
  _id: string
}

type TMessageNotification = {
  data: TNotification
}

export const MessageNotification = ({ data }: TMessageNotification) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Translation
  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkRead = () => {
    dispatch(markReadNotificationAsync(data?._id))
  }

  const handleDeleteNotification = () => {
    dispatch(deleteNotificationAsync(data?._id))
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ maxWidth: '210px' }}>
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t(`${data.title}`)}</Typography>
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.body}</Typography>
        <Typography>{formatDate(data?.createdAt)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
        <Badge color='error' badgeContent=' ' variant='dot' sx={{ mr: 2 }} />
        <Typography>{t('Unread')}</Typography>
        <IconButton aria-label='more' id='long-button' aria-haspopup='true' onClick={handleClick}>
          <GridMoreVertIcon />
        </IconButton>
      </Box>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{}}
      >
        <MenuItem onClick={handleMarkRead}>
          <CustomIcon icon='material-symbols-light:mark-email-read' />
          <Typography ml={2}>{t('Mark_read')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleDeleteNotification}>
          <CustomIcon icon='mingcute:notification-off-fill' />
          <Typography ml={2}>{t('Delete')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
