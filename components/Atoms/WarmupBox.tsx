import { Container, Stack, Typography } from '@mui/material'
import { getRandomLoadertext } from 'lib/randomLoaderText'
import React, { useEffect, useState } from 'react'
import loader from '../../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'

const WarmupBox = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(getRandomLoadertext())
  }, [])
  return (
    <Container>
      <Stack direction='row' justifyContent='center' sx={{ my: 4 }}>
        <Typography variant='body2' sx={{ paddingRight: 2 }}>
          {message}
        </Typography>
        <NImage src={loader} alt='loading' height={24} width={28} />
      </Stack>
    </Container>
  )
}

export default WarmupBox
