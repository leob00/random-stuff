import React from 'react'
import NImage from 'next/image'
import { Box, Stack } from '@mui/material'

const OptimizedImage = ({
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
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Box sx={{ position: 'relative', height: { height }, width: { width }, padding: '5px', my: 1, borderRadius: '16px' }}>
          <NImage
            style={style ? style : { borderRadius: '16px' }}
            src={url}
            alt={title}
            placeholder='blur'
            width={width}
            height={height}
            //layout='fill'
            //objectFit='cover'
            blurDataURL={url}
            //className=''
            onLoad={handleLoaded}
            priority={priority}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </Box>
      </Stack>
    </>
  )
}

export default OptimizedImage
