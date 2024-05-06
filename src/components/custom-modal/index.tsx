import { Box, IconButton, Modal, ModalProps, styled, useTheme } from '@mui/material'
import CustomIcon from '../Icon'

interface TCustomModal extends ModalProps {
  onClose: () => void
}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => ({
  zIndex: 1300
}))

const CustomModal = ({ open, children, onClose }: TCustomModal) => {
  const theme = useTheme()

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
            <Box>
              <Box
                sx={{
                  margin: '40px 0',
                  backgroundColor: `${theme.palette.background.paper} !important`
                }}
              >
                <IconButton>
                  <CustomIcon icon='typcn:delete' onClick={onClose} />
                </IconButton>
                {children}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModal>
  )
}

export default CustomModal
