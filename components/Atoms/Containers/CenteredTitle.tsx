import { Box, Typography } from '@mui/material'
import { DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredTitle = ({ title }: { title: string }) => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' sx={{ textAlign: 'center', color: DarkBlueTransparent }}>
        {title}
      </Typography>
    </Box>
  )
}

export default CenteredTitle
