import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getS3Files } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { useState } from 'react'

export async function* streamingFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init)
  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      try {
        yield decoder.decode(value)
      } catch (e: any) {
        console.warn(e.message)
      }
    }
  }
}

const ApiStream = () => {
  const [data, setData] = useState<any[]>([])
  const [testApiResult, setTestApiResult] = useState<S3Object[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const asyncFetch = async () => {
    setData([])
    const it = streamingFetch('/api/stream', { method: 'POST' })

    for await (let value of it) {
      try {
        const chunk = JSON.parse(value)
        setData((prev) => [...prev, chunk])
      } catch (e: any) {
        console.warn(e.message)
        console.warn(e)
      }
    }
    setIsLoading(false)
  }

  const handleStartStream = () => {
    setTestApiResult(null)
    setIsLoading(true)
    asyncFetch()
  }

  const handleTestApi = async () => {
    setTestApiResult(null)
    setData([])
    const result = await getS3Files('rs-files', 'email@test.com/music/')
    setTestApiResult(result)
    console.log('data: ', data)
  }

  return (
    <Box py={2}>
      <CenterStack>
        <SuccessButton text='Start stream' onClick={handleStartStream} loading={isLoading} />
      </CenterStack>
      <CenterStack sx={{ py: 4 }}>
        <SuccessButton text='Api Test' onClick={handleTestApi} />
      </CenterStack>
      {data.map((chunk, index) => (
        <Box key={index} py={1}>
          <ListHeader text={`${chunk.value}`} fadeIn />
        </Box>
      ))}
      {testApiResult && <JsonView obj={testApiResult} />}
    </Box>
  )
}

export default ApiStream
