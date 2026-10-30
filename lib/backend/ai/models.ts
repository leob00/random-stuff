import { AnthropicChatbotMessage } from '../api/models/antropic'

export type AiChatHistory = {
  items: ChatBotMessage[]
}

export type ChatBotMessage = {
  promptHash: string
  expirationTimestampUtc: string
} & AnthropicChatbotMessage
