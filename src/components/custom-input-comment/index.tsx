// ** React
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import { Avatar, Box, BoxProps, Button, IconButton, styled } from '@mui/material'

// ** Component
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import CustomIcon from '../Icon'
import CustomTextField from '../text-field'
import { useAuth } from 'src/hooks/useAuth'

const StyleWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  position: 'relative',
  '.epr-main': {
    position: 'absolute',
    top: '68px',
    left: '70px',
    zIndex: 2
  }
}))

type TInputComment = {
  onCancel?: () => void
  onSubmit: (data: { content: string }) => void
  isEdit?: boolean
  contentFather?: string
}

export const CustomInputComment = ({ isEdit, contentFather, onCancel, onSubmit }: TInputComment) => {
  // ** State
  const [isFocus, setIsFocus] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [valueInput, setValueInput] = useState<string>(contentFather || '')

  // ** Translation
  const { t } = useTranslation()

  // ** User
  const { user } = useAuth()

  const handleVisibleEmoji = () => {
    setIsVisible(prev => !prev)
  }

  const handleCancelComment = () => {
    setValueInput('')
    setIsFocus(false)
    if (onCancel) {
      onCancel()
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ content: valueInput })
    }
  }

  return (
    <StyleWrapper mb={isEdit && isFocus ? '15px' : '0px'}>
      <Box sx={{ display: 'flex', width: '100%', gap: 3, alignItems: 'center' }}>
        {!isEdit && <Avatar src={user?.avatar} />}
        <Box width='100%' height='60px'>
          <CustomTextField
            fullWidth
            value={valueInput}
            onChange={e => {
              setValueInput(e.target.value)
            }}
            sx={{
              '.MuiInputBase-root': {
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderRadius: '0px',
                '.MuiInputBase-input': {
                  padding: '2px'
                }
              }
            }}
            onFocus={e => setIsFocus(true)}
          />
          {isFocus && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <IconButton onClick={handleVisibleEmoji}>
                <CustomIcon icon='mdi:emoji' fontSize='35px' />
              </IconButton>
              <Box mt={3} sx={{ display: 'flex', gap: 3 }}>
                <Button variant='outlined' onClick={handleCancelComment}>
                  {t('Cancel')}
                </Button>
                <Button variant='contained' onClick={handleSubmit}>
                  {isEdit ? t('Edit_comment') : t('Comment')}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {isVisible && (
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData, event: MouseEvent) => setValueInput(prev => prev + emoji.emoji)}
        />
      )}
    </StyleWrapper>
  )
}
