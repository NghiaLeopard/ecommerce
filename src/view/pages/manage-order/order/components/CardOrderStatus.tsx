// ** MUI
import { Box, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Other
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TCardOrderStatus = {
  item: { countUser: number; type: number }
}

export const CardOrderStatus = ({ item }: TCardOrderStatus) => {
  // ** Theme
  const theme = useTheme()

  // Translation
  const { t } = useTranslation()

  const configOrderStatus: Record<number, Record<string, string>> = {
    0: {
      title: 'Wait_payment',
      bgColor: theme.palette.warning.main,
      icon: 'mdi:payment-clock'
    },
    1: {
      title: 'Wait_delivery',
      bgColor: theme.palette.info.main,
      icon: 'icon-park-twotone:delivery'
    },
    2: {
      title: 'Done',
      bgColor: theme.palette.success.main,
      icon: 'marketeq:invoice-dollar-done-left'
    },
    3: {
      title: 'Cancel',
      bgColor: theme.palette.error.main,
      icon: 'carbon:rule-cancelled'
    },
    4: {
      title: 'Total order',
      bgColor: theme.palette.primary.main,
      icon: 'material-symbols:orders-outline'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexBasis: '25%',
        alignItems: 'center',
        height: '15vh',
        justifyContent: 'space-between',
        padding: '30px',
        borderRadius: '20px',
        backgroundColor: hexToRGBA(configOrderStatus?.[item.type].bgColor, 0.8)
      }}
    >
      <Box>
        <Typography sx={{ color: theme.palette.customColors.lightPaperBg, fontSize: '18px' }}>
          {t(`${configOrderStatus?.[item.type].title}`)}
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
        <CustomIcon icon={configOrderStatus[item.type].icon} />
      </Box>
    </Box>
  )
}
