import { Box, BoxProps, FormHelperText, InputLabel, styled, useTheme } from '@mui/material'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import CustomIcon from '../Icon'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import zIndex from '@mui/material/styles/zIndex'

interface TCustomDatePicker extends ReactDatePickerProps {
  selectedDate?: Date | null
  error?: boolean
  helperText?: string
  label?: string
}

interface TBox extends BoxProps {
  error?: boolean
}

const StyledBox = styled(Box)<TBox>(({ theme, error }) => ({
  width: '378px',
  borderRadius: 8,
  backgroundColor: 'transparent !important',
  border: error ? `1px solid ${theme.palette.error.main}` : `1px solid rgba(${theme.palette.customColors.main},0.2)`,
  padding: '8px 10px',
  position: 'absolute',

  '.react-datepicker-wrapper': {
    width: '100%'
  },

  '.react-datepicker__header': {
    backgroundColor: theme.palette.customColors.bodyBg,
    '.react-datepicker__day-name': {
      color: `rgba(${theme.palette.customColors.main},0.8)`
    },
    '.react-datepicker__current-month': {
      color: `rgba(${theme.palette.customColors.main},1)`
    }
  },

  '.react-datepicker__input-container': {
    input: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: 'currentColor'
    }
  },
  '.date-picker-icon': {
    position: 'absolute',
    top: '7px',
    right: '10px'
  },
  '.react-datepicker__month': {
    margin: '0',
    padding: '0.4rem',
    backgroundColor: theme.palette.background.paper,
    '.react-datepicker__day--selected': {
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.customColors.lightPaperBg} !important`
    },
    '.react-datepicker__day--keyboard-selected': {
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.customColors.lightPaperBg} !important`
    },
    '.react-datepicker__day--disabled': {
      backgroundColor: `${theme.palette.action.selected} !important`,
      borderRadius: '0.3rem'
    },
    '.react-datepicker__day': {
      color: `rgba(${theme.palette.customColors.main},0.42)`,
      '&:hover': {
        backgroundColor: `rgba(${theme.palette.customColors.main},0.08)`
      }
    }
  }
}))

export const CustomDatePicker = (props: TCustomDatePicker) => {
  const { onChange, selectedDate, label, error, helperText, ...rest } = props
  const inputEl = useRef<any>(null)

  const theme = useTheme()
  const { t } = useTranslation()

  const handleClickCalender = () => {
    if (inputEl.current) {
      inputEl.current.setFocus()
    }
  }

  return (
    <Box sx={{ position: 'relative', mt: '-3px' }}>
      <InputLabel
        sx={{
          fontSize: '13px',
          mb: '2px'
        }}
      >
        {t(`${label}`)}
      </InputLabel>
      <StyledBox error={error}>
        <DatePicker ref={inputEl} selected={selectedDate} onChange={onChange} {...rest} />
        <CustomIcon icon='uiw:date' className='date-picker-icon' onClick={handleClickCalender} />
      </StyledBox>
      {error && (
        <FormHelperText
          sx={{
            position: 'absolute',
            color: `${theme.palette.error.main} !important`,
            top: '63px',
            fontSize: '0.8125rem'
          }}
        >
          {t(`${helperText}`)}
        </FormHelperText>
      )}
    </Box>
  )
}
