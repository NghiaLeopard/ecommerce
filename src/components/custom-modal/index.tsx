import { Box, Modal, ModalProps, styled, useTheme } from '@mui/material'

interface TCustomModal extends ModalProps {}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  zIndex: 1300
}))

const CustomModal = ({ open, children }: TCustomModal) => {
  return (
    <StyledModal open={open} aria-labelledby='modal-modal-title'>
      <Box sx={{ height: '100%', width: '100vw' }}>
        <Box sx={{ maxHeight: '100vh', overflow: 'auto' }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                margin: '40px 0'
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModal>
  )
}

export default CustomModal
