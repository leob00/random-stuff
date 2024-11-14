import { Box, Typography } from '@mui/material'
import React from 'react'
import HorizontalDivider from '../Dividers/HorizontalDivider'

const NoDataFound = ({
  message = 'Data is currently unavailable. Please try again later.',
  showDivider = true,
}: {
  message?: string
  showDivider?: boolean
}) => {
  return (
    <>
      <Box p={4} textAlign='center'>
        <Typography variant='caption'>{message}</Typography>
      </Box>
      {showDivider && <HorizontalDivider />}
    </>
  )
}

export default NoDataFound
