// ** MUI Imports
import { Modal, ModalProps } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

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

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  return <Box>Table-header</Box>
}

export default Spinner
