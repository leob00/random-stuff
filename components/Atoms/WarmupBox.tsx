import { Backdrop, Box, Paper, Stack, Typography } from '@mui/material'
import { getRandomLoaderText } from 'lib/randomLoaderText'
import React, { useEffect, useReducer } from 'react'
import { Model, warmupReducer } from 'lib/reducers/warmupReducer'
import CenterStack from './CenterStack'
import RollingLinearProgress from './Loaders/RollingLinearProgress'
import { CasinoBlueTransparent, CasinoLightGrayTransparent, VeryLightBlueTransparent, VeryLightTransparent } from 'components/themes/mainTheme'
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
      <Stack>
        <Backdrop sx={{ backgroundColor: VeryLightTransparent, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <img src={'/images/loaders/dots.svg'} />
        </Backdrop>
        <CenterStack>
          <Typography color={'secondary'}>{text ? text : `${model.message}...`}</Typography>
        </CenterStack>
        {/* <Paper elevation={6} sx={{ mt: 1 }}>
          <Box py={2}>
            <Box pt={2}>
              <CenterStack>
                <Typography color={'secondary'}>{text ? text : `${model.message}...`}</Typography>
              </CenterStack>
            </Box>
            <Box>
              
              <CenterStack>
                <RollingLinearProgress width={100} height={25} />
              </CenterStack>
            </Box>
          </Box>
        </Paper> */}
      </Stack>
    </NonSSRWrapper>
  )
}

export default WarmupBox
