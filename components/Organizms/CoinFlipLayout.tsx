import { Box, Container, getInputAdornmentUtilityClass, Typography } from '@mui/material'
import axios from 'axios'
import CenterStack from 'components/Atoms/CenterStack'
import ImageYRotator from 'components/Atoms/Images/ImageYRotator'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import CoinFlipChart from 'components/Molecules/CoinFlipChart'
import { TransparentGreen, TransparentBlue } from 'components/themes/mainTheme'
import { CoinFlipStats } from 'lib/backend/api/aws/apiGateway'
import { getRandomInteger } from 'lib/util/numberUtil'
import { cloneDeep, shuffle } from 'lodash'
import React from 'react'

type headsTails = 'heads' | 'tails'
const barChartColors = [TransparentGreen, TransparentBlue]
const barChartLabels = ['heads', 'tails']

export interface Coin {
  face: headsTails
  imageUrl: string
}

const getImage = (face: headsTails) => {
  switch (face) {
    case 'heads':
      return '/images/penny-heads.png'
    case 'tails':
      return '/images/penny-tails.png'
  }
}

interface Model {
  defaultState?: boolean
  isLoading?: boolean
  flippedCoin?: Coin
  allCoins: Coin[]
  runningChart?: BarChart
  coinflipStats?: CoinFlipStats
  communityChart?: BarChart
  currentFace: Coin
}

type ActionTypes = 'toss' | 'flipped' | 'update-community-stats' | 'default'

interface ActionType {
  type: ActionTypes
  payload: Model
}

