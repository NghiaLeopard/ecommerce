// ** Mui
import { Box, InputLabel, InputLabelProps, MenuItemProps, SelectProps, styled } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TCustomSelect = SelectProps & {
  value: any
  options: { label: string; value: string | number }[]
  onChange: (data: any) => void
}

const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  marginTop: '-3px',

  '& .MuiSelect-select': {
    marginTop: '3px',
    padding: '8px 10px 10px 10px !important',
    height: '1.2rem'
  },
  '& legend': {
    display: 'none'
  },
  '.MuiOutlinedInput-notchedOutline': {
    top: '0px !important'
  }
}))

const CustomPlaceholder = styled(InputLabel)<InputLabelProps>(({ theme }) => ({
  position: 'absolute',
  top: '7px',
  left: '10px',
  color: `rgba(${theme.palette.customColors.main},0.32)`
}))

export const CustomSelect = ({ value, label, onChange, fullWidth, options, placeholder, ...rest }: TCustomSelect) => {
  const { t } = useTranslation()

  const handleChange = (event: any) => {
    onChange(event?.target?.value)
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      {(!value || value.length <= 0) && <CustomPlaceholder>{placeholder}</CustomPlaceholder>}
      <StyledSelect fullWidth={fullWidth} value={value} label={label} onChange={handleChange} {...rest}>
        {options?.map(item => {
          return (
            <MenuItem key={item.value} value={item.value}>
              {`${t(item.label)}`}
            </MenuItem>
          )
        })}
      </StyledSelect>
    </Box>
  )
}
