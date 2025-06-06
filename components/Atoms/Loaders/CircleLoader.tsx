'use client'
import { Box } from '@mui/material'

const CircleLoader = () => {
  return (
    <Box display={'flex'} mt={-10} justifyContent={'center'}>
      <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
      <img src={'/images/loaders/blue-ring-expanded-delayed.svg'} alt='loader' />
      <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
    </Box>
  )
}

export default CircleLoader
