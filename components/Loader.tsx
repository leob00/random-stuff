import React from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import puff from '../public/images/loaders/puff.svg'

const Loader = () => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Image src='/images/loaders/green-spinner.gif' alt='loading' width={50} height={50} />
    </Box>
  )
}

export default Loader
