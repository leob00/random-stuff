import { Box, TextField } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import React, { useState } from 'react'

const FileUploadForm = () => {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file) {
      setIsLoading(true)
      console.log('uploading: ', file.name)
      const data = new FormData()

      data.append('file', file)
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })
      const respData = await resp.json()
      console.log(respData)

      setIsLoading(false)
    } else {
      console.log('no file')
    }
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <form action='/api' method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
        <Box flexDirection={'column'} gap={1} display={'flex'}>
          <TextField type='file' name='file' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0])} />
          <SecondaryButton type='submit' text='Upload' />
        </Box>
      </form>
    </>
  )
}

export default FileUploadForm
