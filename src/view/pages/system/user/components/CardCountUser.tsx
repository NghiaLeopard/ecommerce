// ** MUI
import { Box, Typography, useTheme } from '@mui/material'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Other
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TCardCountUser = {
  item: { countUser: number; type: number }
}

export const CardCountUser = ({ item }: TCardCountUser) => {
  // ** Theme
  const theme = useTheme()

  const configUser: Record<number, Record<string, string>> = {
    1: {
      title: 'Facebook user',
      bgColor: theme.palette.info.main,
      icon: 'logos:facebook'
    },
    2: {
      title: 'Google user',
      bgColor: theme.palette.success.main,
      icon: 'logos:google-icon'
    },
    3: {
      title: 'Gmail user',
      bgColor: theme.palette.warning.main,
      icon: 'logos:google-gmail'
    },
    4: {
      title: 'Total user',
      bgColor: theme.palette.primary.main,
      icon: 'lets-icons:user-fill'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '15vh',
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
        bgcolor={hexToRGBA(theme.palette.customColors.lightPaperBg, 0.2)}
        padding=' 10px 12px'
        borderRadius='10px'
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <CustomIcon icon={configUser[item.type].icon} />
      </Box>
    </Box>
  )
}
