import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { LambdaDynamoRequestBatch } from 'lib/backend/api/aws/apiGateway'
import { post } from 'lib/backend/api/fetchFunctions'
import { searchRecords, SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { getSecondsFromEpoch } from 'lib/util/dateUtil'
import React from 'react'
import useSWR, { mutate } from 'swr'

const PostBatch = () => {
  const secKey = weakEncrypt('test_put_batch')

  const fetcherFn = async (url: string, key: string) => {
    const response = await searchRecords('test_put_batch')
    //console.log(response)
    return response
  }

  const { data, isLoading, isValidating } = useSWR(secKey, ([url, key]) => fetcherFn(url, key))
  const handlePostBatch = async () => {
    const data: LambdaDynamoRequestBatch = {
      records: [
        {
          id: 'batch_put_test1',
          category: 'test_put_batch',
          data: { id: '1' },
          expiration: getSecondsFromEpoch() + 120,
        },
        {
          id: 'batch_put_test2',
          category: 'test_put_batch',
          data: { id: '2' },
          expiration: getSecondsFromEpoch() + 120,
        },
      ],
    }
    const req: SignedRequest = {
      data: weakEncrypt(JSON.stringify(data)),
    }
    await post('/api/putRandomStuffBatch', req)
    mutate(secKey)
  }
  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      {data && <JsonView obj={JSON.stringify(data, null, 2)} />}
      <PrimaryButton text='post' onClick={handlePostBatch} />
    </Box>
  )
}

export default PostBatch
