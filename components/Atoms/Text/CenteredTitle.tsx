import { Box, Typography } from '@mui/material'
import { DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredTitle = ({ title }: { title: string }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' color='primary' sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  )
}

export default CenteredTitle
