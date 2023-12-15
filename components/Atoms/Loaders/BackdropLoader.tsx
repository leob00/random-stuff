import { Backdrop, Box } from '@mui/material'
import { VeryLightTransparent } from 'components/themes/mainTheme'
import React from 'react'

const BackdropLoader = () => {
  return (
    <Box>
      <Backdrop sx={{ backgroundColor: VeryLightTransparent, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
          <img src={'/images/loaders/blue-ring.svg'} alt='loader' />
          <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
        </Box>
        {/* <img src={'/images/loaders/dots.svg'} alt='loader' /> */}
      </Backdrop>
    </Box>
  )
}

export default BackdropLoader
