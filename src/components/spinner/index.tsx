// ** MUI Imports
import { Modal, ModalProps, Typography } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import * as React from 'react'
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress'

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  '&.MuiModal-root': {
    width: '100%',
    height: '100%',
    zIndex: 2001,
    '.MuiModal-backdrop': {
      backgroundColor: `rgba(${theme.palette.customColors.main},0.4)`
    }
  }
}))

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant='determinate' {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant='caption' component='div' color='primary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <StyledModal open={true} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          ...sx
        }}
      >
        <CircularProgressWithLabel value={progress} />
      </Box>
    </StyledModal>
  )
}

export default Spinner
