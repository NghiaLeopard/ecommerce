// ** MUI
import { Box, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { TProduct } from 'src/types/products'

// ** Utils

type TCardPopularProduct = {
  listData: TProduct[]
}

const CardPopularProduct = ({ listData }: TCardPopularProduct) => {
  // ** Theme
  const theme = useTheme()

  //   ** Translation
  const { t } = useTranslation()

  return (
    <>
      <Box
        sx={{
          padding: '20px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '15px',
          height: '100%',
          width: '100%'
        }}
      >
        <Typography fontWeight='bold'>{t('Popular_products')}</Typography>
        {listData?.map((item: TProduct) => {
          return (
            <Box key={item?._id} sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Box>
                <Image src={item?.image} height={80} width={110} alt='Image product' objectFit='cover' />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography fontWeight='bold'>{item?.name}</Typography>
                <Typography mt={3}>{item?.type?.name}</Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default CardPopularProduct
