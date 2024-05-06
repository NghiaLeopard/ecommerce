// ** Mui
import { IconButton, Tooltip } from '@mui/material'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Custom
import CustomIcon from '../Icon'

interface TGridDelete {}

const CustomGridDelete = ({}: TGridDelete) => {
  const { t } = useTranslation()

  return (
    <Tooltip title='Delete'>
      <IconButton>
        <CustomIcon icon='mingcute:delete-2-fill' />
      </IconButton>
    </Tooltip>
  )
}

export default CustomGridDelete
