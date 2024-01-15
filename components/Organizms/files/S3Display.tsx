import { Alert, Box, Typography } from '@mui/material'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { Bucket, S3Object, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { get } from 'lib/backend/api/fetchFunctions'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import useSWR, { mutate } from 'swr'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import S3FilesTable from './S3FilesTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getDefaultFolders, renameS3File } from 'lib/backend/csr/nextApiWrapper'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAdd from 'components/Molecules/Menus/ContextMenuAdd'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import AddFolderForm from 'components/Molecules/Forms/Files/AddFolderForm'
interface Key {
  key: string
  size: number
}

const S3Display = ({ userProfile }: { userProfile: UserProfile }) => {
  const bucketName: Bucket = 'rs-files'
  const folders = userProfile.settings?.folders ?? []
  const [selectedFolder, setSelectedFolder] = React.useState(folders.length > 0 ? folders[0] : getDefaultFolders(userProfile)[0])
  const [showAddFolderForm, setShowAddFolderForm] = React.useState(false)

  const mutateKey = `/api/baseRoute?id=s3FileList${selectedFolder.value}`

  const buildFilesAndFolders = (items: S3Object[]) => {
    const result: S3Object[] = []
    items.forEach((item) => {
      const isInFolder = item.fullPath.endsWith('/')
      const fileName = !isInFolder ? item.fullPath.substring(item.fullPath.lastIndexOf('/') + 1) : item.fullPath.substring(item.fullPath.lastIndexOf('/'))
      if (!isInFolder) {
        result.push({ ...item, filename: fileName, isFolder: isInFolder })
      }
    })
    return result
  }

  const dataFn = async () => {
    const response = await get('/api/s3', { bucket: bucketName, prefix: selectedFolder.value })
    const result = JSON.parse(response) as Key[]

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

  const { data, isLoading, error } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleUploaded = async (item: S3Object) => {
    if (item.prefix !== selectedFolder.value) {
      const oldPath = item.fullPath
      const newPath = `${selectedFolder.value}${item.fullPath.substring(item.fullPath.lastIndexOf('/'))}`
      await renameS3File(item.bucket, oldPath, newPath)
    }

    mutate(mutateKey)
  }

  const handleFolderChange = (id: string) => {
    setSelectedFolder(folders.find((m) => m.value === id)!)
    mutate(mutateKey)
  }

  const menu: ContextMenuItem[] = [
    {
      fn: () => {
        setShowAddFolderForm(!showAddFolderForm)
      },
      item: <ContextMenuAdd text='add folder'></ContextMenuAdd>,
    },
  ]

  return (
    <>
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}
      {isLoading && <BackdropLoader />}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Typography>folder: </Typography>
          <DropdownList options={folders} selectedOption={selectedFolder.value} onOptionSelected={handleFolderChange} />
        </Box>
        {/* <ContextMenu items={menu} /> */}
      </Box>
      <Box pt={2}>
        <S3FileUploadForm onUploaded={handleUploaded} />
      </Box>
      <Box py={2}>{data && <S3FilesTable data={data} onMutated={() => mutate(mutateKey)} />}</Box>
      {!isLoading && data && data.length === 0 && (
        <>
          <HorizontalDivider />
          <CenterStack sx={{ py: 2 }}>
            <Alert security='info'>This folder is empty.</Alert>
          </CenterStack>
        </>
      )}
      <FormDialog title={'folder'} show={showAddFolderForm} onCancel={() => setShowAddFolderForm(false)}>
        <AddFolderForm onCancel={() => setShowAddFolderForm(false)} />
      </FormDialog>
    </>
  )
}

export default S3Display
