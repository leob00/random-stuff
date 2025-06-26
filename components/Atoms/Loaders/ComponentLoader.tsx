'use client'

import { Box, BoxProps } from '@mui/material'

const ComponentLoader = ({ ...props }: BoxProps) => {
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box {...props} sx={{ margin: 'auto', position: 'absolute', marginLeft: 'auto', marginRight: 'auto' }} height={300}>
        <img src={'/images/loaders/dots.svg'} alt='compoenet loader' />
      </Box>
    </Box>
  )
}

export default ComponentLoader
