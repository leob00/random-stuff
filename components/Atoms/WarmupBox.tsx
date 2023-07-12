import { Backdrop, Box, Paper, Stack, Typography } from '@mui/material'
import { getRandomLoaderText } from 'lib/randomLoaderText'
import React, { useEffect, useReducer } from 'react'
import { Model, warmupReducer } from 'lib/reducers/warmupReducer'
import CenterStack from './CenterStack'
import RollingLinearProgress from './Loaders/RollingLinearProgress'
import { CasinoBlueTransparent, CasinoLightGrayTransparent, VeryLightBlueTransparent, VeryLightTransparent } from 'components/themes/mainTheme'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import BackdropLoader from './Loaders/BackdropLoader'

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
    <NonSSRWrapper>
      <BackdropLoader />
      <Box pt={1}>
        <CenterStack>
          <Typography variant='body1' color={'secondary'}>
            {text ? text : `${model.message}...`}
          </Typography>
        </CenterStack>
      </Box>
    </NonSSRWrapper>
  )
}

export default WarmupBox
