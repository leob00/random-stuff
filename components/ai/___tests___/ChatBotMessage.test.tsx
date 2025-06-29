import { render } from '@testing-library/react'
import { AnthropicChatbotMessage } from 'app/api/ai/anthropic/route'
import React from 'react'
import dayjs from 'dayjs'
import ChatBotMessage from '../ChatBotMessage'
describe('AnthropicChatbotMessage component', () => {
  it('matches the snapshot', () => {
    const msg: AnthropicChatbotMessage = {
      role: 'user',
      content: 'hello, how are you?',
      timestamp: dayjs(new Date(2025, 7, 1)).format(),
      usage: {
        input_tokens: 10,
        output_tokens: 100,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        server_tool_use: null,
      },
    }
    const { container } = render(<ChatBotMessage msg={msg} />)
    expect(container).toMatchSnapshot()
  })
})
