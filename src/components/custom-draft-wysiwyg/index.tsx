import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ReactDraftWysiwyg from './react-draft-wysiwyg'
import { Box, BoxProps, FormHelperText, InputLabel, styled, useTheme } from '@mui/material'
import { EditorProps } from 'react-draft-wysiwyg'
import { useTranslation } from 'react-i18next'

interface TBoxProps extends BoxProps {
  error?: boolean
}

interface TCustomDraft extends EditorProps {
  error?: boolean
  helperText: string | undefined
  label: string
}
const StyledBox = styled(Box)<TBoxProps>(({ theme, error }) => ({
  borderRadius: 8,
  backgroundColor: 'transparent !important',
  border: error ? `1px solid ${theme.palette.error.main}` : `1px solid rgba(${theme.palette.customColors.main},0.2)`,
  '.rdw-editor-toolbar': {
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    borderBottom: 'none'
  },

  '.editorClassName.rdw-editor-main': {
    borderTop: `1px solid rgba(${theme.palette.customColors.main},0.2)`,
    minHeight: '140px',
    maxHeight: '140px',
    padding: '5px',

    // description write long then need overflow: auto
    overflow: 'auto'
  }
}))

export const CustomDraftWysiwyg = (props: TCustomDraft) => {
  const { editorState, onEditorStateChange, label, helperText, error, ...rest } = props
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box sx={{ position: 'relative' }}>
      <InputLabel
        sx={{
          fontSize: '13px',
          position: 'absolute',
          top: '-20px'
        }}
      >
        {t(`${label}`)}
      </InputLabel>
      <StyledBox error={error}>
        <ReactDraftWysiwyg
          editorState={editorState}
          toolbarClassName='toolbarClassName'
          wrapperClassName='wrapperClassName'
          editorClassName='editorClassName'
          onEditorStateChange={onEditorStateChange}
          {...rest}
        />
      </StyledBox>
      {error && (
        <FormHelperText
          sx={{
            position: 'absolute',
            color: `${theme.palette.error.main} !important`,
            top: '280px',
            fontSize: '0.8125rem'
          }}
        >
          {t(`${helperText}`)}
        </FormHelperText>
      )}
    </Box>
  )
}
