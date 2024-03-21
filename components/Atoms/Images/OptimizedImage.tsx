import React from 'react'
import NImage from 'next/image'
import { Box, Stack } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'

const OptimizedImage = ({
  url,
  title,
  style,
  onLoaded,
  priority,
  imageSize,
}: {
  url: string
  title: string
  style?: React.CSSProperties
  onLoaded?: () => void
  priority?: boolean
  imageSize?: ImageSize
}) => {
  const handleLoaded = () => {
    console.log('height: ', imageRef.current?.naturalHeight)
    console.log('width: ', imageRef.current?.naturalWidth)
    if (imageRef.current) {
      setSize({ height: imageRef.current!.naturalHeight, width: imageRef.current!.naturalHeight })
    }
    if (onLoaded) {
      onLoaded()
    }
  }
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const [size, setSize] = React.useState(imageSize)

  return (
    <>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        {imageSize ? (
          <Box sx={{ position: 'relative', padding: '5px', my: 1, borderRadius: '16px' }} width={imageSize.width} height={imageSize.height}>
            <NImage
              ref={imageRef}
              style={style ? style : { borderRadius: '16px' }}
              src={url}
              alt={title}
              placeholder='blur'
              quality={100}
              blurDataURL={url}
              onLoad={handleLoaded}
              priority={priority}
              fill
              //sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </Box>
        ) : (
          <Box
            sx={{ position: 'relative', padding: '5px', my: 1, borderRadius: '16px' }}
            width={{ xs: 275, lg: imageRef.current?.naturalWidth }}
            height={{ xs: 500, lg: imageRef.current?.naturalHeight }}
          >
            <NImage
              ref={imageRef}
              style={style ? style : { borderRadius: '16px' }}
              src={url}
              alt={title}
              placeholder='blur'
              quality={100}
              blurDataURL={url}
              onLoad={handleLoaded}
              //priority={priority}
              fill
              // sizes='(min-width: 66em) 33vw,(min-width: 44em) 50vw,100vw'
            />
          </Box>
        )}
      </Stack>
    </>
  )
}

export default OptimizedImage
