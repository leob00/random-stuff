import * as React from 'react'
import { Box, Container, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Container>
      <Box className='blue-gradient'>
        <Container sx={{ color: 'whitesmoke' }}>
          <Box sx={{ minHeight: 60, paddingTop: 2 }}>
            <Typography sx={{ fontSize: 'small' }}>©{new Date().getFullYear()} Random Stuff</Typography>
          </Box>
        </Container>
      </Box>
    </Container>
  )
}

export default Footer
