import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

const ResponsiveContainer = ({ children }: { children: ReactNode }) => {
  return (
    // <Box paddingLeft={{ xs: 1, sm: 4, md: 20, lg: 28, xl: 34 }} maxWidth={{ xs: '100%', md: '80%' }}>
    <Box justifyContent={'center'} maxWidth={{ xs: '100%', md: '92%', lg: '100%' }} paddingLeft={{ xs: 0, sm: 2, md: 3, lg: 4, xl: 2 }}>
      {children}
    </Box>
  )
}

export default ResponsiveContainer
