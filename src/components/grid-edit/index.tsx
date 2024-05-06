// ** Mui
import { IconButton, Tooltip } from '@mui/material'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Custom
import CustomIcon from '../Icon'

interface TGridEdit {}

const CustomGridEdit = ({}: TGridEdit) => {
  const { t } = useTranslation()

  return (
    <Tooltip title='Edit'>
      <IconButton>
        <CustomIcon icon='iconamoon:edit-bold' />
      </IconButton>
    </Tooltip>
  )
}

export default CustomGridEdit
