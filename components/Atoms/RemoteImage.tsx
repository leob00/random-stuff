import React from 'react'
import NImage from 'next/image'
import { Box, Paper } from '@mui/material'
import FadeIn from './Animations/FadeIn'

const RemoteImage = ({
  url,
  title,
  width = 350,
  height = 400,
  style,
  onLoaded,
  priority,
}: {
  url: string
  title: string
  width?: number
  height?: number
  style?: React.CSSProperties
  onLoaded?: () => void
  priority?: boolean
}) => {
  const handleLoaded = () => {
    if (onLoaded) {
      onLoaded()
    }
  }
  return (
    <>
      <Paper sx={{ position: 'relative', width: width, height: height, borderRadius: '16px' }} elevation={4}>
        <NImage
          style={style ? style : { borderRadius: '16px', objectFit: 'cover' }}
          src={url}
          alt={title}
          placeholder='blur'
          height={height}
          width={width}
          blurDataURL={url}
          onLoad={handleLoaded}
          sizes='100vw'
        />
      </Paper>
    </>
  )
}

export default RemoteImage
