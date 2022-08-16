import { Box, Stack } from '@mui/material'
import React from 'react'
import loader from '../../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'

const SmallLoader = () => {
  return (
    <Box>
      <NImage src={loader} alt='loading' height={24} width={26} />
    </Box>
  )
}

export default SmallLoader
