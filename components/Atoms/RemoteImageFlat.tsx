import React from 'react'
import NImage from 'next/image'
import { Box } from '@mui/material'

const RemoteImageFlat = ({ url, title, width = 350, height = 350, style, className, onLoaded }: { url: string; title: string; width?: number; height?: number; style?: React.CSSProperties; className?: string; onLoaded?: () => void }) => {
  //const hght = height ? `${height}px` : '400px'
  //const wdth = width ? `${width}px` : '350px'

  const handleLoaded = () => {
    if (onLoaded) {
      onLoaded()
    }
  }
  return <NImage src={url} alt={title} placeholder='blur' blurDataURL={url} className={className ?? ''} width={width} height={height} onLoad={handleLoaded} />
}

export default RemoteImageFlat
