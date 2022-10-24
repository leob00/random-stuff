import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material'
import { getRandomLoadertext } from 'lib/randomLoaderText'
import React, { useEffect, useReducer } from 'react'
import { Model, warmupReducer } from 'lib/reducers/warmupReducer'
import CenterStack from './CenterStack'

const WarmupBox = ({ text }: { text?: string }) => {
  const defaultModel: Model = {
    message: getRandomLoadertext(),
  }
  const [model, dispatch] = useReducer(warmupReducer, defaultModel)
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    if (text) {
      return
    }
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'refresh', payload: { message: getRandomLoadertext() } })
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 2500)

    //const interval = setInterval(() => {}, 2000)

    //return clearInterval(interval)
  }, [])
  return (
    <Container sx={{}}>
      <Box sx={{ py: 2 }}>
        <CenterStack>
          <Typography variant='body2' sx={{}}>
            {text ? text : `${model.message}...`}
          </Typography>
        </CenterStack>
      </Box>
      <Box sx={{ py: 2 }}>
        <Stack direction='row' justifyContent='center' sx={{ my: 1 }}>
          <CircularProgress color='secondary' />
        </Stack>
      </Box>
    </Container>
  )
}

export default WarmupBox
