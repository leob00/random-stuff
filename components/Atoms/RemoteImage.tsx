import React from 'react'
import Image from 'next/image'
import { Stack, Box } from '@mui/material'

const RemoteImage = ({ url, title, width = 350, height = 400 }: { url: string; title: string; width?: number; height?: number }) => {
  const hght = height ? `${height}px` : '400px'
  const wdth = width ? `${width}px` : '350px'

  return (
    <>
      <Box sx={{ position: 'relative', height: hght, width: wdth, padding: '5px', my: 1, borderRadius: '16px' }} className='blue-gradient hoverBox'>
        <Image style={{ borderRadius: '16px' }} src={url} alt={title} placeholder='blur' layout='fill' objectFit='cover' loading='lazy' blurDataURL={url} className='' />
      </Box>
    </>
  )
}

export default RemoteImage
