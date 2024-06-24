// ** React
import { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Box, useTheme } from '@mui/material'

// ** Config
import { OBJECT_TYPE_USER } from 'src/configs/user'

// ** Utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TCardUserType = {
  item: Record<number, number>
}

export const CardUserType = ({ item }: TCardUserType) => {
  // ** Theme
  const theme = useTheme()

  //   ** Translation
  const { t } = useTranslation()

  console.log(item)

  const objectTypeUser: Record<string, Record<string, any>> = OBJECT_TYPE_USER()

  const memoLabelStatusOrder = useMemo(() => {
    if (objectTypeUser && item) {
      return Object?.keys(item).map((key: any) => t(`${objectTypeUser[`${key - 1}`]?.label}`))
    }
  }, [item, objectTypeUser])

  const memoValueStatusOrder = useMemo(() => {
    if (objectTypeUser && item) {
      return Object?.values(item)
    }
  }, [item, objectTypeUser])

  const data = {
    labels: memoLabelStatusOrder,
    datasets: [
      {
        label: '# of user type',
        data: memoValueStatusOrder,
        backgroundColor: [
          hexToRGBA(theme.palette.error.main, 0.6),
          hexToRGBA(theme.palette.primary.main, 0.6),
          hexToRGBA(theme.palette.info.main, 0.6),
          hexToRGBA(theme.palette.success.main, 0.6),
          hexToRGBA(theme.palette.secondary.main, 0.2),
          hexToRGBA(theme.palette.warning.main, 0.6)
        ],
        borderColor: [
          theme.palette.error.main,
          theme.palette.primary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.secondary.main,
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
            title: { display: true, text: t('Count_user_by_status') }
          }
        }}
      />
    </Box>
  )
}
