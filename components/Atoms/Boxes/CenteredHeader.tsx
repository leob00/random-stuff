import { Box, Typography } from '@mui/material'
import React from 'react'

const CenteredHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box>
      <Typography variant='body1' sx={{ textAlign: 'center' }}>
        {`${title}`}
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
        {`${description}`}
      </Typography>
    </Box>
  )
}

export default CenteredHeader
