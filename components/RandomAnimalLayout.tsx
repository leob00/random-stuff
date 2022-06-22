import { Box, Button, Divider, Stack, Typography, Link, Container } from '@mui/material'
import { BasicArticle } from 'lib/model'
import React, { useEffect, useRef, useState } from 'react'
import router from 'next/router'
import { Download } from '@mui/icons-material'
import { getWindowDimensions, isBrowser, WindowDimension } from 'lib/util/system'
import Image from 'next/image'
import RemoteImage from './Atoms/RemoteImage'

const RandomAnimalLayout = ({ data, onRefresh, showNext = true }: { data: BasicArticle; onRefresh?: () => void; showNext?: boolean }) => {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const winDim = getWindowDimensions()
  let width = winDim.width
  const [isMounted, setIsMounted] = useState(false)

  const [imageWidth, setImageWidth] = useState(width)

  const handleNextClick = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  const onImageLoaded = () => {
    //alert('loaded')
    if (!imageRef || !imageRef.current) {
      return
    }
    let h = imageRef.current.height
    let w = imageRef.current.width

    setImageSize(h, w)
  }

  const setImageSize = (height: number, width: number) => {
    if (!imageRef || !imageRef.current) {
      return
    }
    let imageSize: WindowDimension = {
      height: height,
      width: width,
    }
    console.log(`original height: ${height} width: ${width}`)
    const winDim = getWindowDimensions()
    console.log(`window height: ${winDim.height} width: ${winDim.width}`)
    if (imageRef.current.width > winDim.width) {
      let newWidth = width - (width - (winDim.width - 40))
      let newHeight = width - (width - (winDim.width - 10))
      imageRef.current.width = newWidth
      imageRef.current.height = newHeight
      imageSize.height = newHeight
      imageSize.width = newWidth
    }
    console.log(`new height: ${imageRef.current.height} width: ${imageRef.current.width}`)
  }

  useEffect(() => {
    const winDim = getWindowDimensions()
    setImageWidth(winDim.width)
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Box>
        <Button
          variant='text'
          onClick={() => {
            router.push('/')
          }}>
          &#8592; back
        </Button>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
      </Box>
      <Stack direction='row' justifyContent='center' my={2}>
        <RemoteImage url={data.imagePath} title={data.title} />
      </Stack>
      {showNext && (
        <Box sx={{ textAlign: 'center' }}>
          <Button variant='outlined' onClick={handleNextClick}>
            Next
          </Button>
        </Box>
      )}
      <Stack direction='row' justifyContent='center' my={3}>
        <Link href={data.imagePath} target='_blank' download>
          <Download />
        </Link>
      </Stack>
    </>
  )
}

export default RandomAnimalLayout
