import { Box, Button, Container, Typography } from '@mui/material'
import axios from 'axios'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import CoinFlipChart from 'components/Molecules/CoinFlipChart'
import { DarkGreen, TransparentGreen, LightBlue, TransparentBlue } from 'components/themes/mainTheme'
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
      return '/images/coin-head.png'
    case 'tails':
      return '/images/coin-tails.png'
  }
}

export interface Model {
  defaultState?: boolean
  isLoading?: boolean
  currentCoinState?: Coin
  flippedCoin?: Coin
  allCoins: Coin[]
  runningChart?: BarChart
  coinflipStats?: CoinFlipStats
  communityChart?: BarChart
}

export type ActionTypes = 'toss' | 'flipped' | 'update-community-stats'

export interface ActionType {
  type: ActionTypes
  payload: Model
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'toss':
      return { ...state, allCoins: action.payload.allCoins, isLoading: true, flippedCoin: undefined, defaultState: false }
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
      return { ...state, allCoins: action.payload.allCoins, isLoading: false, flippedCoin: action.payload.flippedCoin, runningChart: currentState.runningChart, coinflipStats: currentState.coinflipStats }
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
  const coins: Coin[] = [
    {
      face: 'heads',
      imageUrl: getImage('heads'),
    },
    {
      face: 'tails',
      imageUrl: getImage('tails'),
    },
  ]

  const initialState: Model = {
    isLoading: false,
    defaultState: true,
    currentCoinState: shuffle(coins)[0],
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
        currentCoinState: shuffled[0],
        allCoins: shuffled,
      },
    })
    const iterations = getRandomInteger(100, 150)
    for (let i = 0; i <= iterations; i++) {
      shuffled = shuffle(shuffled)
    }
    const flipped = shuffled[0]
    let coinStats = cloneDeep(model.coinflipStats) as CoinFlipStats
    if (flipped.face === 'heads') {
      coinStats.heads += 1
    }
    if (flipped.face === 'tails') {
      coinStats.tails += 1
    }

    const postFn = async () => {
      let result = (await (await axios.put('/api/incrementCoinFlip', flipped)).data) as CoinFlipStats
      console.log(JSON.stringify(result))
      dispatch({
        type: 'update-community-stats',
        payload: {
          allCoins: allCoins,
          coinflipStats: result,
        },
      })
    }

    setTimeout(() => {
      dispatch({
        type: 'flipped',
        payload: {
          allCoins: allCoins,
          flippedCoin: flipped,
        },
      })
      postFn()
    }, 3000)
  }

  return (
    <Container>
      <CenterStack sx={{ minHeight: 100 }}>
        <Box>
          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            This is your chance to flip a coin if you do not have one.
          </Typography>
          <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
            Call out your prediction and click the Flip button.
          </Typography>
        </Box>
      </CenterStack>
      <CenterStack sx={{ minHeight: 120 }}>
        <Box>
          {model.defaultState && (
            <Box>
              <RemoteImageFlat title={model.allCoins[0].face} url={model.allCoins[0].imageUrl} height={100} width={100} />
            </Box>
          )}
          {model.isLoading && <RemoteImageFlat title={model.allCoins[0].face} url={model.allCoins[0].imageUrl} height={100} width={100} className='rotate' />}
          {model.flippedCoin && (
            <Box>
              <RemoteImageFlat title={model.flippedCoin.face} url={model.flippedCoin.imageUrl} height={100} width={100} />
            </Box>
          )}
          <CenterStack sx={{ minHeight: 36 }}>
            {model.flippedCoin && (
              <Box>
                <Typography variant='h4'>{`${model.flippedCoin.face}!`}</Typography>
              </Box>
            )}
          </CenterStack>
        </Box>
      </CenterStack>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleFlipClick} disabled={model.isLoading}>
          Flip
        </Button>
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
