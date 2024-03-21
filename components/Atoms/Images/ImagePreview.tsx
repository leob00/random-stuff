import { Box, useMediaQuery, useTheme } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'
import React from 'react'
import GradientContainer from '../Boxes/GradientContainer'
import CenterStack from '../CenterStack'
import OptimizedImage from './OptimizedImage'

const ImagePreview = ({ url, imageSize }: { url: string; imageSize?: ImageSize }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <CenterStack>
      <Box sx={{ borderRadius: '16px', paddingTop: '4px' }}>
        <OptimizedImage url={url} title='' imageSize={imageSize} />
      </Box>
    </CenterStack>
  )
}

export default ImagePreview
