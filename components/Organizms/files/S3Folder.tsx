import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import FolderIcon from '@mui/icons-material/Folder'

const S3Folder = ({ path }: { path: string }) => {
  const split = path.split('/').filter((m) => m.length > 0)
  const folders = split.length > 1 ? split.splice(1) : split
  return (
    <Box>
      <Box display='flex' alignItems={'center'} gap={1}>
        <IconButton size='small'>
          <FolderIcon fontSize='small' />
        </IconButton>
        <Typography>{folders[0]}</Typography>
      </Box>
    </Box>
  )
}

export default S3Folder
