import React from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import Puff from '../public/images/loaders/puff.svg'
import Bars from '../public/images/loaders/bars.svg'
import zIndex from '@mui/material/styles/zIndex'

const ImageLoader = () => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Image src='/images/loaders/image-loader.png' alt='loading' height={320} width={320} style={{ borderRadius: '.8rem', zIndex: -99999 }} />
      <Box sx={{ margin: 'auto', backgroundColor: 'gray', borderRadius: '.8rem', maxWidth: '320px', marginTop: '-240px', zIndex: 99999 }}>
        <Bars />
      </Box>
    </Box>
  )
}

export default ImageLoader
