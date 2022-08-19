import { Stack, Box, SxProps, Theme } from '@mui/material'
import React, { ReactNode } from 'react'

const CenterStack = ({ children, sx }: { children?: ReactNode; sx?: SxProps<Theme> }) => {
  return (
    <Box sx={{}}>
      <Stack direction='row' justifyContent='center' sx={sx}>
        {children}
      </Stack>
    </Box>
  )
}

export default CenterStack
