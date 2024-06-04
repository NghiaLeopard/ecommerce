// ** Mui
import { InputBase, alpha, styled } from '@mui/material'

// ** Custom
import CustomIcon from '../Icon'
import { useDebounce } from 'src/hooks/useDebounce'
import { useEffect, useState } from 'react'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  marginLeft: '0px !important',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  height: '38px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  },
  border: `1px solid ${theme.palette.customColors.borderColor}`
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  height: '100%',
  width: '100%',
  '& .MuiInputBase-input': {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

interface TInputSearch {
  onChange: (value: string) => void
}

const InputSearch = ({ onChange }: TInputSearch) => {
  const [valueSearch, setValueSearch] = useState('')
  const valueDebounce = useDebounce(valueSearch, 500)

  useEffect(() => {
    onChange(valueDebounce)
  }, [valueDebounce])

  const handleChange = (value: string) => {
    setValueSearch(value)
  }

  return (
    <Search>
      <SearchIconWrapper>
        <CustomIcon icon='wpf:search' />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder=' Search…'
        inputProps={{ 'aria-label': 'search' }}
        onChange={e => {
          handleChange(e.target.value)
        }}
      />
    </Search>
  )
}

export default InputSearch
