export interface Usage {
  cache_creation_input_tokens: number | null

  /**
   * The cumulative number of input tokens read from the cache.
   */
  cache_read_input_tokens: number | null

  /**
   * The cumulative number of input tokens which were used.
   */
  input_tokens: number | null

  /**
   * The cumulative number of output tokens which were used.
   */
  output_tokens: number
}

export interface AnthropicChatbotMessage {
  role: 'user' | 'assistant' | 'error'
  content: string
  timestamp: string
  usage?: Usage
}
