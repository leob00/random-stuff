import { Box, Typography } from '@mui/material'
import { DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredParagraph = ({ text }: { text: string }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='body1' color='primary' sx={{ textAlign: 'center' }}>
        {text}
      </Typography>
    </Box>
  )
}

export default CenteredParagraph
