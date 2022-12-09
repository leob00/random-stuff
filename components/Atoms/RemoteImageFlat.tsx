import React from 'react'
import NImage from 'next/legacy/image'
import { Box } from '@mui/material'

const RemoteImageFlat = ({
  url,
  title,
  width = 360,
  height = 360,
  className,
  onLoaded,
  onClicked,
}: {
  url: string
  title: string
  width?: number
  height?: number
  className?: string
  onLoaded?: () => void
  onClicked?: () => void
}) => {
  const handleLoaded = () => {
    if (onLoaded) {
      onLoaded()
    }
  }
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <Box sx={{ p: 2, zIndex: -1 }}>
      <NImage
        src={url}
        alt={title}
        placeholder='blur'
        blurDataURL={url}
        className={className ?? ''}
        width={width}
        height={height}
        onLoad={handleLoaded}
        onClick={handleClick}
        style={{ zIndex: 1 }}
      />
    </Box>
  )
}

export default RemoteImageFlat
