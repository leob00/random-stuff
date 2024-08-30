import React from 'react'
import NImage from 'next/image'
import { Box } from '@mui/material'

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
      <Box sx={{ position: 'relative', height: { height }, width: { width }, borderRadius: '16px' }}>
        <NImage
          style={style ? style : { borderRadius: '16px' }}
          src={url}
          alt={title}
          placeholder='blur'
          //height={height}
          //width={width}
          blurDataURL={url}
          onLoad={handleLoaded}
          fill
          //sizes='100'
        />
      </Box>
    </>
  )
}

export default RemoteImage
