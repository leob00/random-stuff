import { Box, Button, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import React from 'react'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import S3UploadInput from 'components/Organizms/files/S3UploadInput'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { renameS3File } from 'lib/backend/csr/nextApiWrapper'
const allowed =
  'application/pdf, image/jpeg, image/jpg, image/png, application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document, audio/mpeg, audio/mp4, video/mp4, application/zip'

const S3FileUploadForm = ({ folder, onUploaded }: { folder: string; onUploaded: (item: S3Object) => void }) => {
  const [file, setFile] = React.useState<File | undefined>(undefined)
  const [userFilename, setUserFilename] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [response, setResponse] = React.useState<S3Object | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const maxFileSize = 10000000

  const VisuallyHiddenInput = styled('input')({
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResponse(null)
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
      setError(null)
      const resp = await fetch('/api/s3uploadPresignedUrl', {
        method: 'POST',
        body: data,
      })
      try {
        const respData = (await resp.json()) as S3Object
        if (respData.message) {
          setError(respData.message)
        }

        const oldPath = respData.fullPath
        const newPath = `${folder}${respData.fullPath.substring(respData.fullPath.lastIndexOf('/'))}`
        await renameS3File(respData.bucket, oldPath, newPath)
        const result = { ...respData, fullPath: newPath, prefix: newPath.substring(0, newPath.lastIndexOf('/') + 1) }
        setResponse(result)
        onUploaded(result)
        setIsLoading(false)
        setUserFilename('')
        setFile(undefined)
      } catch (err) {
        setError('Oops! Encountered an error. Please try again')
        setFile(undefined)
      }
    } else {
      setError('Please select a file!')
    }
  }
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      if (e.currentTarget.files.length > 0) {
        const newFile = e.currentTarget.files[0]
        setFile(newFile)
        setUserFilename(newFile.name)
      }
    }
  }

  return (
    <>
      {isLoading && <BackdropLoader />}
      <form action='/api/defaultRoute' method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
        <>
          {!isLoading && (
            <Box flexDirection={'column'} gap={1} display={'flex'} alignItems={'center'}>
              <Button color='info' component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                <Typography>...upload a file</Typography>
                <VisuallyHiddenInput type='file' onChange={handleFileSelected} accept={allowed} />
              </Button>
            </Box>
          )}
          {file && (
            <>
              <S3UploadInput filename={userFilename} onSelected={(filename: string) => setUserFilename(filename)} />
              <Box py={2}>
                <CenterStack>
                  <PrimaryButton type='submit' text='Upload' />
                </CenterStack>
              </Box>
            </>
          )}
          {error && <ErrorMessage text={error} />}
        </>
      </form>
      {response && <SnackbarSuccess show={true} text={`${response.filename} uploaded!`} />}
    </>
  )
}

export default S3FileUploadForm
