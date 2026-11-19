import { Box, TextField, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { ChatBotMessage } from 'lib/backend/ai/models'
import { useChatbotHistoryController } from './chatBotHistoryController'
import { ChangeEvent, useState } from 'react'
import MarkdownView from 'components/Atoms/Text/MarkdownView'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { getDynamoItemData } from 'lib/backend/csr/nextApiWrapper'
import TokenUsage from './TokenUsage'

const ChatBotListItem = ({ item, onRefresh }: { item: ChatBotMessage; onRefresh?: () => void }) => {
  const { getAgentChatResponse, saveItem, deleteItem, isProcessing } = useChatbotHistoryController(onRefresh)
  const [selectedItem, setSelectedItem] = useState<ChatBotMessage | undefined>(undefined)
  const [editItem, setEditItem] = useState<ChatBotMessage | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ChatBotMessage | null>(null)

  const handleItemClicked = async (item: ChatBotMessage) => {
    if (selectedItem) {
      setSelectedItem(undefined)
      return
    }
    let result = await getAgentChatResponse(item.conversationId ?? '')

    setSelectedItem(result)
  }
  const handleEditItem = (item: ChatBotMessage) => {
    setEditItem(item)
  }
  const handleSaveItem = () => {
    if (editItem) {
      saveItem(editItem)
      setEditItem(null)
      setItemToDelete(null)
    }
  }
  const handleItemTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editItem) {
      setEditItem({ ...editItem, content: e.currentTarget.value })
    }
  }
  const handleDeleteItem = (item: ChatBotMessage) => {
    setItemToDelete(item)
  }

  return (
    <Box key={item.conversationId}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box flexGrow={1}>
          {!editItem ? (
            <ListHeader
              item={item}
              text={item.content.length > 50 ? `${item.content.substring(0, 47)}...` : item.content}
              onClicked={handleItemClicked}
              fadeIn={false}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ) : (
            <TextField onChange={handleItemTextChange} multiline minRows={3} size='small' value={editItem.content} fullWidth />
          )}
        </Box>
      </Box>
      {!selectedItem && !editItem && (
        <Box pl={2}>
          <Typography variant='caption'>{dayjs(item.timestamp).format('MM/DD/YYYY hh:mm A')}</Typography>
        </Box>
      )}
      {selectedItem && (
        <Box py={2} pl={2}>
          <MarkdownView text={selectedItem.content} />
          {selectedItem.usage && <TokenUsage usage={selectedItem.usage} />}
        </Box>
      )}
      {editItem && (
        <Box display={'flex'} gap={1} justifyContent={'flex-end'} py={1}>
          <SecondaryButton text='cancel' onClick={() => setEditItem(null)} />
          <PrimaryButton text='save' onClick={handleSaveItem} />
        </Box>
      )}
      {itemToDelete && (
        <ConfirmDeleteDialog
          text='Are you sure you want to delete this chat?'
          show={!!itemToDelete}
          onConfirm={() => {
            deleteItem(itemToDelete)
            setItemToDelete(null)
          }}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </Box>
  )
}
export default ChatBotListItem
