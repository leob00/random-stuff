import { Box, Container, Typography } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'

const index = () => {
  return (
    <Container>
      <BackToHomeButton />
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <Typography variant='subtitle1'>comming soon</Typography>
        </CenterStack>
      </Box>
    </Container>
  )
}

export default index
