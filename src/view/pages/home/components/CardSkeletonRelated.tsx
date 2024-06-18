//** Next
import { useRouter } from 'next/router'

// ** React
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

// ** MUI
import { Box, Rating, useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Types
import { TProduct } from 'src/types/products'

// ** Utils
import { formatPriceToLocal, isExpiry } from 'src/utils'
import { Skeleton } from '@mui/material'

export default function CardSkeletonRelated() {
  return (
    <Card sx={{ maxWidth: '100%', mt: '15px' }}>
      <Skeleton height='194px' width='100%' variant='rectangular' />
      <Box sx={{ padding: '15px 15px !important',mt: 3 }}>
        <Skeleton height='90px' />
        <Skeleton animation='wave' height={50} />
      </Box>
    </Card>
  )
}
