import { Box, Stack } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'
import { useRef, useState } from 'react'

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
  //const imageRef = React.useRef<HTMLImageElement | null>(null)
  const hiddenImageRef = useRef<HTMLImageElement | null>(null)
  const [calcSize, setCalcSize] = useState<ImageSize | undefined>(imageSize)

  const handleLoaded = () => {}
  const handleHiddenImageLoaded = () => {
    if (hiddenImageRef.current) {
      const newSize: ImageSize = {
        height: hiddenImageRef.current.naturalHeight > 1000 ? hiddenImageRef.current.naturalHeight / 2 : hiddenImageRef.current.naturalHeight,
        width: hiddenImageRef.current.naturalWidth > 1000 ? hiddenImageRef.current.naturalWidth / 2 : hiddenImageRef.current.naturalWidth,
      }
      setCalcSize(newSize)
      //console.log('newSize: ', newSize)
    }
  }

  return (
    <>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'unset' } }}>
          <img
            ref={hiddenImageRef}
            height={calcSize?.height}
            width={calcSize?.width}
            src={url}
            alt={title}
            onLoad={handleHiddenImageLoaded}
            style={{ borderRadius: '16px' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'unset', sm: 'unset', md: 'unset', lg: 'none' } }}>
          <img ref={hiddenImageRef} src={url} width={350} height={400} alt={title} onLoad={handleHiddenImageLoaded} style={{ borderRadius: '16px' }} />
        </Box>
      </Stack>
    </>
  )
}

export default OptimizedImage
