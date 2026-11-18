'use client'

import { Box } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { ChatBotMessage } from 'lib/backend/ai/models'
import ChatBotListItem from './ChatBotListItem'

const ChatBotHistoryTable = ({ data, onRefresh }: { data: ChatBotMessage[]; onRefresh?: () => void }) => {
  return (
    <>
      <>
        {data.map((item, index) => (
          <Box key={item.conversationId}>
            <ChatBotListItem item={item} onRefresh={onRefresh} />
            {index < data.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </>
    </>
  )
}

export default ChatBotHistoryTable
