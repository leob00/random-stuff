import { Box, Typography } from '@mui/material'
import ChatBotHistoryLayout from 'components/ai/ChatBotHistoryLayout'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { ChatBotMessage } from 'lib/backend/ai/models'
import { useLocalStore } from 'lib/backend/store/useLocalStore'

const ChatbotHistory = () => {
  return <ChatBotHistoryLayout />
}

export default ChatbotHistory
