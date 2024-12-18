import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { BarChart } from 'components/Atoms/Charts/chartJs/barChartOptions'
import CoinFlipChart from 'components/Molecules/CoinFlipChart'
import { TransparentGreen, TransparentBlue, CasinoBlue, CasinoOrange, CasinoOrangeTransparent, CasinoBlueTransparent } from 'components/themes/mainTheme'
import { CoinFlipStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getRandomInteger } from 'lib/util/numberUtil'
import { shuffle, sum } from 'lodash'
import { useEffect, useReducer, useRef } from 'react'
import ImageYRotator from 'components/Atoms/Images/ImageYRotator'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import ImageXRotator from 'components/Atoms/Images/ImageXRotator'

type headsTails = 'heads' | 'tails'
const barChartColors = [CasinoOrangeTransparent, CasinoBlueTransparent]
const barChartLabels = ['heads', 'tails']

interface Coin {
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
  allCoins?: Coin[]
  runningChart?: BarChart
  coinflipStats?: CoinFlipStats
  communityChart?: BarChart
  currentFace?: Coin
}

type ActionTypes = 'toss' | 'flipped' | 'update-community-stats' | 'default' | 'animateFlip'

interface ActionType {
  type: ActionTypes
  payload: Model
}

function reducer(state: Model, action: ActionType) {
  switch (action.type) {
    case 'default':
      return { ...state, defaultState: true, currentFace: action.payload.currentFace, isLoading: false, flippedCoin: undefined }
    case 'toss':
      return {
        ...state,
        isLoading: true,
        flippedCoin: undefined,
        defaultState: false,
      }
    case 'animateFlip':
      return {
        ...state,
        flippedCoin: undefined,
        defaultState: false,
        currentFace: action.payload.currentFace,
      }
    case 'flipped':
      const runningChart = { ...state.runningChart! }
      let heads = runningChart.numbers[0]
      let tails = runningChart.numbers[1]

      if (runningChart) {
        switch (action.payload.flippedCoin?.face) {
          case 'heads':
            heads = heads + 1
            break
          case 'tails':
            tails = tails + 1
            break
          default:
            break
        }
        runningChart.numbers = [heads, tails]
      }
      const chart: BarChart = {
        labels: ['heads', 'tails'],
        numbers: [action.payload.coinflipStats?.heads ?? 0, action.payload.coinflipStats?.tails ?? 0],
        colors: barChartColors,
      }
      return {
        ...state,
        allCoins: action.payload.allCoins,
        isLoading: false,
        flippedCoin: action.payload.flippedCoin,
        runningChart: runningChart,
        defaultState: false,
        coinflipStats: action.payload.coinflipStats,
        communityChart: chart,
      }
    case 'update-community-stats': {
      const chart: BarChart = {
        labels: ['heads', 'tails'],
        numbers: [action.payload.coinflipStats?.heads ?? 0, action.payload.coinflipStats?.tails ?? 0],
        colors: barChartColors,
      }
      return { ...state, coinflipStats: action.payload.coinflipStats, communityChart: chart }
    }
    default:
      return action.payload
  }
}
const CoinFlipLayout = ({ coinflipStats }: { coinflipStats: CoinFlipStats }) => {
  const defaultStateIntervalRef = useRef<NodeJS.Timer | null>(null)
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

  const [model, dispatch] = useReducer(reducer, initialState)

  const handleFlipClick = async () => {
    let allCoins = [...(model.allCoins ?? [])]
    dispatch({
      type: 'toss',
      payload: {
        flippedCoin: undefined,
        isLoading: true,
        allCoins: allCoins,
        currentFace: undefined,
      },
    })
    const dbResult = await getRecord<CoinFlipStats>('coinflip-community')
    const iterations = getRandomInteger(100, 150)
    let shuffled = shuffle(allCoins)
    for (let i = 0; i <= iterations; i++) {
      shuffled = shuffle(shuffled)
    }
    const flipped = shuffled[0]
    const postFn = async () => {
      switch (flipped.face) {
        case 'heads':
          dbResult.heads++
          break
        case 'tails':
          dbResult.tails++
          break
      }

      putRecord('coinflip-community', 'random', dbResult)

      dispatch({
        type: 'flipped',
        payload: {
          currentFace: flipped,
          allCoins: allCoins,
          coinflipStats: dbResult,
          defaultState: false,
          flippedCoin: flipped,
          isLoading: false,
        },
      })
    }

    setTimeout(() => {
      postFn()
    }, 3000)
  }

  useEffect(() => {
    if (defaultStateIntervalRef.current) {
      clearInterval(defaultStateIntervalRef.current)
    }
    if (model.isLoading) {
      defaultStateIntervalRef.current = setInterval(() => {
        const currentFace: Coin = {
          face: model.currentFace?.face ?? 'heads',
          imageUrl: model.currentFace?.imageUrl ?? getImage('heads'),
        }
        if (currentFace.face === 'heads') {
          currentFace.face = 'tails'
          currentFace.imageUrl = getImage('tails')
        } else {
          currentFace.face = 'heads'
          currentFace.imageUrl = getImage('heads')
        }

        dispatch({
          type: 'animateFlip',
          payload: {
            currentFace: currentFace,
            allCoins: model.allCoins,
          },
        })
      }, 100)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.isLoading, model.currentFace?.face])

  return (
    <Box>
      <CenterStack sx={{ minHeight: 100 }}>
        <Box>
          <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
            {model.isLoading ? 'flipping...' : 'Call out your prediction and press the coin to flip.'}
          </Typography>
        </Box>
      </CenterStack>
      <Box py={2} minHeight={320}>
        {model.defaultState && (
          <Box sx={{ cursor: 'pointer' }}>
            <ImageYRotator imageUrl={model.currentFace?.imageUrl ?? getImage('heads')} height={200} width={200} onClicked={handleFlipClick} clickable />
          </Box>
        )}
        {model.isLoading && (
          <Box>
            <Box display={'flex'} justifyContent={'center'}>
              <ImageXRotator
                imageUrl={model.currentFace?.imageUrl ?? getImage('heads')}
                duration={0.25}
                height={200}
                width={200}
                onClicked={handleFlipClick}
                clickable
              />
            </Box>
            <CenterStack>
              <Box pt={2}>
                <Typography variant='caption'>{`flipping...`}</Typography>
              </Box>
            </CenterStack>
          </Box>
        )}
        <Box py={2}>
          {model.flippedCoin && (
            <Box>
              <Box sx={{ cursor: 'pointer !important' }}>
                <ImageYRotator imageUrl={model.flippedCoin.imageUrl} height={200} width={200} duration={35} onClicked={handleFlipClick} clickable />
              </Box>
              <CenterStack sx={{ minHeight: 36 }}>
                <Box pt={2}>
                  <Typography variant='h3'>{`${model.flippedCoin.face}!`}</Typography>
                </Box>
              </CenterStack>
            </Box>
          )}
        </Box>
      </Box>
      {model.runningChart && (
        <Box pt={2}>
          <CoinFlipChart totalFlips={sum(model.runningChart.numbers)} chart={model.runningChart} />
        </Box>
      )}
      <Box pt={4}>
        <CenterStack sx={{ paddingTop: 2 }}>
          <Typography variant='h5'>Community Flips</Typography>
        </CenterStack>
        {model.communityChart && <CoinFlipChart totalFlips={sum(model.communityChart.numbers)} chart={model.communityChart} />}
      </Box>
    </Box>
  )
}

export default CoinFlipLayout
