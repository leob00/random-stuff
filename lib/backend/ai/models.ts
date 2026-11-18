import { AnthropicChatbotMessage } from '../api/models/antropic'

export type AiChatHistory = {
  items: ChatBotMessage[]
}

export type ChatBotMessage = {
  conversationId?: string
  expirationTimestampUtc: string
} & AnthropicChatbotMessage

export type ChatBotConversation = {
  user: ChatBotMessage
  assistant: ChatBotMessage
}
