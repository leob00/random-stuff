import { Box, TextField, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const FileUploadForm = ({ onUploaded }: { onUploaded: (item: S3Object) => void }) => {
  const [file, setFile] = React.useState<File | undefined>(undefined)
  const [userFilename, setUserFilename] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [response, setResponse] = React.useState<S3Object | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResponse(null)
    if (file) {
      setIsLoading(true)
      const data = new FormData()
      data.append('file', file)
      data.append('userFilename', userFilename)
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      const respData = await resp.json()
      setResponse(respData)
      setIsLoading(false)
      onUploaded(respData)
    } else {
      console.log('no file')
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
          <Box flexDirection={'column'} gap={1} display={'flex'} alignItems={'center'}>
            <TextField
              type='file'
              name='file'
              onChange={handleFileSelected}
              inputProps={{
                accept: 'application/pdf, image/jpeg, image/jpg, image/png, application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              }}
            />
          </Box>
          {file && (
            <Box py={2}>
              <CenterStack>
                <Box display={'flex'} gap={1}>
                  <Typography>file name:</Typography>
                  <TextField
                    name='userFilename'
                    variant='outlined'
                    size='small'
                    value={userFilename}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setUserFilename(event.target.value)
                    }}></TextField>
                  {/* <Typography>{file.name.substring(file.name.lastIndexOf('.'))}</Typography> */}
                </Box>
              </CenterStack>
            </Box>
          )}
          <Box py={2}>
            <CenterStack>
              <SecondaryButton type='submit' text='Upload' />
            </CenterStack>
          </Box>
        </>
      </form>
      {response && <SnackbarSuccess show={true} text={'file uploaded!'} />}
    </>
  )
}

export default FileUploadForm
