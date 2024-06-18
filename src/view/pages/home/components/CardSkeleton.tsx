// ** MUI
import { Box, Card, Skeleton } from '@mui/material'

export default function CardSkeleton() {
  return (
    <Card sx={{ maxWidth: '100%' }}>
      <Skeleton variant='rectangular' sx={{ height: '194px' }} />

      <Box sx={{ padding: '15px 15px !important' }}>
        <Skeleton height='80px' />
        <Skeleton animation='wave' height={72} />
        <Skeleton animation='wave' height={50} />
        <Skeleton animation='wave' height={50} />
      </Box>
    </Card>
  )
}
