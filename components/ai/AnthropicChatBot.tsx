import { Anthropic } from '@anthropic-ai/sdk/client'
import { Box, TextField, Typography } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { CasinoBlue, CasinoGrayTransparent, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { useState, useRef } from 'react'

interface Message {
  role: string
  content: string
  timestamp: string
  usage?: Anthropic.Messages.MessageDeltaUsage
}

const AnthropicChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const streamChatResponse = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = { role: 'user', content: message, timestamp: dayjs().format() }
    // const newMessages = [...messages]
    // newMessages.push(userMessage)
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
        body: JSON.stringify({ message }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (reader) {
        const decoder = new TextDecoder()
        let accumulatedResponse = ''
        let messages: Message[] = []
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
                messages.push({
                  role: 'assistant',
                  content: '',
                  timestamp: dayjs().format(),
                  usage: usageData.usage,
                })
                break
              }
            }
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  accumulatedResponse = `${accumulatedResponse}${data.text.text}`
                } else if (data.done) {
                  // Stream completed - add final message
                  messages.push({
                    role: 'assistant',
                    content: accumulatedResponse,
                    timestamp: dayjs().format(),
                  })
                  //setMessages((prev) => [...prev, assistantMessage])

                  setCurrentResponse('')
                  setIsLoading(false)
                  //return
                } else if (data.error) {
                  throw new Error(data.error)
                }
              } catch (parseError) {
                console.error('Failed to parse streaming data:', parseError)
              }
            }
          }
          setMessages((prev) => [...prev, ...messages])
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled')
      } else {
        console.error('Streaming error:', error)
        const errorMessage: Message = {
          role: 'error',
          content: `Error: ${error.message}`,
          timestamp: dayjs().format(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
      setCurrentResponse('')
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageToSend = input.trim()
    setInput('')
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
        {/* Chat Messages */}
        {/* <Box>{messages.length === 0 && !currentResponse && <Typography>Start a conversation...</Typography>}</Box> */}
        <Box>
          {messages.map((msg, index) => (
            <Box key={index}>
              {!msg.usage && (
                <Box>
                  <Box display={'flex'} alignItems={'center'} gap={2} py={1}>
                    <Typography
                      variant='caption'
                      color={msg.role === 'user' ? CasinoGrayTransparent : msg.role === 'error' ? CasinoRed : CasinoGrayTransparent}
                    >
                      {msg.role === 'user' ? 'You: ' : msg.role === 'error' ? 'Error' : 'AI: '}
                    </Typography>
                    <Typography variant='caption' color={CasinoGrayTransparent}>
                      {dayjs(msg.timestamp).format('MM/DD/YYYY hh:mm A')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography>{msg.content}</Typography>
                  </Box>
                </Box>
              )}
              {msg.usage && (
                <Box>{/* <ReadOnlyField variant='caption' label='output tokens' val={`${numeral(msg.usage.output_tokens).format('###,###')}`} /> */}</Box>
              )}
            </Box>
          ))}
          {/* Current streaming response */}
          {/* {currentResponse && (
            <div className='mb-4'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800'>Claude</span>
                <span className='text-xs text-gray-500'>typing...</span>
              </div>
              <div className='p-3 rounded-lg bg-white border-l-4 border-green-400'>
                <div className='whitespace-pre-wrap'>{currentResponse}</div>
                <div className='inline-block w-2 h-4 bg-green-500 animate-pulse ml-1'></div>
              </div>
            </div>
          )} */}
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
                {/* <TextField
                  disabled={isLoading}
                  placeholder='typing...'
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
                /> */}
              </Box>
            )}

            <Box>
              {isLoading ? (
                <Box>
                  <Box>
                    <ComponentLoader />
                    <CenterStack>
                      <Typography py={8}>thinking...</Typography>
                    </CenterStack>
                  </Box>
                  <Box>
                    <DangerButton text='stop' type='button' onClick={handleStop}>
                      Stop
                    </DangerButton>
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

function addDataMessage(line: string, messages: Message[]) {}

export default AnthropicChatBot
