import { useLocalStore } from 'lib/backend/store/useLocalStore'

export const useChatbotHistoryController = () => {
  const { aiChatHistory, addToChatHistory } = useLocalStore()
  const userPrompts = aiChatHistory.items.filter((m) => m.role === 'user')

  const getAgentChatResponse = (id: string) => {
    const result = aiChatHistory.items.find((m) => m.promptHash === id && m.role === 'assistant')
    return result
  }

  return {
    userPrompts,
    addToChatHistory,
    getAgentChatResponse,
  }
}
