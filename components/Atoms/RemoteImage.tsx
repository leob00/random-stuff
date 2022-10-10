import React from 'react'
import NImage from 'next/image'
import { Box } from '@mui/material'

const RemoteImage = ({ url, title, width = 350, height = 400, style, onLoaded, priority }: { url: string; title: string; width?: number; height?: number; style?: React.CSSProperties; onLoaded?: () => void; priority?: boolean }) => {
  //const hght = height ? `${height}px` : '400px'
  //const wdth = width ? `${width}px` : '350px'

  const handleLoaded = () => {
    if (onLoaded) {
      onLoaded()
    }
  }
  return (
    <>
      <Box sx={{ position: 'relative', height: { height }, width: { width }, padding: '5px', my: 1, borderRadius: '16px' }} className='blue-gradient hoverBox'>
        <NImage style={style ? style : { borderRadius: '16px' }} src={url} alt={title} placeholder='blur' layout='fill' objectFit='cover' blurDataURL={url} className='' onLoad={handleLoaded} priority={priority} />
      </Box>
    </>
  )
}

export default RemoteImage
