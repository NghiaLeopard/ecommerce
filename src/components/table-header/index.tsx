// ** MUI Imports
import { Button, IconButton, Typography } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import CustomIcon from '../Icon'

const StyledTableHeader = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  border: `1.8px solid ${theme.palette.primary.main}`,
  padding: '5px 10px',
  width: '100%',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

type TTableHeader = {
  number: number
  onClose: () => void
  actions: { label: string; value: string }[]
  handleActions: (action: string) => void
  disabled?: boolean
}

const TableHeader = (props: TTableHeader) => {
  const { number, onClose, actions, handleActions, disabled } = props

  // ** Hook
  const theme = useTheme()

  const { t } = useTranslation()

  return (
    <StyledTableHeader>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px' }}>
        <Typography>{t('Rows_selected')}</Typography>
        <Typography
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            color: theme.palette.customColors.lightPaperBg,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {number}
        </Typography>
      </Box>
      <Box>
        {actions.map(item => (
          <Button key={item.value} variant='contained' onClick={() => handleActions(item.value)} disabled={disabled}>
            {item.label}
          </Button>
        ))}
        <IconButton onClick={onClose}>
          <CustomIcon icon='typcn:delete' />
        </IconButton>
      </Box>
    </StyledTableHeader>
  )
}

export default TableHeader
