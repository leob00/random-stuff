import React from 'react'
import NImage from 'next/image'
import { Box } from '@mui/material'

const RemoteImageFlat = ({ url, title, width = 360, height = 360, className, onLoaded }: { url: string; title: string; width?: number; height?: number; className?: string; onLoaded?: () => void }) => {
  //const hght = height ? `${height}px` : '400px'
  //const wdth = width ? `${width}px` : '350px'

  const handleLoaded = () => {
    if (onLoaded) {
      onLoaded()
    }
  }
  return (
    <Box sx={{ p: 2 }}>
      <NImage src={url} alt={title} placeholder='blur' blurDataURL={url} className={className ?? ''} width={width} height={height} onLoad={handleLoaded} />
    </Box>
  )
}

export default RemoteImageFlat
