// ** React
import * as React from 'react'

// ** Mui
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CustomIcon from '../Icon'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface TConfirmDialog {
  handleConfirm: () => void
  onClose: () => void
  open: boolean
  title: string
  content: string
}

const CustomConfirmDialog = ({ handleConfirm, onClose, open, title, content }: TConfirmDialog) => {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Dialog open={open} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
          <CustomIcon icon='carbon:warning' fontSize='130px' color={theme.palette.warning.main} />
        </Box>
        <DialogTitle variant='h3'>{t(`${title}`)}</DialogTitle>
        <DialogContentText textAlign='center'>{t(`${content}`)}</DialogContentText>

        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 4 }}>
          <Button onClick={handleConfirm} variant='contained'>
            Delete
          </Button>
          <Button onClick={onClose} variant='outlined' color='error'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default CustomConfirmDialog
