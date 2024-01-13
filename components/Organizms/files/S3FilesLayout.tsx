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

const buildFilesAndFolders = (items: S3Object[]) => {
  const result: S3Object[] = []
  items.forEach((item) => {
    var count = (item.fullPath.match(/[/]/g) || []).length
    const isInFolder = count > 1
    const fileName = !isInFolder ? item.fullPath.substring(item.fullPath.indexOf('/') + 1) : item.fullPath.split('/')[1]
    if (!isInFolder) {
      result.push({ ...item, filename: fileName, isFolder: isInFolder })
    }
  })
  return result
}

const bucketName: Bucket = 'rs-files'

const S3FilesLayout = ({ ticket }: { ticket: AmplifyUser }) => {
  const mutateKey = ['/api/baseRoute', 's3FileList']
  const baseFolder = `${ticket.email}`

  const fetchData = async (_url: string, id: string) => {
    if (!ticket) {
      return []
    }
    const response = await get('/api/s3', { bucket: bucketName, prefix: baseFolder })
    const result = JSON.parse(response) as Key[]

    //const ret: S3Object[] = []

    const items: S3Object[] = result.map((m) => {
      return {
        bucket: bucketName,
        prefix: m.key,
        fullPath: m.key,
        filename: '',
        isFolder: false,
        size: m.size,
      }
    })
    const results = buildFilesAndFolders(items)
    return sortArray(results, ['isFolder'], ['desc'])
  }
  const { data, isLoading, isValidating, error } = useSWR(mutateKey, ([url, id]) => fetchData(url, 's3FileList'), { revalidateOnFocus: false })

  // const folders = objects.filter((m) => m.isFolder)
  // const files: S3Object[] = []
  // folders.forEach((folder) => {
  //   const f = objects.filter((m) => m.isFolder || !m.fullPath.includes(folder.fullPath))
  //   files.push(...f)
  // })

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
