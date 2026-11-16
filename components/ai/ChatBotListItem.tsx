import { Box, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { ChatBotMessage } from 'lib/backend/ai/models'
import { useChatbotHistoryController } from './chatBotHistoryController'
import React, { useState } from 'react'
import JsonPreview from 'components/Molecules/Forms/Files/JsonPreview'
import JsonView from 'components/Atoms/Boxes/JsonView'
import MarkdownView from 'components/Atoms/Text/MarkdownView'

const ChatBotListItem = ({ item }: { item: ChatBotMessage }) => {
  const { getAgentChatResponse } = useChatbotHistoryController()
  const [selectedItem, setSelectedItem] = useState<ChatBotMessage | undefined>(undefined)

  const handleItemClicked = (item: ChatBotMessage) => {
    if (selectedItem) {
      setSelectedItem(undefined)
      return
    }
    const result = getAgentChatResponse(item.promptHash)
    setSelectedItem(result)
  }
  return (
    <React.Fragment key={item.promptHash}>
      <ListHeader item={item} text={item.content} onClicked={handleItemClicked} fadeIn={false} />
      {!selectedItem && (
        <Box pl={2}>
          <Typography variant='caption'>{dayjs(item.timestamp).format('MM/DD/YYYY hh:mm A')}</Typography>
        </Box>
      )}
      {selectedItem && (
        <Box py={2} pl={2}>
          <MarkdownView text={selectedItem.content} />
        </Box>
      )}
    </React.Fragment>
  )
}
export default ChatBotListItem
