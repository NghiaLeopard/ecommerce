// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, BoxProps, styled } from '@mui/material'

// ** React
import { ReactNode } from 'react'

type TProps = {
  children: ReactNode
}

const BlankLayoutWrapper = styled(Box)<BoxProps>(() => ({
  height: '100vh'
}))

const BlankLayout: NextPage<TProps> = ({ children }) => {
  return (
    <BlankLayoutWrapper>
      <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>{children}</Box>
    </BlankLayoutWrapper>
  )
}

export default BlankLayout
