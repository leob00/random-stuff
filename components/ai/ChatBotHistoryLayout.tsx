'use client'
import { Box, Typography } from '@mui/material'
import ChatBotHistoryTable from './ChatBotHistoryTable'
import { useChatbotHistoryController } from './chatBotHistoryController'
import { mutate } from 'swr'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const ChatBotHistoryLayout = () => {
  const onRefresh = () => {
    mutate('chatbot-history')
  }
  const { userPrompts, isProcessing } = useChatbotHistoryController(onRefresh)

  return (
    <Box>
      <Box py={2}>
        {isProcessing && <ComponentLoader />}
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <>
            {userPrompts && userPrompts.length > 0 ? (
              <ChatBotHistoryTable data={userPrompts} onRefresh={onRefresh} />
            ) : (
              <>
                {!isProcessing && (
                  <Box display={'flex'} justifyContent={'center'}>
                    <Typography>chat history is empty...</Typography>
                  </Box>
                )}
              </>
            )}
          </>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatBotHistoryLayout
