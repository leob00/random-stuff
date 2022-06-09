import * as React from 'react'
import { Box, Container, Divider, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Container>
      <Container>
        <Box sx={{ minHeight: 60, my: 2 }}>
          <Divider />
          <Typography sx={{ fontSize: 'small', paddingTop: 2 }}>©{new Date().getFullYear()} Random Stuff</Typography>
        </Box>
      </Container>
    </Container>
  )
}

export default Footer
