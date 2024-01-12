import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import FolderIcon from '@mui/icons-material/Folder'

const S3Folder = ({ path }: { path: string }) => {
  return (
    <Box>
      <Box display='flex' alignItems={'center'} gap={1}>
        <IconButton size='small'>
          <FolderIcon fontSize='small' />
        </IconButton>
        <Typography>{path}</Typography>
      </Box>
    </Box>
  )
}

export default S3Folder
