import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { LambdaDynamoRequestBatch } from 'lib/backend/api/aws/models/apiGatewayModels'
import { deleteRecordsBatch, putRecordsBatch, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { getExpirateDateFromSeconds, getSecondsFromEpoch } from 'lib/util/dateUtil'
import React from 'react'
import useSWR, { mutate } from 'swr'

const PostBatch = () => {
  const secKey = weakEncrypt('test_put_batch')
  const testData: LambdaDynamoRequestBatch = {
    records: [
      {
        id: 'batch_put_test1',
        category: 'test_put_batch',
        data: { id: crypto.randomUUID() },
        expiration: getSecondsFromEpoch() + 120,
      },
      {
        id: 'batch_put_test2',
        category: 'test_put_batch',
        data: { id: crypto.randomUUID() },
        expiration: getSecondsFromEpoch() + 120,
      },
      {
        id: 'batch_put_test3',
        category: 'test_put_batch',
        data: { id: crypto.randomUUID() },
        expiration: getSecondsFromEpoch() + 120,
      },
      {
        id: 'batch_put_test4',
        category: 'test_put_batch',
        data: { id: crypto.randomUUID() },
        expiration: getSecondsFromEpoch() + 120,
      },
      {
        id: 'batch_put_test5',
        category: 'test_put_batch',
        data: { id: crypto.randomUUID() },
        expiration: getSecondsFromEpoch() + 120,
      },
    ],
  }

  const fetcherFn = async (url: string, key: string) => {
    const response = await searchRecords('test_put_batch')
    return response
  }

  const { data, isLoading, isValidating } = useSWR(secKey, ([url, key]) => fetcherFn(url, key))
  const [isWaiting, setIsWaiting] = React.useState(false)
  const handlePostBatch = async () => {
    setIsWaiting(true)
    await putRecordsBatch(testData)
    setIsWaiting(false)
    mutate(secKey)
  }
  const handleDeleteBatch = async () => {
    setIsWaiting(true)
    await deleteRecordsBatch(testData.records.map((m) => m.id))
    setIsWaiting(false)
    mutate(secKey)
  }
  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}

      {data && (
        <Box py={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>key</TableCell>
                  <TableCell>category</TableCell>
                  <TableCell>data</TableCell>
                  <TableCell>expiration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell>{item.key}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.data}</TableCell>
                      <TableCell>{getExpirateDateFromSeconds(item.expiration!).format('MM/DD/YYYY hh:mm:ss a')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <NoDataFound showDivider={false} message={'No records found.'} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box display={'flex'} gap={1}>
        <PrimaryButton text='post' onClick={handlePostBatch} />
        {data && data.length > 0 && <DangerButton text='delete' onClick={handleDeleteBatch} />}
      </Box>
    </Box>
  )
}

export default PostBatch
