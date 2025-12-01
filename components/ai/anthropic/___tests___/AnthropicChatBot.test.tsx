import { render } from '@testing-library/react'
import AnthropicChatBot from 'components/ai/anthropic/AnthropicChatBot'
describe('AnthropicChatBot component', () => {
  it('matches the snapshot', () => {
    const { container } = render(<AnthropicChatBot />)
    expect(container).toMatchSnapshot()
  })
})
