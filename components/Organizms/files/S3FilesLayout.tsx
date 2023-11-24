import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { useUserController } from 'hooks/userController'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import { get } from 'lib/backend/api/fetchFunctions'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'
import S3FilesTable from './S3FilesTable'

interface Key {
  key: string
  size: number
}

const S3FilesLayout = () => {
  const mutateKey = ['/api/baseRoute', 's3FileList']
  const { ticket } = useUserController()
  const fetchData = async (url: string, id: string) => {
    const response = await get('/api/s3', { bucket: 'rs-files', prefix: ticket?.email })
    const result = JSON.parse(response) as Key[]
    const items: S3Object[] = result.map((m) => {
      return {
        bucket: 'rs-files',
        prefix: ticket!.email,
        filename: m.key.endsWith('/') ? m.key : m.key.substring(m.key.lastIndexOf('/') + 1),
        isFolder: m.key.endsWith('/'),
        size: m.size,
      }
    })
    //console.log(items)
    return sortArray(items, ['isFolder'], ['desc'])
  }
  const { data, isLoading, isValidating, error } = useSWR(mutateKey, ([url, id]) => fetchData(url, 's3FileList'))
  const handleUploaded = async (item: S3Object) => {
    mutate(mutateKey)
  }
  return (
    <Box>
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}
      {isLoading && <BackdropLoader />}
      {isValidating && <BackdropLoader />}
      <S3FileUploadForm onUploaded={handleUploaded} />
      <Box py={2}>
        <CenteredHeader title={'Files'} />
        {data && <S3FilesTable data={data} onMutated={() => mutate(mutateKey)} />}
      </Box>
    </Box>
  )
}

export default S3FilesLayout
