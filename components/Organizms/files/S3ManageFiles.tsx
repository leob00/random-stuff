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

  const handleUploaded = (item: S3Object) => {
    setShowUpload(false)
    const newFiles = files ? [...files] : []
    newFiles.unshift(item)
    onFilesMutated(newFiles)
  }

  return (
    <Box py={2}>
      {files && files.length > 0 && (
        <>
          <CenteredHeader variant='h5' title='files' />
          <S3FilesTable
            allowMoveFile={false}
            allFolders={allFolders}
            folder={{ text: displayName, value: folderPath }}
            data={files ?? []}
            s3Controller={s3Controller}
            onLocalDataMutate={handleFileMutate}
            showTableHeader={false}
          />
        </>
      )}
      <Box py={2}>
        <CenterStack>
          <IconButton color='primary' size='small' onClick={() => setShowUpload(true)}>
            <AttachFileIcon fontSize='small'></AttachFileIcon>
          </IconButton>
          <Typography variant='body2'>attach a file</Typography>
        </CenterStack>
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
