import { Alert, Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import S3UploadInput from 'components/Organizms/files/S3UploadInput'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { renameS3File } from 'lib/backend/csr/nextApiWrapper'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import FileUploadButton from 'components/Atoms/Buttons/FileUploadButton'
import { allSupportedFileTypes } from 'lib/backend/files/fileTypes'
import { FormEvent, useState } from 'react'
import ModalProgress from 'components/Atoms/Loaders/ModalProgress'
import { sleep } from 'lib/util/timers'
import ProgressDrawer from 'components/Atoms/Drawers/ProgressDrawer'

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const S3FileUploadForm = ({
  folder,
  files,
  onUploaded,
  isWaiting,
}: {
  folder: string
  files: S3Object[]
  onUploaded: (item: S3Object) => void
  isWaiting?: boolean
}) => {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [userFilename, setUserFilename] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [progressText, setProgressText] = useState<string | null>(null)

  const maxFileSize = 10000000

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setWarning(null)
    setError(null)

    if (file) {
      if (file.size > maxFileSize) {
        setError(`file cannot exceed ${maxFileSize / 1000000} MB`)
        return
      }
      setIsLoading(true)

      const data = new FormData()
      data.append('file', file)
      data.append('userFilename', userFilename)
      data.append('prefix', folder)
      setProgressText(`uploading ${userFilename}`)
      try {
        const resp = await fetch('/api/s3upload', {
          method: 'POST',
          body: data,
        })

        const respData = (await resp.json()) as S3Object

        if (respData.message) {
          setError(respData.message)
          return
        }

        const oldPath = respData.fullPath
        const newPath = `${folder}${respData.fullPath.substring(respData.fullPath.lastIndexOf('/'))}`
        const renameResp = await renameS3File(respData.bucket, oldPath, newPath)
        if (renameResp.errorMessage) {
          setError('Upload failed. Please try again')
          setProgressText(null)
          return
        }
        if (renameResp.statusCode === 200) {
          const result = { ...respData, fullPath: newPath, prefix: newPath.substring(0, newPath.lastIndexOf('/') + 1) }
          onUploaded(result)
          await sleep(500)
          setProgressText(null)
        }

        setUserFilename('')
        setFile(undefined)
      } catch (err) {
        console.error(err)
        setError('Oops! Encountered an error. Please try again')
        setFile(undefined)
        setProgressText(null)
      } finally {
        setIsLoading(false)
      }
    } else {
      setError('Please select a file!')
    }
  }
  const handleFileSelected = (f: File) => {
    setFile(f)

    if (files.find((m) => m.filename.toLowerCase() === f.name.toLowerCase())) {
      setWarning(`${f.name} already exists and will be overwritten`)
    } else {
      setWarning(null)
    }

    setUserFilename(f.name)
  }
  const handleSelected = (fileName: string) => {
    if (files.find((m) => m.filename.toLowerCase() === fileName.toLowerCase())) {
      setWarning(`${fileName} already exists and will be overwritten`)
    }
    setUserFilename(fileName)
  }

  return (
    <>
      <form method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
        <>
          <Box flexDirection={'column'} gap={1} display={'flex'} alignItems={'center'} py={2}>
            <FileUploadButton file={file} onFileSelected={handleFileSelected} disabled={isWaiting} accept={allSupportedFileTypes} />
          </Box>
          {file && (
            <>
              <S3UploadInput filename={userFilename} onSelected={handleSelected} />
              <Box py={2}>
                {warning && (
                  <Box py={2}>
                    <CenterStack>
                      <Alert severity='warning'>{warning}</Alert>
                    </CenterStack>
                  </Box>
                )}
                <CenterStack>
                  <SuccessButton type='submit' text='Upload' startIcon={<CloudUploadIcon />} />
                </CenterStack>
              </Box>
            </>
          )}
          {error && <ErrorMessage text={error} />}
        </>
      </form>
      {!!progressText && <ProgressDrawer isOpen={!!progressText} message={progressText} />}
    </>
  )
}

export default S3FileUploadForm
