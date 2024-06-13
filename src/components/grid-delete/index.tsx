// ** Mui
import { IconButton, Tooltip } from '@mui/material'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Custom
import CustomIcon from '../Icon'

interface TGridDelete {
  onClick: () => void
  disabled?: boolean
}

const CustomGridDelete = ({ onClick, disabled }: TGridDelete) => {
  const { t } = useTranslation()

  return (
    <Tooltip title='Delete'>
      <IconButton onClick={onClick} disabled={disabled}>
        <CustomIcon icon='mingcute:delete-2-fill' />
      </IconButton>
    </Tooltip>
  )
}

export default CustomGridDelete