function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'default':
      return { ...state, defaultState: true, currentFace: action.payload.currentFace, isLoading: false, flippedCoin: undefined }
    case 'toss':
      return {
        ...state,
        allCoins: action.payload.allCoins,
        isLoading: true,
        flippedCoin: undefined,
        defaultState: false,
        currentFace: action.payload.currentFace,
      }
    case 'flipped':
      let currentState = { ...state }
      if (currentState.runningChart && currentState.coinflipStats) {
        switch (action.payload.flippedCoin?.face) {
          case 'heads':
            currentState.runningChart.numbers[0] = currentState.runningChart.numbers[0] + 1
            currentState.coinflipStats.heads += 1
            break
          case 'tails':
            currentState.runningChart.numbers[1] = currentState.runningChart.numbers[1] + 1
            currentState.coinflipStats.tails += 1
            break
          default:
            break
        }
      }
      return {
        ...state,
        allCoins: action.payload.allCoins,
        isLoading: false,
        flippedCoin: action.payload.flippedCoin,
        runningChart: currentState.runningChart,
        coinflipStats: currentState.coinflipStats,
        defaultState: false,
      }
    case 'update-community-stats': {
      let chart: BarChart = {
        labels: ['heads', 'tails'],
        numbers: [action.payload.coinflipStats?.heads as number, action.payload.coinflipStats?.tails as number],
        colors: barChartColors,
      }
      return { ...state, coinflipStats: action.payload.coinflipStats, communityChart: chart }
    }
    default:
      return action.payload
  }
}
const CoinFlipLayout = ({ coinflipStats }: { coinflipStats: CoinFlipStats }) => {
  const defaultStateIntervalRef = React.useRef<NodeJS.Timer | null>(null)
  const coins: Coin[] = [
    {
      face: 'heads',
      imageUrl: '/images/penny-heads.png',
    },
    {
      face: 'tails',
      imageUrl: '/images/penny-tails.png',
    },
  ]

  const initialState: Model = {
    isLoading: false,
    defaultState: true,
    currentFace: shuffle(coins)[0],
    allCoins: coins,
    runningChart: {
      labels: barChartLabels,
      numbers: [0, 0],
      colors: barChartColors,
    },
    coinflipStats: coinflipStats,
    communityChart: {
      labels: barChartLabels,
      numbers: [coinflipStats.heads, coinflipStats.tails],
      colors: barChartColors,
    },
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)

  const handleFlipClick = async () => {
    let allCoins = cloneDeep(model.allCoins)
    let shuffled = shuffle(allCoins)
    dispatch({
      type: 'toss',
      payload: {
        currentFace: shuffled[0],
        allCoins: shuffled,
        flippedCoin: undefined,
        isLoading: true,
      },
    })
    const iterations = getRandomInteger(100, 150)
    for (let i = 0; i <= iterations; i++) {
      shuffled = shuffle(shuffled)
    }
    const flipped = shuffled[0]
    let coinStats = cloneDeep(model.coinflipStats)!
    if (flipped.face === 'heads') {
      coinStats.heads += 1
    }
    if (flipped.face === 'tails') {
      coinStats.tails += 1
    }

    const postFn = async () => {
      let result = (await (await axios.put('/api/incrementCoinFlip', flipped)).data) as CoinFlipStats
      dispatch({
        type: 'update-community-stats',
        payload: {
          currentFace: flipped,
          allCoins: allCoins,
          coinflipStats: result,
          defaultState: false,
        },
      })
    }

    setTimeout(() => {
      dispatch({
        type: 'flipped',
        payload: {
          currentFace: flipped,
          allCoins: allCoins,
          flippedCoin: flipped,
        },
      })
      postFn()
    }, 3000)
  }

  React.useEffect(() => {
    // console.log('isLoading: ', model.isLoading)
    if (defaultStateIntervalRef.current) {
      clearInterval(defaultStateIntervalRef.current)
    }
    if (model.isLoading) {
      defaultStateIntervalRef.current = setInterval(() => {
        const currentFace: Coin = {
          face: model.currentFace.face,
          imageUrl: model.currentFace.imageUrl,
        }
        if (currentFace.face === 'heads') {
          currentFace.face = 'tails'
          currentFace.imageUrl = getImage('tails')
        } else {
          currentFace.face = 'heads'
          currentFace.imageUrl = getImage('heads')
        }

        dispatch({
          type: 'toss',
          payload: {
            currentFace: currentFace,
            allCoins: model.allCoins,
          },
        })
        // console.log(currentFace)
      }, 300)
    } else {
      if (defaultStateIntervalRef.current) {
        clearInterval(defaultStateIntervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.isLoading, model.currentFace.face])

  return (
    <Container>
      <CenterStack sx={{ minHeight: 100 }}>
        <Box>
          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            This is your chance to flip a coin if you do not have one.
          </Typography>
          <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
            Call out your prediction and press the coin to flip.
          </Typography>
        </Box>
      </CenterStack>
      <CenterStack sx={{ minHeight: 120 }}>
        <Box>
          {model.defaultState && (
            <Box sx={{ cursor: 'pointer' }}>
              <ImageYRotator imageUrl={model.currentFace.imageUrl} height={100} width={100} speed={6} onClicked={handleFlipClick} />
            </Box>
          )}
          {model.isLoading && (
            <>
              <Box>
                <ImageYRotator imageUrl={model.currentFace.imageUrl} height={100} width={100} speed={1} />
              </Box>
            </>
          )}
          {model.flippedCoin && (
            <>
              <Box sx={{ cursor: 'pointer !important' }}>
                <ImageYRotator imageUrl={model.flippedCoin.imageUrl} height={100} width={100} speed={0} onClicked={handleFlipClick} />
              </Box>
              <CenterStack sx={{ minHeight: 36 }}>
                <Box>
                  <Typography variant='h4'>{`${model.flippedCoin.face}!`}</Typography>
                </Box>
              </CenterStack>
            </>
          )}
        </Box>
      </CenterStack>
      {model.runningChart && <CoinFlipChart totalFlips={model.runningChart.numbers[0] + model.runningChart.numbers[1]} chart={model.runningChart} />}
      <CenterStack sx={{ paddingTop: 2 }}>
        <Typography variant='h5'>Community Flips</Typography>
      </CenterStack>
      {model.communityChart && <CoinFlipChart totalFlips={model.communityChart.numbers[0] + model.communityChart.numbers[1]} chart={model.communityChart} />}
    </Container>
  )
}

export default CoinFlipLayout
