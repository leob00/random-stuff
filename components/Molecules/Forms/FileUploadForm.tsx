import { Box, TextField } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import { post } from 'lib/backend/api/fetchFunctions'
import React, { useState } from 'react'

const FileUploadForm = ({ onUploaded }: { onUploaded: (item: S3Object) => void }) => {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<S3Object | null>(null)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResponse(null)
    if (file) {
      setIsLoading(true)
      const data = new FormData()
      data.append('file', file)
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
  const handleViewFile = async () => {
    if (response) {
      const params = { bucket: response.bucket, prefix: response.prefix, filename: response.filename, expiration: 60 }
      const resp = JSON.parse(await post(`/api/s3`, params)) as string
      Object.assign(document.createElement('a'), {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: resp,
      }).click()
    }
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <form action='/api' method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
        <Box flexDirection={'column'} gap={1} display={'flex'}>
          <TextField
            type='file'
            name='file'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0])}
            inputProps={{
              accept:
                'application/pdf, image/jpeg, image/jpg, image/png, application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            }}
          />
          <SecondaryButton type='submit' text='Upload' />
        </Box>
      </form>
      {response && <SnackbarSuccess show={true} text={'file uploaded!'} />}
      {/* {response && (
        <>
          <JsonView obj={response} />
          <SecondaryButton text='View' onClick={handleViewFile} />
        </>
      )} */}
    </>
  )
}

export default FileUploadForm
