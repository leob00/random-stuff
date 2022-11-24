import { Box, Typography } from '@mui/material'
import { DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredSubtitle = ({ text }: { text: string }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='subtitle1' sx={{ textAlign: 'center' }}>
        {text}
      </Typography>
    </Box>
  )
}

export default CenteredSubtitle
