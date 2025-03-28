import { Box, Button, Typography } from '@mui/material'
import { VisuallyHiddenInput } from 'components/Molecules/Forms/S3FileUploadForm'

const FileUploadButton = ({
  disabled,
  file,
  onFileSelected,
  accept,
}: {
  disabled?: boolean
  file?: File
  onFileSelected: (file: File) => void
  accept: string
}) => {
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      if (e.currentTarget.files.length > 0) {
        const newFile = e.currentTarget.files[0]
        onFileSelected(newFile)
      }
    }
  }
  return (
    <Box flexDirection={'column'} gap={1} display={'flex'} alignItems={'center'} py={2}>
      <Button color='info' component='label' variant='contained'>
        <Typography>{`${file ? '...change file' : '...select a file'}`}</Typography>
        <VisuallyHiddenInput type='file' onChange={handleFileSelected} accept={accept} disabled={disabled} />
      </Button>
    </Box>
  )
}

export default FileUploadButton
