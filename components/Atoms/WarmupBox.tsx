import { Container, Stack, Typography } from '@mui/material'
import { getRandomLoadertext } from 'lib/randomLoaderText'
import React from 'react'
import loader from '../../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'

const WarmupBox = () => {
  return (
    <Container sx={{}}>
      <Stack direction='row' justifyContent='center' sx={{ my: 4, position: 'relative', marginTop: 16 }}>
        <Typography variant='body2' sx={{ paddingRight: 2 }}>
          {getRandomLoadertext()}
        </Typography>
        <NImage src={loader} alt='loading' height={20} width={20} />
      </Stack>
    </Container>
  )
}

export default WarmupBox
