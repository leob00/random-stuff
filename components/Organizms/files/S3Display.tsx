import { Alert, Box } from '@mui/material'
import { Bucket, S3Object, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { DropdownItem } from 'lib/models/dropdown'
import { sortArray } from 'lib/util/collections'
import React from 'react'
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

function sortFolders(items?: DropdownItem[]) {
  const result = items ?? []
  return sortArray(result, ['text'], ['asc'])
}

const S3Display = ({ userProfile }: { userProfile: UserProfile }) => {
  const bucketName: Bucket = 'rs-files'
  const userFolders = sortFolders(userProfile.settings?.folders)
  const lastFolder = userProfile.settings?.selectedFolder
  const stateSelectedFolder = lastFolder ?? (userFolders.length > 0 ? userFolders[0] : getDefaultFolders(userProfile)[0])

  const [selectedFolder, setSelectedFolder] = React.useState(stateSelectedFolder)
  const [allFolders, setAllFolders] = React.useState(userFolders)
  const [showTopUploadForm, setShowTopUploadForm] = React.useState(false)
  const [isWaiting, setIsWaiting] = React.useState(false)
  const mutateKeyBase = `/api/baseRoute?id=s3FileList`
  const mutateKey = `${mutateKeyBase}${selectedFolder.value}`
  const s3Controller = useS3Controller()
  const { setProfile } = useUserController()

  const dataFn = async () => {
    const result = await getS3Files(bucketName, selectedFolder.value)
    return sortArray(result, ['filename'], ['asc'])
  }

  const { data, isLoading, error } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleUploaded = async (item: S3Object) => {
    const dataCopy = [...data!]

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
    setProfile({ ...userProfile, settings: { ...userProfile.settings, selectedFolder: newSelectedFolder } })
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
    <>
      {isLoading && <BackdropLoader />}
      {isWaiting && <BackdropLoader />}
      {error && <ErrorMessage text={'Opps! An error has occured. Please try refreshing the page.'} />}

      <Box display={'flex'} alignItems={'center'}>
        <S3FolderDropDown folders={allFolders} folder={selectedFolder} onFolderSelected={handleFolderSelected} />
        {data && (
          <FolderActions
            folders={allFolders}
            onFolderAdded={handleFolderAdd}
            items={data}
            selectedFolder={selectedFolder}
            onFolderDeleted={handleFolderDelete}
            onShowTopUploadForm={(show: boolean) => setShowTopUploadForm(show)}
          />
        )}
      </Box>
      {showTopUploadForm && (
        <Box pt={2}>{data && <S3FileUploadForm files={data} folder={selectedFolder.value} onUploaded={handleUploaded} isWaiting={isLoading} />}</Box>
      )}
      <Box py={3}>
        {data && (
          <S3FilesTable
            s3Controller={s3Controller}
            folder={selectedFolder}
            allFolders={allFolders}
            data={data}
            onReloadFolder={handleReloadFolder}
            onLocalDataMutate={handleFilesMutated}
          />
        )}
      </Box>

      {!isLoading && !isWaiting && data && data.length === 0 && (
        <>
          <CenterStack>
            <Alert severity='warning'>This folder is empty.</Alert>
          </CenterStack>
        </>
      )}
      <Box pt={2}>
        {data && !showTopUploadForm && !isLoading && (
          <S3FileUploadForm files={data} folder={selectedFolder.value} onUploaded={handleUploaded} isWaiting={isLoading} />
        )}
      </Box>
    </>
  )
}

export default S3Display
