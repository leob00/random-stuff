import { Box, Typography } from '@mui/material'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import { useEffect, useState } from 'react'

export async function* streamingFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init)
  const reader = response.body!.getReader()
  const decoder = new TextDecoder('utf-8')

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break

    try {
      yield decoder.decode(value)
    } catch (e: any) {
      console.warn(e.message)
    }
  }
}

const ApiStream = () => {
  const [data, setData] = useState<any[]>([])

  const asyncFetch = async () => {
    const it = streamingFetch('/api/stream')

    for await (let value of it) {
      try {
        const chunk = JSON.parse(value)
        setData((prev) => [...prev, chunk])
      } catch (e: any) {
        console.warn(e.message)
      }
    }
  }

  const handleStartStream = () => {
    asyncFetch()
  }

  return (
    <Box py={2}>
      <CenterStack>
        <SuccessButton text='Start stream' onClick={handleStartStream} />
      </CenterStack>
      {data.map((chunk, index) => (
        <Typography key={index}>{`Received chunk ${index} - ${chunk.value}`}</Typography>
      ))}
    </Box>
  )
}

export default ApiStream
