import { Box, Typography } from '@mui/material'
import { DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredTitle = ({ title }: { title: string }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant='h5' sx={{ textAlign: 'center', color: DarkBlue }}>
        {title}
      </Typography>
    </Box>
  )
}

export default CenteredTitle
