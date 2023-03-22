import { Box, Typography } from '@mui/material'
import { getRandomLoaderText } from 'lib/randomLoaderText'
import React, { useEffect, useReducer } from 'react'
import { Model, warmupReducer } from 'lib/reducers/warmupReducer'
import CenterStack from './CenterStack'
import RollingLinearProgress from './Loaders/RollingLinearProgress'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'

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
      <Box sx={{ border: `1px solid ${CasinoBlueTransparent}` }} borderRadius={'10px'} py={2}>
        <Box sx={{ pt: 2 }}>
          <CenterStack>
            <Typography variant='h5'>{text ? text : `${model.message}...`}</Typography>
          </CenterStack>
        </Box>
        <Box pb={2}>
          <CenterStack>
            <RollingLinearProgress width={100} height={25} />
          </CenterStack>
        </Box>
      </Box>
    </NonSSRWrapper>
  )
}

export default WarmupBox
