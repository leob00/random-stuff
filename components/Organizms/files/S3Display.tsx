import { Alert, Box } from '@mui/material'
import { Bucket, S3Object, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
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
import { getDefaultFolders } from 'lib/backend/csr/nextApiWrapper'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FolderActions from './FolderActions'
import S3FolderDropDown from './S3FolderDropDown'
import { useS3Controller } from 'hooks/s3/useS3Controller'
interface Key {
  key: string
  size: number
}

function sortFolders(items?: DropdownItem[]) {
  const result = items ?? []
  if (items?.length === 0) {
    return items
  }
  return sortArray(result, ['text'], ['asc'])
}

const S3Display = ({ userProfile }: { userProfile: UserProfile }) => {
  const bucketName: Bucket = 'rs-files'
  const userFolders = sortFolders(userProfile.settings?.folders)
  const [selectedFolder, setSelectedFolder] = React.useState(userFolders.length > 0 ? userFolders[0] : getDefaultFolders(userProfile)[0])
  const [allFolders, setAllFolders] = React.useState(userFolders)
  const [isWaiting, setIsWaiting] = React.useState(false)
  const mutateKeyBase = `/api/baseRoute?id=s3FileList`
  const mutateKey = `${mutateKeyBase}${selectedFolder.value}`
  const s3Controller = useS3Controller()

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
    const dataCopy = [...data!]
    dataCopy.push(item)
    const newItems = sortArray(dataCopy, ['filename'], ['asc'])
    mutate(mutateKey, newItems, { revalidate: false })
  }

  const handleFolderSelected = async (id: string) => {
    setSelectedFolder(allFolders.find((m) => m.value === id)!)
    mutate(`${mutateKeyBase}${id}`)
  }
  const handleFolderAdd = async (name: string) => {
    setIsWaiting(true)
    const newItem: DropdownItem = {
      text: name,
      value: `${userProfile.username}/${name}`,
    }
    const newFolders = await s3Controller.addFolder(userProfile, name, allFolders)
    setAllFolders(newFolders)
    setSelectedFolder(newItem)
    setIsWaiting(false)
    s3Controller.dispatch({ type: 'reset', payload: s3Controller.uiDefaultState })
    mutate(mutateKey)
  }
  const handleFolderDelete = async (item: DropdownItem) => {
    setIsWaiting(true)

    const newFolders = await s3Controller.deleteFolder(userProfile, item.text, allFolders)
    setAllFolders(newFolders)
    setSelectedFolder(newFolders[0])
    setIsWaiting(false)
    s3Controller.dispatch({ type: 'reset', payload: s3Controller.uiDefaultState })
    mutate(`${mutateKeyBase}${newFolders[0].value}`)
  }

  const handleMoveFiles = async (items: S3Object[], targetFolder: DropdownItem) => {
    await handleFolderSelected(targetFolder.value)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}

      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <S3FolderDropDown folders={allFolders} folder={selectedFolder} onFolderSelected={handleFolderSelected} />
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
      <Box pt={2}>
        <S3FileUploadForm folder={selectedFolder.value} onUploaded={handleUploaded} />
      </Box>
      <Box py={2}>
        {data && (
          <S3FilesTable
            s3Controller={s3Controller}
            folder={selectedFolder}
            allFolders={allFolders}
            data={data}
            onMutated={() => mutate(mutateKey)}
            onMoveItems={handleMoveFiles}
          />
        )}
      </Box>
      {!isLoading && !isWaiting && data && data.length === 0 && (
        <>
          <HorizontalDivider />
          <CenterStack sx={{ py: 2 }}>
            <Alert severity='warning'>This folder is empty.</Alert>
          </CenterStack>
        </>
      )}
    </>
  )
}

export default S3Display
