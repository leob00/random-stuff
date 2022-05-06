import React from 'react'
import Image from 'next/image'
import { Box, Paper, Typography } from '@mui/material'
import Bars from '../public/images/loaders/bars.svg'
import spinner from '../public/images/loaders/green-spinner.gif'
import { maxWidth } from '@mui/system'

const Loader = () => {
  return (
    <Box alignItems='center' sx={{ textAlign: 'center', marginTop: 20 }}>
      <Box sx={{ textAlign: 'center', textSize: 'smaller', backgroundColor: 'white', borderRadius: '.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image src='/images/loaders/black-white-spinner.gif' alt='loading' height={50} width={50} />
      </Box>
    </Box>
  )
}

export default Loader
