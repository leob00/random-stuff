import Anthropic from '@anthropic-ai/sdk'
import { getUserSSRAppRouteApi } from 'app/serverActions/auth/user'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const user = await getUserSSRAppRouteApi()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized. Please sign in.' }), { status: 403 })
  }
  //   if (user && user.roles && !!user.roles.find((m) => m.Name == 'Admin')) {
  //     return new Response(JSON.stringify({ error: 'This feature is only available to certain users.' }), { status: 403 })
  //   }
  try {
    const { message, model = 'claude-3-5-sonnet-20241022' } = await request.json()

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
          for await (const chunk of messageStream) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta
              if (text) {
                // Send the text chunk to the client
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`))
              }
            }
            if (chunk.type === 'message_delta') {
              const usage = chunk.usage
              controller.enqueue(new TextEncoder().encode(`usage: ${JSON.stringify({ usage })}\n\n`))
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
