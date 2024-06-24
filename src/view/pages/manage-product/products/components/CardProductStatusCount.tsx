// ** MUI
import { Box, Typography, useTheme } from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Other
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TCardProductStatusCount = {
  item: { countUser: number; type: number }
}

export const CardProductStatusCount = ({ item }: TCardProductStatusCount) => {
  // ** Theme
  const theme = useTheme()

  const configUser: Record<number, Record<string, string>> = {
    0: {
      title: 'Product private',
      bgColor: theme.palette.error.main,
      icon: 'material-symbols-light:public-off'
    },
    1: {
      title: 'Product public',
      bgColor: theme.palette.info.main,
      icon: 'ic:round-public'
    },
    2: {
      title: 'Total product status',
      bgColor: theme.palette.primary.main,
      icon: 'ri:product-hunt-line'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexBasis: '33%',
        alignItems: 'center',
        height: '18vh',
        justifyContent: 'space-between',
        padding: '30px',
        borderRadius: '20px',
        backgroundColor: hexToRGBA(configUser?.[item.type].bgColor, 0.8)
      }}
    >
      <Box>
        <Typography sx={{ color: theme.palette.customColors.lightPaperBg, fontSize: '18px' }}>
          {configUser?.[item.type].title}
        </Typography>
        <Typography sx={{ color: theme.palette.customColors.lightPaperBg, fontSize: '23px', fontWeight: 'bold' }}>
          {item.countUser}
        </Typography>
      </Box>
      <Box
        bgcolor={hexToRGBA(theme.palette.customColors.lightPaperBg, 0.8)}
        padding=' 10px 12px'
        borderRadius='10px'
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <CustomIcon icon={configUser[item.type].icon} />
      </Box>
    </Box>
  )
}
