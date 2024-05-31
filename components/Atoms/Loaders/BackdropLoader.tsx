'use client'
import { Backdrop, Box, useTheme } from '@mui/material'
import { VeryLightTransparent } from 'components/themes/mainTheme'
import React from 'react'
import CircleLoader from './CircleLoader'

const BackdropLoader = () => {
  const theme = useTheme()
  return (
    <Box>
      <Backdrop sx={{ backgroundColor: VeryLightTransparent, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircleLoader />
      </Backdrop>
    </Box>
  )
}

export default BackdropLoader
