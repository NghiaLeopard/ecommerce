// ** Mui
import { IconButton, Tooltip } from '@mui/material'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Custom
import CustomIcon from '../Icon'

interface TGridEdit {
  onClick: () => void
}

const CustomGridEdit = ({ onClick }: TGridEdit) => {
  const { t } = useTranslation()

  return (
    <Tooltip title='Edit'>
      <IconButton onClick={onClick}>
        <CustomIcon icon='iconamoon:edit-bold' />
      </IconButton>
    </Tooltip>
  )
}

export default CustomGridEdit
