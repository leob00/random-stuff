'use client'

import { Box, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { ChatBotMessage } from 'lib/backend/ai/models'
import { useChatbotHistoryController } from './chatBotHistoryController'
import ChatBotListItem from './ChatBotListItem'

const ChatBotHistoryTable = ({ data }: { data: ChatBotMessage[] }) => {
  return (
    <>
      <>
        {data.map((item, index) => (
          <Box key={item.promptHash}>
            <ChatBotListItem item={item} />
            {index < data.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </>
    </>
  )
}

export default ChatBotHistoryTable
