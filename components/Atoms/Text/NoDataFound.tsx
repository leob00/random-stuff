import { Box, Typography } from '@mui/material'
import React from 'react'

const NoDataFound = ({ message = 'Data is currently unavailable. Please try again later.' }: { message?: string }) => {
  return (
    <Box p={4} textAlign='center'>
      <Typography>{message}</Typography>
    </Box>
  )
}

export default NoDataFound
