import { Box, Typography } from '@mui/material'
import { DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const CenteredHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <Box>
      <Typography variant='h5' sx={{ textAlign: 'center', p: 1 }} color={DarkBlueTransparent}>
        {`${title}`}
      </Typography>
      <Typography variant='body2' sx={{ textAlign: 'center', paddingBottom: 2 }} color={DarkBlueTransparent}>
        {`${description}`}
      </Typography>
    </Box>
  )
}

export default CenteredHeader
