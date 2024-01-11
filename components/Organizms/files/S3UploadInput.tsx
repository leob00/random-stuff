import { Box, Typography, TextField } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'

const S3UploadInput = ({ filename, onSelected }: { filename: string; onSelected: (filename: string) => void }) => {
  const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(event.target.value)
  }
  return (
    <Box py={2}>
      <CenterStack>
        <Box display={'flex'} gap={1}>
          <Typography>file name:</Typography>
          <TextField name='userFilename' variant='outlined' size='small' value={filename} onChange={onChanged}></TextField>
        </Box>
      </CenterStack>
    </Box>
  )
}

export default S3UploadInput
