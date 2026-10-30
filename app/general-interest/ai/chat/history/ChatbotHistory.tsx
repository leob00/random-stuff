import { Box, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { ChatBotMessage } from 'lib/backend/ai/models'
import { useLocalStore } from 'lib/backend/store/useLocalStore'

const ChatbotHistory = () => {
  const { aiChatHistory } = useLocalStore()
  const userPrompts = aiChatHistory.items.filter((m) => m.role === 'user')
  const handleItemClicked = (item: ChatBotMessage) => {}
  return (
    <Box py={2}>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {aiChatHistory.items.length > 0 ? (
          <>
            {userPrompts.map((item) => (
              <Box key={item.promptHash}>
                <ListHeader item={item} text={item.content} onClicked={handleItemClicked} />
              </Box>
            ))}
          </>
        ) : (
          <>
            <Box display={'flex'} justifyContent={'center'}>
              <Typography>chat history is empty...</Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default ChatbotHistory
