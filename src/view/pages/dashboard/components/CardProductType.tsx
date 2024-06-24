// ** React
import 'chart.js/auto'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

// ** MUI
import { Box, useTheme } from '@mui/material'

// ** Utils

type TCardProductType = {
  listProductType: Record<string, string>[]
}

const CardProductType = ({ listProductType }: TCardProductType) => {
  // ** Theme
  const theme = useTheme()

  const memoValueProductType = useMemo(() => {
    return listProductType?.map(item => item.total)
  }, [listProductType])

  const memoLabelsProductType = useMemo(() => {
    return listProductType?.map(item => item.typeName)
  }, [listProductType])

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
        <Bar
          data={{
            labels: memoLabelsProductType,
            datasets: [
              {
                label: 'Số lượng',
                backgroundColor: [
                  `${theme.palette.primary.main}`,
                  `${theme.palette.success.main}`,
                  `${theme.palette.error.main}`,
                  `${theme.palette.warning.main}`,
                  `${theme.palette.info.main}`,
                  `${theme.palette.secondary.main}`
                ],
                data: memoValueProductType
              }
            ]
          }}
          options={{
            plugins: {
              legend: { display: false },
              title: { display: true, text: `Số lượng sản phẩm theo từng loại` }
            }
          }}
        />
      </Box>
    </>
  )
}

export default CardProductType
