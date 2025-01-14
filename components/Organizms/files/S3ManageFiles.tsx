import { Box, IconButton, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import S3FilesTable from './S3FilesTable'
import { DropdownItem } from 'lib/models/dropdown'
import { useS3Controller } from 'hooks/s3/useS3Controller'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useState } from 'react'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CenterStack from 'components/Atoms/CenterStack'
import { getS3Files } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import S3AttachFileButton from './S3AttachFileButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const S3ManageFiles = ({
  displayName,
  folderPath,
  files,
  onFilesMutated,
}: {
  displayName: string
  folderPath: string
  files?: S3Object[]
  onFilesMutated: (item: S3Object[]) => void
}) => {
  const [showUpload, setShowUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const s3Controller = useS3Controller()
  const allFolders: DropdownItem[] = [
    {
      text: displayName,
      value: folderPath,
    },
  ]
  const handleFileMutate = (folder: DropdownItem, files: S3Object[]) => {
    onFilesMutated?.(files)
  }

  const handleUploaded = async (item: S3Object) => {
    setShowUpload(false)
    setIsLoading(true)
    const newFiles = await getS3Files('rs-files', folderPath)
    const sorted = sortArray(newFiles, ['filename'], ['asc'])
    onFilesMutated(sorted)
    setIsLoading(false)
  }

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {files && files.length > 0 && (
        <>
          <CenteredHeader variant='h4' title='files' />
          <HorizontalDivider />
          {files.length > 4 && (
            <Box py={2} display={'flex'} justifyContent={'flex-start'}>
              <S3AttachFileButton onClicked={() => setShowUpload(true)} />
            </Box>
          )}
          <S3FilesTable
            allowMoveFile={false}
            allFolders={allFolders}
            folder={{ text: displayName, value: folderPath }}
            data={files ?? []}
            s3Controller={s3Controller}
            onLocalDataMutate={handleFileMutate}
            showTableHeader={false}
            showFileAttributes
          />
        </>
      )}
      <Box py={2} display={'flex'} justifyContent={'center'} alignContent={'center'}>
        <S3AttachFileButton onClicked={() => setShowUpload(true)} />
      </Box>
      {showUpload && (
        <FormDialog show={showUpload} title='file upload' onCancel={() => setShowUpload(false)} fullScreen>
          <S3FileUploadForm files={files ?? []} folder={folderPath} onUploaded={handleUploaded} />
        </FormDialog>
      )}
    </Box>
  )
}

export default S3ManageFiles
