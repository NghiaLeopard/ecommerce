// ** Mui
import { Box, BoxProps, FormHelperText, InputLabel, styled, useTheme, TextareaAutosizeProps } from '@mui/material'
import * as React from 'react'
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize'

// ** React
import { useTranslation } from 'react-i18next'

interface TTextAreaAutoSize extends TextareaAutosizeProps {
  error?: boolean
}

interface TCustomTextArea extends TextareaAutosizeProps {
  error?: boolean
  helperText: string | undefined
  placeholder: string
  label: string
}

const Textarea = styled(BaseTextareaAutosize)<TTextAreaAutoSize>(
  ({ theme, error }) => `
box-sizing: border-box;
width: 100%;
font-family: "Myriad Pro", sans-serif;
font-size: 0.8125rem;
padding: 8px 10px;
border-radius: 8px;
background: transparent;
border: ${error ? `1px solid ${theme.palette.error.main}` : `1px solid rgba(${theme.palette.customColors.main},0.2)`};

&:hover {
  border-color: ${theme.palette.customColors.main};
}

&:focus {
  border-color: ${theme.palette.primary.main};
  box-shadow: 0 0 0 3px ${theme.shadows[2]};
}

&:focus-visible {
  outline: 0;
}

&::placeholder {
color: ${error && theme.palette.error.main}
}
`
)

export const CustomTextArea = (props: TCustomTextArea) => {
  const { label, helperText, error, placeholder, ...rest } = props
  const { t } = useTranslation()
  const theme = useTheme()
  console.log(error)

  return (
    <Box sx={{ position: 'relative', mt: '30px' }}>
      <InputLabel
        sx={{
          fontSize: '13px',
          position: 'absolute',
          top: '-20px'
        }}
      >
        {t(`${label}`)}
      </InputLabel>
      <Textarea aria-label='minimum height' minRows={3} placeholder={placeholder} error={error} {...rest} />
      {error && (
        <FormHelperText
          sx={{
            position: 'absolute',
            color: `${theme.palette.error.main} !important`,
            top: '65px',
            left: '5px',
            fontSize: '0.8125rem'
          }}
        >
          {t(`${helperText}`)}
        </FormHelperText>
      )}
    </Box>
  )
}
