import { Box, Typography } from '@mui/material'
import React from 'react'
import CenteredTitle from '../Containers/CenteredTitle'

const CenteredHeader = ({ title, description }: { title: string; description?: string }) => {
  return (
    <Box>
      <CenteredTitle title={title} />
      {description && (
        <Typography variant='body1' sx={{ textAlign: 'center', paddingBottom: 2 }}>
          {`${description}`}
        </Typography>
      )}
    </Box>
  )
}

export default CenteredHeader
