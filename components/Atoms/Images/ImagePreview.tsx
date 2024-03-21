import { Box, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import GradientContainer from '../Boxes/GradientContainer'
import CenterStack from '../CenterStack'
import OptimizedImage from './OptimizedImage'

const ImagePreview = ({ url }: { url: string }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
  let width = isXSmall ? 280 : 800

  return (
    <CenterStack>
      {/* <GradientContainer> */}
      <Box sx={{ borderRadius: '16px', paddingTop: '4px' }}>
        {/* <img src={url} alt='preview image' width={width} style={{ borderRadius: '16px' }} /> */}
        <OptimizedImage url={url} title='' />
      </Box>
      {/* </GradientContainer> */}
    </CenterStack>
  )
}

export default ImagePreview
