import { RandomStuffDynamoItem } from 'app/serverActions/aws/dynamo/dynamo'
import dayjs from 'dayjs'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { ChatBotConversation, ChatBotMessage } from 'lib/backend/ai/models'
import { DynamoKeys } from 'lib/backend/api/aws/models/apiGatewayModels'
import { deleteRecord, getDynamoItemData, putRandomStuffBatch, putRecord, searchDynamoItemsDataByCategory } from 'lib/backend/csr/nextApiWrapper'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { sortArray } from 'lib/util/collections'
import { getExpirationSecondsFromDate, getUtcNow } from 'lib/util/dateUtil'

export const useChatbotHistoryController = (onRefresh?: () => void) => {
  const mutateKey = 'chatbot-history'
  const { aiChatHistory, addToChatHistory, saveChatHistoryItem, deleteChatHistoryItem } = useLocalStore()
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()

  const externalDataFn = async () => {
    const items = await searchDynamoItemsDataByCategory<ChatBotMessage>(`chatbot-history[${userProfile?.username.toLowerCase()}][user]`)
    return sortArray(items, ['timestamp'], ['desc'])
  }

  const historyKey = userProfile?.username ? mutateKey : null
  const { data, isLoading } = useSwrHelper(historyKey, externalDataFn, { revalidateOnFocus: true })

  const getAgentChatResponse = async (id: string) => {
    const utcNow = getUtcNow()
    let result = aiChatHistory.items
      .filter((i) => dayjs(i.expirationTimestampUtc).isAfter(utcNow))
      .find((m) => m.conversationId === id && m.role === 'assistant')
    if (!result) {
      result = await getDynamoItemData<ChatBotMessage>(`chatbot-history[${userProfile?.username.toLowerCase()}][assistant][${id}]`)
      if (result) {
        addToChatHistory(result)
      }
    }
    return result
  }

  const addConverstation = (item: ChatBotConversation) => {
    const conversationId = crypto.randomUUID()
    item.user.conversationId = conversationId
    item.assistant.conversationId = conversationId
    const utcNow = getUtcNow()
    const expDateUtc = utcNow.add(45, 'days')

    addToChatHistory({ ...item.user, expirationTimestampUtc: expDateUtc.format() })
    addToChatHistory({ ...item.assistant, expirationTimestampUtc: expDateUtc.format() })
    const userPromptKey: DynamoKeys = `chatbot-history[${userProfile?.username.toLowerCase()}][user][${item.user.conversationId}]`
    const assistantPromptKey: DynamoKeys = `chatbot-history[${userProfile?.username.toLowerCase()}][assistant][${item.assistant.conversationId}]`
    const records: RandomStuffDynamoItem[] = [
      {
        data: item.user,
        key: userPromptKey,
        category: `chatbot-history[${userProfile?.username.toLowerCase()}][user]`,
        expiration: getExpirationSecondsFromDate(expDateUtc),
        format: 'json',
        last_modified: utcNow.format(),
        count: 1,
      },
      {
        data: item.assistant,
        key: assistantPromptKey,
        category: `chatbot-history[${userProfile?.username.toLowerCase()}][assistant]`,
        expiration: getExpirationSecondsFromDate(expDateUtc),
        format: 'json',
        last_modified: utcNow.format(),
        count: 1,
      },
    ]
    putRandomStuffBatch(records)
  }
  const saveItem = (item: ChatBotMessage) => {
    const utcNow = getUtcNow()
    const existingUserPrompt = aiChatHistory.items
      .filter((i) => dayjs(i.expirationTimestampUtc).isAfter(utcNow))
      .find((m) => m.conversationId === item.conversationId && m.role === 'user')

    if (existingUserPrompt) {
      const utcNow = getUtcNow()
      const expDateUtc = utcNow.add(45, 'days')
      const userMessageToSave = { ...existingUserPrompt, content: item.content, expirationTimestampUtc: expDateUtc.format() }
      saveChatHistoryItem(userMessageToSave)
      const userPromptKey: DynamoKeys = `chatbot-history[${userProfile?.username.toLowerCase()}][user][${item.conversationId}]`
      putRecord(userPromptKey, `chatbot-history[${userProfile?.username.toLowerCase()}][user]`, item)
      onRefresh?.()
    }
  }

  const deleteItem = async (item: ChatBotMessage) => {
    deleteChatHistoryItem(item)
    await deleteRecord(`chatbot-history[${userProfile?.username.toLowerCase()}][user][${item.conversationId}]`)
    await deleteRecord(`chatbot-history[${userProfile?.username.toLowerCase()}][assistant][${item.conversationId}]`)

    onRefresh?.()
  }

  const isProcessing = isValidatingProfile || isLoading

  return {
    userPrompts: data,
    addConverstation,
    getAgentChatResponse,
    saveItem,
    deleteItem,
    isProcessing,
  }
}
