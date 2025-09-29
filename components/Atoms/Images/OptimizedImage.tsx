import { Box, Breakpoint, Stack } from '@mui/material'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { ImageSize } from 'lib/backend/files/fileTypes'
import { calculatePercent } from 'lib/util/numberUtil'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'

const OptimizedImage = ({ url, title }: { url: string; title: string }) => {
  //const imageRef = React.useRef<HTMLImageElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [calcImageWidth, setCalcImageWidth] = useState<number | string | null>(null)
  const { windowWidth, viewPortSize } = useViewPortSize()

  const handleImageLoaded = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const calcWidth = resizeImage(e.currentTarget.naturalWidth, windowWidth, viewPortSize)
    setCalcImageWidth(calcWidth)
  }

  useEffect(() => {
    if (imageRef.current) {
      setCalcImageWidth(resizeImage(imageRef.current.naturalWidth, windowWidth, viewPortSize))
    }
  }, [viewPortSize])

  return (
    <>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Box textAlign={'center'} width={calcImageWidth ?? 350}>
          <img
            ref={imageRef}
            src={url}
            width={calcImageWidth ?? 350}
            alt={title}
            onLoad={handleImageLoaded}
            style={{ borderRadius: '16px', display: calcImageWidth === null ? 'none' : 'unset', objectFit: 'contain' }}
          />
        </Box>

        {/* <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'unset' } }}>
          <img
            ref={imageRef}
            //height={calcSize?.height}
            width={800}
            src={url}
            alt={title}
            onLoad={(e) => {
              handleImageLoaded
            }}
            style={{ borderRadius: '16px' }}
          />
        </Box>
        <Box sx={{ display: { xs: 'unset', sm: 'unset', md: 'unset', lg: 'none' } }}>
          <img ref={imageRef} src={url} width={350} alt={title} onLoad={handleImageLoaded} style={{ borderRadius: '16px' }} />
        </Box> */}
      </Stack>
    </>
  )
}

function resizeImage(imageWidth: number, windowWidth: number, viewPortSize: Breakpoint) {
  console.log('Natural Width:', imageWidth)
  console.log('Window Width:', windowWidth)
  let calcWidth: number | string = imageWidth
  if (imageWidth >= windowWidth) {
    switch (viewPortSize) {
      case 'xs':
        calcWidth = '96%'
        break
      case 'sm':
        calcWidth = '92%'
        break
      case 'md':
        calcWidth = '88%'
        break
      case 'lg':
        calcWidth = '84%'
        break
      case 'xl':
        calcWidth = '80%'
        break
    }
  } else {
    const percentOfWindow = calculatePercent(imageWidth, windowWidth)
    console.log('percentOfWindow: ', percentOfWindow)
    if (percentOfWindow >= 80) {
      calcWidth = windowWidth / 2
    }

    switch (viewPortSize) {
      case 'xl':
        if (percentOfWindow >= 80) {
          calcWidth = windowWidth / 2
        }
        break
    }
  }
  return calcWidth
}

export default OptimizedImage
