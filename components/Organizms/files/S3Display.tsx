import { Alert, Box } from '@mui/material'
import { Bucket, S3Object, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import { mutate } from 'swr'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import S3FilesTable from './S3FilesTable'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getDefaultFolders, getS3Files, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import FolderActions from './FolderActions'
import S3FolderDropDown from './S3FolderDropDown'
import { useS3Controller } from 'hooks/s3/useS3Controller'
import { useUserController } from 'hooks/userController'
import { useState } from 'react'

function sortFolders(items?: DropdownItem[]) {
  const result = items ?? []
  return sortArray(result, ['text'], ['asc'])
}

const S3Display = () => {
  const bucketName: Bucket = 'rs-files'
  const { authProfile } = useUserController()
  const userProfile = { ...authProfile! }
  const userFolders = sortFolders(userProfile?.settings?.folders)
  const lastFolder = userProfile?.settings?.selectedFolder
  const stateSelectedFolder =
    lastFolder ??
    (userFolders.length > 0
      ? userFolders[0]
      : getDefaultFolders(
          userProfile ?? {
            id: 'guest',
            username: 'guest',
          },
        )[0])

  const [selectedFolder, setSelectedFolder] = useState(stateSelectedFolder)

  const [allFolders, setAllFolders] = useState(userFolders)
  const [showTopUploadForm, setShowTopUploadForm] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const mutateKeyBase = `/api/baseRoute?id=s3FileList`
  const mutateKey = `${mutateKeyBase}${selectedFolder.value}`
  const s3Controller = useS3Controller()
  const { setProfile } = useUserController()

  const dataFn = async () => {
    const result = await getS3Files(bucketName, selectedFolder.value)
    return sortArray(result, ['filename'], ['asc'])
  }

  const { data: files, isLoading, error } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleUploaded = async (item: S3Object) => {
    const dataCopy = [...files!]

    if (!dataCopy.find((m) => m.filename.toLowerCase() === item.filename.toLowerCase())) {
      dataCopy.push(item)
    }
    const sorted = sortArray(dataCopy, ['filename'], ['asc'])
    handleFilesMutated(selectedFolder, sorted)
  }

  const handleFolderSelected = async (id: string) => {
    setShowTopUploadForm(false)
    const newSelectedFolder = allFolders.find((m) => m.value === id)!
    setSelectedFolder(newSelectedFolder)
    const newProfile = { ...userProfile, settings: { ...userProfile.settings, selectedFolder: newSelectedFolder } }
    setProfile(newProfile)
    putUserProfile(newProfile)
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
    mutate(mutateKey)
  }
  const handleFolderDelete = async (item: DropdownItem) => {
    setIsWaiting(true)
    setShowTopUploadForm(false)
    const newFolders = await s3Controller.deleteFolder(userProfile, item.text, allFolders)
    setAllFolders(newFolders)
    setSelectedFolder(newFolders[0])
    setIsWaiting(false)
    mutate(`${mutateKeyBase}${newFolders[0].value}`)
  }

  const handleReloadFolder = async (targetFolder: DropdownItem) => {
    const newProfile = { ...userProfile, settings: { ...userProfile.settings, selectedFolder: targetFolder } }
    setProfile(newProfile)
    putUserProfile(newProfile)
    await handleFolderSelected(targetFolder.value)
  }
  const handleFilesMutated = async (folder: DropdownItem, files: S3Object[]) => {
    setShowTopUploadForm(false)
    mutate(`${mutateKeyBase}${folder.value}`, files, { revalidate: false })
    await handleFolderSelected(folder.value)
  }
  return (
    <Box minHeight={500}>
      {isLoading && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}

      <Box display={'flex'} alignItems={'center'}>
        <S3FolderDropDown folders={allFolders} folder={selectedFolder} onFolderSelected={handleFolderSelected} />
        {files && <FolderActions folders={allFolders} onFolderAdded={handleFolderAdd} items={files} selectedFolder={selectedFolder} onFolderDeleted={handleFolderDelete} onShowTopUploadForm={(show: boolean) => setShowTopUploadForm(show)} />}
      </Box>
      {showTopUploadForm && <Box pt={2}>{files && <S3FileUploadForm files={files} folder={selectedFolder.value} onUploaded={handleUploaded} isWaiting={isLoading} />}</Box>}
      <Box py={3}>{files && <S3FilesTable s3Controller={s3Controller} folder={selectedFolder} allFolders={allFolders} data={files} onReloadFolder={handleReloadFolder} onLocalDataMutate={handleFilesMutated} />}</Box>

      {!isLoading && !isWaiting && files && files.length === 0 && (
        <>
          <CenterStack>
            <Alert severity='warning'>This folder is empty.</Alert>
          </CenterStack>
        </>
      )}
      <Box pt={2}>{files && !showTopUploadForm && !isLoading && <S3FileUploadForm files={files} folder={selectedFolder.value} onUploaded={handleUploaded} isWaiting={isLoading} />}</Box>
    </Box>
  )
}

export default S3Display
