import { Box, Typography } from '@mui/material'
import React from 'react'

const CenteredTitle = ({ title }: { title: string }) => {
  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  )
}

export default CenteredTitle
