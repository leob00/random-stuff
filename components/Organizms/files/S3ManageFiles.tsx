import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import S3FilesTable from './S3FilesTable'
import { DropdownItem } from 'lib/models/dropdown'
import { useS3Controller } from 'hooks/s3/useS3Controller'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useState } from 'react'
import S3FileUploadForm from 'components/Molecules/Forms/S3FileUploadForm'
import { getS3Files } from 'lib/backend/csr/nextApiWrapper'
import { sortArray } from 'lib/util/collections'
import S3AttachFileButton from './S3AttachFileButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'
import { sleep } from 'lib/util/timers'

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
  const [progressText, setProgressText] = useState<string | null>(null)
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
    setProgressText(`uploading ${item.filename}`)
    setShowUpload(false)
    const newFiles = await getS3Files('rs-files', folderPath)
    const sorted = sortArray(newFiles, ['filename'], ['asc'])
    onFilesMutated(sorted)
    await sleep(250)

    setProgressText(null)
  }

  return (
    <Box py={2}>
      {!!progressText && <ProgressDrawer isOpen={!!progressText} message={progressText} />}
      {!showUpload && files && files.length > 0 && (
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
        <S3AttachFileButton onClicked={() => setShowUpload(!showUpload)} />
      </Box>
      {showUpload && <S3FileUploadForm files={files ?? []} folder={folderPath} onUploaded={handleUploaded} />}
    </Box>
  )
}

export default S3ManageFiles
