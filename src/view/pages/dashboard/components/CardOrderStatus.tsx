// ** React
import { Pie } from 'react-chartjs-2'

// ** MUI
import { Box, useTheme } from '@mui/material'

// ** Config
import { OBJECT_ACTION_STATUS } from 'src/configs/order'

// ** Utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type TCardOrderStatus = {
  item: Record<number, number>
}

export const CardOrderStatus = ({ item }: TCardOrderStatus) => {
  // ** Theme
  const theme = useTheme()

  //   ** Translation
  const { t } = useTranslation()

  const objectActionStatus = OBJECT_ACTION_STATUS

  const memoLabelStatusOrder = useMemo(() => {
    if (objectActionStatus && item) {
      return Object?.keys(item).map(key => t(`${objectActionStatus[key]?.label}`))
    }
  }, [item, objectActionStatus])

  const memoValueStatusOrder = useMemo(() => {
    if (objectActionStatus && item) {
      return Object?.values(item)
    }
  }, [item, objectActionStatus])

  const data = {
    labels: memoLabelStatusOrder,
    datasets: [
      {
        label: '# of order status',
        data: memoValueStatusOrder,
        backgroundColor: [
          hexToRGBA(theme.palette.primary.main, 0.6),
          hexToRGBA(theme.palette.secondary.main, 0.2),
          hexToRGBA(theme.palette.error.main, 0.6),
          hexToRGBA(theme.palette.success.main, 0.6),
          hexToRGBA(theme.palette.info.main, 0.6),
          hexToRGBA(theme.palette.warning.main, 0.6)
        ],
        borderColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '15px',
        height: '100%',
        width: '100%'
      }}
    >
      <Pie
        data={data}
        options={{
          plugins: {
            legend: { display: true },
            title: { display: true, text: t('Count_order_by_status') }
          }
        }}
      />
    </Box>
  )
}
