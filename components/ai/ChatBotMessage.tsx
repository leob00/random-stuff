import { Box, Typography } from '@mui/material'
import CopyableText from 'components/Atoms/Text/CopyableText'
import { useChatbotColors } from './aihelper'
import dayjs from 'dayjs'
import { AnthropicChatbotMessage } from 'app/api/ai/anthropic/route'

const ChatBotMessage = ({ msg }: { msg: AnthropicChatbotMessage }) => {
  const { getColor } = useChatbotColors()
  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} gap={2} py={1} color={getColor(msg.role)}>
        <Typography variant='caption'>{msg.role === 'user' ? 'You: ' : msg.role === 'error' ? 'Error' : 'AI: '}</Typography>
        <Typography variant='caption'>{dayjs(msg.timestamp).format('MM/DD/YYYY hh:mm A')}</Typography>
      </Box>
      <Box>
        {msg.content.includes('```') ? (
          <pre>
            <code>{<CopyableText label='' value={msg.content.replaceAll('```', '')} showValue />}</code>
          </pre>
        ) : (
          <Box>
            <CopyableText label='' value={msg.content} showValue labelColor={getColor(msg.role)} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ChatBotMessage
