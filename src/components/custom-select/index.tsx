// ** Mui
import { Box, InputLabel, InputLabelProps, MenuItemProps, SelectProps, styled } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

type TCustomSelect = SelectProps & {
  value: any
  options: { name: string; value: string; id: number }[]
  onChange: () => void
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  marginTop: '-3px',

  '& .MuiSelect-select': {
    marginTop: '3px',
    padding: '8px 10px 8px 10px !important',
    height: '1.2rem'
  },
  '& legend': {
    display: 'none'
  },
  '.MuiOutlinedInput-notchedOutline': {
    top: '0px !important'
  }
}))

const StyledMenu = styled(MenuItem)<MenuItemProps>(theme => ({}))

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => ({
  position: 'absolute',
  top: '7px',
  left: '10px',
  color: `rgba(${theme.palette.customColors.main},0.32)`
}))

export const CustomSelect = ({ value, label, onChange, fullWidth, options, placeholder, ...rest }: TCustomSelect) => {
  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <CustomPlaceholder>{placeholder}</CustomPlaceholder>
      <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={onChange} {...rest}>
        {options?.map(item => {
          return (
            <MenuItem key={item.name} value={item.value}>
              {item.name || 'No data'}
            </MenuItem>
          )
        })}
      </StyledSelect>
    </Box>
  )
}
