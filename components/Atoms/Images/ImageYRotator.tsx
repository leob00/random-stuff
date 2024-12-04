import React from 'react'
import styled from '@emotion/styled'
import CenterStack from '../CenterStack'
import RemoteImageFlat from '../RemoteImageFlat'
import { motion } from 'framer-motion'
import { Box } from '@mui/material'

const StyledSpinner = styled.div`
  animation: rotation ${(props) => props.className || '0s'}s infinite;
  transform-style: preserve-3d;
  @keyframes rotation {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }
`

const ImageYRotator = ({
  imageUrl,
  speed,
  width,
  height,
  clickable,
  onClicked,
}: {
  imageUrl: string
  speed?: number
  width?: number
  height?: number
  clickable?: boolean
  onClicked?: () => void
}) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <>
      <Box sx={{ cursor: clickable ? 'pointer' : 'default' }} onClick={handleClick}>
        {/* <StyledSpinner className={`${speed}`}>
          <RemoteImageFlat title='image' url={imageUrl} width={width} height={height} onClicked={handleClick} />
        </StyledSpinner> */}
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <motion.img style={{ height: height, width: width }} src={imageUrl} alt='rotating image' animate={{ rotate: 360 }} transition={{ duration: 25 }} />
        </Box>
      </Box>
    </>
  )
}

export default ImageYRotator
