import { Box, Typography } from '@mui/material'
import React from 'react'

const CenteredParagraph = ({ text }: { text: string }) => {
  return (
    <Box>
      <Typography variant='body1' color='primary' sx={{ textAlign: 'center' }}>
        {text}
      </Typography>
    </Box>
  )
}

export default CenteredParagraph
