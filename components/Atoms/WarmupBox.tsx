import { CircularProgress, Container, Stack, Typography } from '@mui/material'
import { getRandomLoadertext } from 'lib/randomLoaderText'
import React, { useEffect, useReducer, useState } from 'react'
import loader from '../../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'
import { ActionType, Model, warmupReducer } from 'lib/reducers/warmupReducer'

const WarmupBox = ({ text }: { text?: string }) => {
  const defaultModel: Model = {
    message: getRandomLoadertext(),
  }
  const [model, dispatch] = useReducer(warmupReducer, defaultModel)

  useEffect(() => {
    //setMessage(getRandomLoadertext())
    //dispatch({ type: 'init' })
    const interval = setInterval(() => {
      dispatch({ type: 'generate' })
    }, 2000)
    return clearInterval(interval)
  }, [model.message])
  return (
    <Container sx={{}}>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Typography variant='body2' sx={{}}>
          {text ? text : `${model.message}...`}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='center' sx={{ my: 1 }}>
        <CircularProgress color='secondary' />
      </Stack>
    </Container>
  )
}

export default WarmupBox
