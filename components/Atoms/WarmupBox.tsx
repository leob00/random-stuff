import { Container, Stack, Typography } from '@mui/material'
import { getRandomLoadertext } from 'lib/randomLoaderText'
import React from 'react'
import loader from '../../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'

const WarmupBox = () => {
  return (
    <Container>
      <Stack direction='row' justifyContent='center' sx={{ my: 8 }}>
        <Typography variant='h6'>{getRandomLoadertext()}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='center' sx={{ my: 8 }}>
        <NImage src={loader} alt='loading' height={50} width={50} />
      </Stack>
    </Container>
  )
}

export default WarmupBox
