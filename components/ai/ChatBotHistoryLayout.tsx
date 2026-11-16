'use client'
import { Box, Typography } from '@mui/material'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ChatBotHistoryTable from './ChatBotHistoryTable'

const ChatBotHistoryLayout = () => {
  const { aiChatHistory } = useLocalStore()
  const userPrompts = aiChatHistory.items.filter((m) => m.role === 'user')

  return (
    <Box>
      <Box py={2}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          {aiChatHistory.items.length > 0 ? (
            <ChatBotHistoryTable data={userPrompts} />
          ) : (
            <>
              <Box display={'flex'} justifyContent={'center'}>
                <Typography>chat history is empty...</Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ChatBotHistoryLayout
