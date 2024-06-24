// ** React
import 'chart.js/auto'
import { Bar } from 'react-chartjs-2'

// ** MUI
import { Box, useTheme } from '@mui/material'
import { useMemo } from 'react'

// ** Utils

type TCardRevenueTotal = {
  listRevenueTotal: Record<string, string>[]
}

const CardRevenueTotal = ({ listRevenueTotal }: TCardRevenueTotal) => {
  // ** Theme
  const theme = useTheme()

  const memoValueRevenueTotal = useMemo(() => {
    return listRevenueTotal?.map(item => item.total)
  }, [listRevenueTotal])
  console.log(listRevenueTotal)
  const memoLabelsRevenueTotal = useMemo(() => {
    return listRevenueTotal?.map(item => `${item.month}/${item.year}`)
  }, [listRevenueTotal])

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
            labels: memoLabelsRevenueTotal,
            datasets: [
              {
                label: `Doanh thu`,
                backgroundColor: [
                  `${theme.palette.primary.main}`,
                  `${theme.palette.success.main}`,
                  `${theme.palette.error.main}`,
                  `${theme.palette.warning.main}`,
                  `${theme.palette.info.main}`,
                  `${theme.palette.secondary.main}`
                ],
                data: memoValueRevenueTotal
              }
            ]
          }}
          options={{
            plugins: {
              legend: { display: false },
              title: { display: true, text: `Doanh thu theo từng tháng` }
            }
          }}
        />
      </Box>
    </>
  )
}

export default CardRevenueTotal
