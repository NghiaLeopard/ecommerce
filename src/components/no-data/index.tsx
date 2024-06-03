// **Next
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Image
import imageNoData from '/public/svgs/no-data.svg'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type TProps = {
  widthImage: number
  heightImage: number
  textImage: string
}

const NoData = ({ widthImage, heightImage, textImage }: TProps) => {
  // ** Translation
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column !important' }}>
      <Image src={imageNoData} alt='No data' width={0} height={0} style={{ width: widthImage, height: heightImage }} />
      <Typography>{t(`${textImage}`)}</Typography>
    </Box>
  )
}

export default NoData
