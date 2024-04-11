import React from 'react'
import NImage from 'next/image'
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
      <Box sx={{ position: 'relative', height: { height }, width: { width }, my: 1, borderRadius: '16px' }}>
        <NImage style={style ? style : { borderRadius: '16px' }} height={height} width={width} src={image} alt={title} placeholder='blur' priority={priority} />
      </Box>
    </>
  )
}

export default StaticImage
