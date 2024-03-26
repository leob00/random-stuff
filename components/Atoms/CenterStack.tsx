'use client'
import { Stack, Box, SxProps, Theme } from '@mui/material'
import React, { ReactNode } from 'react'

const CenterStack = ({ children, sx }: { children?: ReactNode; sx?: SxProps<Theme> }) => {
  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={sx} alignItems={'center'}>
        {children}
      </Stack>
    </Box>
  )
}

export default CenterStack
