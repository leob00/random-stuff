import { Box, CircularProgress, Container, LinearProgress, Stack, Typography } from '@mui/material'
import { getRandomLoaderText } from 'lib/randomLoaderText'
import React, { useEffect, useReducer } from 'react'
import { Model, warmupReducer } from 'lib/reducers/warmupReducer'
import CenterStack from './CenterStack'
import RollingLinearProgress from './Loaders/RollingLinearProgress'

const WarmupBox = ({ text }: { text?: string }) => {
  const defaultModel: Model = {
    message: text ?? getRandomLoaderText(),
  }
  const [model, dispatch] = useReducer(warmupReducer, defaultModel)
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)

  useEffect(() => {
    if (text) {
      return
    }
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'refresh', payload: { message: getRandomLoaderText() } })
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 2500)
  }, [model.message, text])
  return (
    <Box sx={{}}>
      <Box sx={{ py: 1 }}>
        <CenterStack>
          <Typography variant='body2' sx={{}}>
            {text ? text : `${model.message}...`}
          </Typography>
        </CenterStack>
      </Box>
      <Box sx={{ py: 1 }}>
        <CenterStack>
          <RollingLinearProgress width={100} height={25} />
        </CenterStack>
      </Box>
    </Box>
  )
}

export default WarmupBox
