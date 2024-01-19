import { Alert, Box, Typography } from '@mui/material'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { Bucket, S3Object, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { get } from 'lib/backend/api/fetchFunctions'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import React from 'react'
import { mutate } from 'swr'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import S3FilesTable from './S3FilesTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getDefaultFolders, putUserProfile, renameS3File } from 'lib/backend/csr/nextApiWrapper'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FolderActions from './FolderActions'
import { useUserController } from 'hooks/userController'
import S3FolderDropDown from './S3FolderDropDown'
interface Key {
  key: string
  size: number
}

const S3Display = ({ userProfile }: { userProfile: UserProfile }) => {
  const bucketName: Bucket = 'rs-files'
  const userFolders = userProfile.settings?.folders ?? []
  const [selectedFolder, setSelectedFolder] = React.useState(userFolders.length > 0 ? userFolders[0] : getDefaultFolders(userProfile)[0])
  const [allFolders, setAllFolders] = React.useState(userFolders)
  const [isWaiting, setIsWaiting] = React.useState(false)

  const mutateKey = `/api/baseRoute?id=s3FileList${selectedFolder.value}`

  const { setProfile } = useUserController()

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
    return sortArray(results, ['filename'], ['asc'])
  }

  const { data, isLoading, error } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleUploaded = async (item: S3Object) => {
    if (item.prefix !== selectedFolder.value) {
      setIsWaiting(true)
      const oldPath = item.fullPath
      const newPath = `${selectedFolder.value}${item.fullPath.substring(item.fullPath.lastIndexOf('/'))}`
      await renameS3File(item.bucket, oldPath, newPath)
    }
    setIsWaiting(false)
    mutate(mutateKey)
  }

  const handleFolderChange = (id: string) => {
    setSelectedFolder(allFolders.find((m) => m.value === id)!)
    mutate(mutateKey)
  }
  const handleFolderAdd = async (name: string) => {
    const newFolders = [...allFolders]
    const newItem: DropdownItem = {
      text: name,
      value: `${userProfile.username}/${name}`,
    }
    newFolders.push(newItem)

    const newProfile = { ...userProfile }
    const sorted = sortArray(newFolders, ['text'], ['asc'])
    newProfile.settings!.folders = sorted
    await setProfile(newProfile)
    await putUserProfile(newProfile)
    setAllFolders(sorted)
    setSelectedFolder(newItem)
    mutate(mutateKey)
  }
  const handleFolderDelete = async (item: DropdownItem) => {
    setIsWaiting(true)
    const newFolders = [...allFolders].filter((m) => m.text !== item.text)

    const newProfile = { ...userProfile }
    const sorted = sortArray(newFolders, ['text'], ['asc'])
    newProfile.settings!.folders = sorted

    await putUserProfile(newProfile)
    setProfile(newProfile)
    setAllFolders(sorted)
    setSelectedFolder(sorted[0])
    setIsWaiting(false)
    mutate(`/api/baseRoute?id=s3FileList${sorted[0].value}`)
  }

  return (
    <>
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}
      {isLoading && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <S3FolderDropDown folders={allFolders} folder={selectedFolder} onFolderSelected={handleFolderChange} />
        {data && (
          <FolderActions
            folders={allFolders}
            onFolderAdded={handleFolderAdd}
            items={data}
            selectedFolder={selectedFolder}
            onFolderDeleted={handleFolderDelete}
          />
        )}
      </Box>
      <Box pt={2}>{!isLoading && !isWaiting && <S3FileUploadForm folder={selectedFolder.value} onUploaded={handleUploaded} />}</Box>
      <Box py={2}>{data && <S3FilesTable data={data} onMutated={() => mutate(mutateKey)} />}</Box>
      {!isLoading && !isWaiting && data && data.length === 0 && (
        <>
          <HorizontalDivider />
          <CenterStack sx={{ py: 2 }}>
            <Alert security='info'>This folder is empty.</Alert>
          </CenterStack>
        </>
      )}
    </>
  )
}

export default S3Display
