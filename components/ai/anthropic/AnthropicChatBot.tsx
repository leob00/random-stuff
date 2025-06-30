import { Anthropic } from '@anthropic-ai/sdk/client'
import { Box, TextField, Typography } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { useState, useRef } from 'react'
import { CasinoGrayTransparent } from 'components/themes/mainTheme'
import { AnthropicChatbotMessage } from 'app/api/ai/anthropic/route'
import ChatBotMessage from 'components/ai//ChatBotMessage'

const AnthropicChatBot = () => {
  const [messages, setMessages] = useState<AnthropicChatbotMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponseText, setCurrentResponseText] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const streamChatResponse = async (message: string) => {
    const userMessage: AnthropicChatbotMessage = { role: 'user', content: message, timestamp: dayjs().format() }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/ai/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const text = await response.text()
        setIsLoading(false)
        setMessages((prev) => [
          ...prev,
          {
            content: JSON.parse(text).error,
            role: 'error',
            timestamp: dayjs().format(),
          },
        ])
        return
      }

      const reader = response.body?.getReader()
      if (reader) {
        const decoder = new TextDecoder()
        let accumulatedResponse = ''
        let responseMessages: AnthropicChatbotMessage[] = []
        let usage: Anthropic.Messages.MessageDeltaUsage | undefined = undefined

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('usage: ')) {
              const usageData = JSON.parse(line.slice(7))
              if (usageData.usage) {
                if (!usage) {
                  usage = usageData.usage
                }
              }
            }
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  accumulatedResponse = `${accumulatedResponse}${data.text.text}`
                  setCurrentResponseText(accumulatedResponse)
                } else if (data.done) {
                  // Stream completed - add final message
                  responseMessages.push({
                    role: 'assistant',
                    content: accumulatedResponse,
                    timestamp: dayjs().format(),
                    usage: usage,
                  })
                  setMessages((prev) => [...prev, ...responseMessages])
                  setIsLoading(false)
                  return
                } else if (data.error) {
                  throw new Error(data.error)
                }
              } catch (parseError) {
                console.error('Failed to parse streaming data:', parseError)
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled')
      } else {
        console.error('Streaming error:', error)
        const errorMessage: AnthropicChatbotMessage = {
          role: 'error',
          content: `Error: ${error.message}`,
          timestamp: dayjs().format(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } finally {
      setCurrentResponseText('')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageToSend = input.trim()
    setInput('')
    setCurrentResponseText('')
    await streamChatResponse(messageToSend)
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        <Box>
          {messages.map((msg, index) => (
            <Box key={index}>
              {msg.content && <ChatBotMessage msg={msg} />}
              {msg.usage && (
                <Box display={'flex'} flexDirection={'row'} gap={2}>
                  <ReadOnlyField
                    color={CasinoGrayTransparent}
                    variant='caption'
                    label='input tokens'
                    val={`${numeral(msg.usage.input_tokens).format('###,###')}`}
                  />
                  <ReadOnlyField
                    color={CasinoGrayTransparent}
                    variant='caption'
                    label='output tokens'
                    val={`${numeral(msg.usage.output_tokens).format('###,###')}`}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>

        <Box>
          <form onSubmit={handleSubmit}>
            {!isLoading ? (
              <TextField
                placeholder='ask me anything...'
                multiline
                rows={4}
                sx={{ width: '100%' }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                slotProps={{
                  input: {
                    autoCorrect: 'off',
                  },
                }}
              />
            ) : (
              <Box>
                <ScrollIntoView />
                <Box minHeight={100}>{currentResponseText && <Typography>{currentResponseText}</Typography>}</Box>
              </Box>
            )}

            <Box>
              {isLoading ? (
                <Box>
                  <Box display={'flex'} justifyContent={'center'}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <ComponentLoader pt={14} />
                      <CenterStack>
                        <Typography py={8}>thinking...</Typography>
                      </CenterStack>
                      <Box>
                        <DangerButton text='stop' type='button' onClick={handleStop}>
                          Stop
                        </DangerButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box py={2} display={'flex'} justifyContent={'flex-end'}>
                  <SuccessButton size='small' text='Go' type='submit' loading={isLoading} disabled={!input.trim()}>
                    Go
                  </SuccessButton>
                </Box>
              )}
            </Box>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default AnthropicChatBot
