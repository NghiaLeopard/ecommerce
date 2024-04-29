// ** Mui
import Typography from '@mui/material/Typography'

// ** React
import { ReactNode } from 'react'

// ** Layout
import BlankLayout from 'src/view/layout/BlankLayout'

const Error500 = () => {
  return (
    <Typography variant='h2' sx={{ mb: 1.5 }}>
      Oops, something went wrong!
    </Typography>
  )
}

export default Error500

Error500.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
