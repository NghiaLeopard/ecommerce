import { Box, Divider, Typography } from '@mui/material'

type TMessageNotification = {
  data: {
    meta: string
    title: string
    subtitle: string
  }
}

export const MessageNotification = ({ data }: TMessageNotification) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Box>
        <Typography>{data.title}</Typography>
        <Typography>{data.subtitle}</Typography>
        <Typography>{data.meta}</Typography>
      </Box>
      <Box>
        <Typography>unread</Typography>
      </Box>
    </Box>
  )
}
