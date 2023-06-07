import { Backdrop, Box } from '@mui/material'
import { VeryLightTransparent } from 'components/themes/mainTheme'
import React from 'react'

const BackdropLoader = () => {
  return (
    <Box>
      <Backdrop sx={{ backgroundColor: VeryLightTransparent, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <img src={'/images/loaders/dots.svg'} alt='loader' />
      </Backdrop>
    </Box>
  )
}

export default BackdropLoader
