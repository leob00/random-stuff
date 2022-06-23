import React from 'react'
import Image from 'next/image'
import { Stack, Box } from '@mui/material'

const RemoteImage = ({ url, title, width = 350, height = 400 }: { url: string; title: string; width?: number; height?: number }) => {
  const hght = height ? `${height}px` : '400px'
  const wdth = width ? `${width}px` : '350px'

  return (
    <>
      <Box sx={{ position: 'relative', height: hght, width: wdth, padding: '5px', my: 1, borderRadius: '10px' }} className='blue-gradient'>
        <Image style={{ borderRadius: '10px' }} src={url} alt={title} placeholder='blur' layout='fill' objectFit='cover' loading='lazy' blurDataURL={url} />
      </Box>
    </>
  )
}

export default RemoteImage
