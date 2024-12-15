import { StreamingResponse, makeStream } from 'lib/backend/streaming/stream'
import { sleep } from 'lib/util/timers'
import { NextRequest } from 'next/server'

type Item = {
  key: string
  value: string
}

async function* fetchItems(): AsyncGenerator<Item, void, unknown> {
  for (let i = 0; i < 10; ++i) {
    await sleep(1000)
    yield {
      key: `key${i}`,
      value: `value${i}`,
    }
  }
}

export async function GET(req: NextRequest) {
  const stream = makeStream(fetchItems())
  const response = new StreamingResponse(stream)
  return response
}
