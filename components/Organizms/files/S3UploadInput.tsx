import { Box, Typography, TextField } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'

const S3UploadInput = ({ filename, onSelected }: { filename: string; onSelected: (filename: string) => void }) => {
  const ext = filename.substring(filename.lastIndexOf('.'))
  const displayName = filename.substring(0, filename.lastIndexOf('.'))
  const onChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(`${event.target.value}${ext}`)
    console.log(`${event.target.value}${ext}`)
  }
  return (
    <Box py={2}>
      <CenterStack>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography>file name:</Typography>
          <TextField name='userFilename' variant='outlined' size='small' value={displayName} onChange={onChanged}></TextField>
          <Typography>{ext}</Typography>
        </Box>
      </CenterStack>
    </Box>
  )
}

export default S3UploadInput
