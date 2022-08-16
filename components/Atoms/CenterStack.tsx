import { Stack, SxProps, Theme } from '@mui/material'
import React, { ReactNode } from 'react'

const CenterStack = ({ children, sx }: { children?: ReactNode; sx?: SxProps<Theme> }) => {
  return (
    <Stack direction='row' justifyContent='center' sx={sx}>
      {children}
    </Stack>
  )
}

export default CenterStack
