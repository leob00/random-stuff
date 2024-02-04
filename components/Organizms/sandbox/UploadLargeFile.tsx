import { Box, Button, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import S3FileUploadForm, { allowed, VisuallyHiddenInput } from 'components/Molecules/Forms/S3FileUploadForm'
import React from 'react'
import S3UploadInput from '../files/S3UploadInput'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'

const UploadLargeFile = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      if (e.currentTarget.files.length > 0) {
        const newFile = e.currentTarget.files[0]
        setFile(newFile)
      }
    }
  }
  const handleSelected = (fileName: string) => {}
  return (
    <>
      <Box py={2}>
        <AlertWithHeader severity='warning' header='To do' text='implement one day' />
      </Box>
      <Box flexDirection={'column'} gap={1} display={'flex'} alignItems={'center'} py={2}>
        <Button color='info' component='label' variant='contained'>
          <Typography>{`${file ? '...change file' : '...upload a file'}`}</Typography>
          <VisuallyHiddenInput type='file' onChange={handleFileSelected} accept={allowed} />
        </Button>
      </Box>
      {file && (
        <>
          <S3UploadInput filename={file.name} onSelected={handleSelected} />
          <Box py={2}>
            <CenterStack>
              <SuccessButton type='submit' text='Upload' startIcon={<CloudUploadIcon />} />
            </CenterStack>
          </Box>
        </>
      )}
    </>
  )
}

export default UploadLargeFile
