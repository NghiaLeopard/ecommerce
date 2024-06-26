// ** Next
import Script from 'next/script'

// ** MUI
import { Box, BoxProps, styled } from '@mui/material'

const StyleWrapperChatBox = styled(Box)<BoxProps>(({ theme }) => ({
  'df-messenger': {
    '--df-messenger-bot-message': theme.palette.secondary.main,
    '--df-messenger-button-titlebar-color': theme.palette.primary.main,
    '--df-messenger-chat-background-color': theme.palette.background.default,
    '--df-messenger-font-color': theme.palette.customColors.lightPaperBg,
    '--df-messenger-send-icon': theme.palette.primary.main,
    '--df-messenger-user-message': theme.palette.primary.main,
    '--df-messenger-input-box-color': theme.palette.background.paper,
    '--df-messenger-input-font-color': theme.palette.text.primary,
    '--df-messenger-minimized-chat-close-icon-color': theme.palette.primary.main
  }
}))

const ChatBoxAi = () => {
  return (
    <StyleWrapperChatBox>
      <Script src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'></Script>

      <df-messenger
        intent='WELCOME'
        chat-title='Support'
        agent-id='64474be9-08a3-466b-bf90-5b90b8e8ee5d'
        language-code='en'
      ></df-messenger>
    </StyleWrapperChatBox>
  )
}

export default ChatBoxAi
