// ** Mui
import { IconButton, Tooltip, useTheme } from '@mui/material'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Custom
import CustomIcon from '../Icon'

interface TGridCreate {
  onClick: () => void
}

const CustomGridCreate = ({ onClick }: TGridCreate) => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Tooltip title='Create'>
      <IconButton
        onClick={onClick}
        sx={{
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: theme.palette.common.white
        }}
      >
        <CustomIcon icon='ph:plus-bold' />
      </IconButton>
    </Tooltip>
  )
}

export default CustomGridCreate
