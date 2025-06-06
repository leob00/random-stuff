'use client'

import { Box } from '@mui/material'

const ComponentLoader = () => {
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box sx={{ margin: 'auto', position: 'absolute', marginLeft: 'auto', marginRight: 'auto' }} height={300} pt={20} pb={20}>
        <img src={'/images/loaders/dots.svg'} alt='compoenet loader' />
      </Box>
    </Box>
  )
}

export default ComponentLoader
