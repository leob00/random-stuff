import Anthropic from '@anthropic-ai/sdk'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { AnthropicChatbotMessage } from 'lib/backend/api/models/antropic'
import { NextRequest } from 'next/server'

type AnthropicRequest = {
  userMessage: AnthropicChatbotMessage
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const user = await getUserSSRAppRouteApi()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Please sign in.' }), { status: 401 })
  }
  if (user && user.roles) {
    const found = user.roles.find((m) => m.Name === 'AnthropicAiChat')
    if (!found) {
      return new Response(JSON.stringify({ error: 'This feature is only available to power users.' }), { status: 403 })
    }
  }
  try {
    const r = (await request.json()) as AnthropicRequest

    type RequestBody = {
      message: string
      model: string
    }

    const req: RequestBody = { message: r.userMessage.content, model: 'claude-3-5-sonnet-20241022' }

    const { message, model = 'claude-3-5-sonnet-20241022' } = req

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = await anthropic.messages.create({
            model: model,
            max_tokens: 4096,
            messages: [
              {
                role: 'user',
                content: message,
              },
            ],
            stream: true,
          })

          // Process the stream
          let apiUsage: Anthropic.Messages.Usage | undefined = undefined
          for await (const chunk of messageStream) {
            if (chunk.type === 'message_start') {
              apiUsage = chunk.message.usage
            }
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta
              if (text) {
                // Send the text chunk to the client
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`))
              }
            }

            if (chunk.type === 'message_delta') {
              const usage = { ...chunk.usage, input_tokens: apiUsage?.input_tokens ?? 0 }

              if (usage) {
                controller.enqueue(new TextEncoder().encode(`usage: ${JSON.stringify({ usage })}\n\n`))
              }
            }
            if (chunk.type === 'message_stop') {
              //todo: implement saving usage
            }
          }

          // Send completion signal
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.close()
        } catch (error: any) {
          console.error('Streaming error:')
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
