import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import ListItemContainer from 'components/Molecules/Lists/ListItemContainer'
import { useUserController } from 'hooks/userController'
import { Bucket, S3Object } from 'lib/backend/api/aws/apiGateway'
import { get } from 'lib/backend/api/fetchFunctions'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'
import S3FilesTable from './S3FilesTable'

interface Key {
  key: string
  size: number
}
const isInFolder = (key: string) => {
  const result = key.split('/')
  if (result.length > 2) {
    console.log(result.length)
  }
  return result.length > 2
}
const bucketName: Bucket = 'rs-files'

const S3FilesLayout = ({ ticket }: { ticket: AmplifyUser }) => {
  const mutateKey = ['/api/baseRoute', 's3FileList']
  const baseFolder = `${ticket.email}`

  const fetchData = async (_url: string, id: string) => {
    if (!ticket) {
      return []
    }
    const response = await get('/api/s3', { bucket: bucketName, prefix: ticket.email })
    const result = JSON.parse(response) as Key[]

    const ret: S3Object[] = []

    const items: S3Object[] = result.map((m) => {
      return {
        bucket: bucketName,
        prefix: m.key,
        fullPath: m.key,
        filename: m.key.endsWith('/') ? m.key : m.key.substring(m.key.lastIndexOf('/') + 1),
        isFolder: isInFolder(m.key),
        size: m.size,
      }
    })
    //console.log(items)
    return sortArray(items, ['isFolder'], ['desc'])
  }
  const { data, isLoading, isValidating, error } = useSWR(mutateKey, ([url, id]) => fetchData(url, 's3FileList'), { revalidateOnFocus: false })

  const objects = data ?? []
  const folders = objects.filter((m) => m.isFolder)
  const files: S3Object[] = []
  folders.forEach((folder) => {
    const f = objects.filter((m) => m.isFolder || !m.fullPath.includes(folder.fullPath))
    files.push(...f)
  })

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
        {data && <S3FilesTable data={objects} onMutated={() => mutate(mutateKey)} />}
      </Box>
    </Box>
  )
}

export default S3FilesLayout
