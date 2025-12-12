'use client'
import { Box } from '@mui/material'
import { ReactNode } from 'react'

const ResponsiveContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box justifyContent={'center'} minHeight={600}>
      {children}
    </Box>
  )
}

export default ResponsiveContainer
