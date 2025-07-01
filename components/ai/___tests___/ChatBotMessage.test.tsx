import { render } from '@testing-library/react'
import dayjs from 'dayjs'
import ChatBotMessage from '../ChatBotMessage'
import { AnthropicChatbotMessage } from 'lib/backend/api/models/antropic'
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
      },
    }
    const { container } = render(<ChatBotMessage msg={msg} />)
    expect(container).toMatchSnapshot()
  })
})
