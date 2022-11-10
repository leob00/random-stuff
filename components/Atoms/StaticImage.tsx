import React from 'react'
import NImage from 'next/legacy/image'
import { Box } from '@mui/material'
import { StaticImageData } from 'next/image'

const StaticImage = ({
  image,
  title,
  width,
  height,
  style,
  priority,
}: {
  image: StaticImageData
  title: string
  width?: number
  height?: number
  style?: React.CSSProperties
  priority?: boolean
}) => {
  return (
    <>
      <Box sx={{ position: 'relative', height: { height }, width: { width }, padding: '5px', my: 1, borderRadius: '16px' }} className='blue-gradient hoverBox'>
        <NImage
          style={style ? style : { borderRadius: '16px' }}
          src={image}
          alt={title}
          placeholder='blur'
          layout='fill'
          objectFit='cover'
          priority={priority}
        />
      </Box>
    </>
  )
}

export default StaticImage
