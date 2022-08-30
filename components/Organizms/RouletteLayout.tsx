import { Box, Typography } from '@mui/material'
import { display } from '@mui/system'
import axios from 'axios'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { CasinoBlackTransparent, CasinoBlueTransparent, CasinoGrayTransparent, CasinoGreenTransparent, CasinoOrangeTransparent, CasinoRedTransparent, CasinoWhiteTransparent } from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomInteger, isEven, isOdd } from 'lib/util/numberUtil'
import { cloneDeep, filter, range, shuffle } from 'lodash'
import React from 'react'

export interface Model {
  spinSpeed?: number
  wheel?: RouletteWheel
  result?: RouletteNumber
  isSpinning?: boolean
  playerResults?: RouletteNumber[]
  playerChart?: BarChart
  communityChart?: BarChart
  isSimulationRunning?: boolean
}

export type ActionTypes = 'spin' | 'spin-finished' | 'reload-community-stats' | 'start-simulation' | 'stop-simulation' | 'reset' | 'update-simulation'
export interface ActionType {
  type: ActionTypes
  payload: Model
}
let simulationCounter = 0
let simulationPlayerResults: RouletteNumber[] = []
const mapRouletteStatsChart = (red: number, black: number, zero: number, doubleZero: number, odd: number, even: number, total: number) => {
  let communityChart: BarChart = {
    colors: [CasinoRedTransparent, CasinoBlackTransparent, CasinoOrangeTransparent, CasinoBlueTransparent, CasinoGreenTransparent, CasinoGreenTransparent, CasinoGrayTransparent],
    labels: ['red', 'black', 'odd', 'even', '0', '00', 'total'],
    numbers: [red, black, odd, even, zero, doubleZero, total],
  }
  return communityChart
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'spin':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: false }
    case 'spin-finished':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: action.payload.result, isSpinning: false, playerResults: action.payload.playerResults, playerChart: action.payload.playerChart, communityChart: action.payload.communityChart }
    case 'reload-community-stats':
      return { ...state, communityChart: action.payload.communityChart }
    case 'start-simulation':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: true, playerResults: [] }
    case 'update-simulation':
      return { ...state, result: action.payload.result, playerResults: action.payload.playerResults, playerChart: action.payload.playerChart, communityChart: action.payload.communityChart, isSimulationRunning: true }
    case 'stop-simulation':
      return { ...state, spinSpeed: 40, isSpinning: false, isSimulationRunning: false, playerResults: action.payload.playerResults }
    case 'reset':
      return { ...state, spinSpeed: 40, isSpinning: false, isSimulationRunning: false, playerResults: [], result: undefined }
    default:
      return action.payload
  }
}

const RouletteLayout = ({ spinStats }: { spinStats: WheelSpinStats }) => {
  const defaultSpinSpeed = 40
  const loadCommunityStats = async () => {
    let cs = (await (await axios.get('/api/wheelSpin')).data) as WheelSpinStats
    if (cs) {
      const communityChart = mapRouletteStatsChart(cs.red, cs.black, cs.zero, cs.doubleZero, cs.odd, cs.even, cs.total)
      let m = cloneDeep(model)
      m.communityChart = communityChart
      dispatch({
        type: 'reload-community-stats',
        payload: m,
      })
    }
  }

  const initialState: Model = {
    spinSpeed: defaultSpinSpeed,
    wheel: getWheel(),
    isSpinning: false,
    isSimulationRunning: false,
    communityChart: mapRouletteStatsChart(spinStats.red, spinStats.black, spinStats.zero, spinStats.doubleZero, spinStats.odd, spinStats.even, spinStats.total),
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)
  const handleSpinClick = async () => {
    if (model.isSpinning) {
      return
    }
    await handleSpin()
  }

  const shuffleNumbers = async (numbers: RouletteNumber[]) => {
    let result: RouletteNumber[] = []
    let dt = new Date()
    const iterations = getRandomInteger(300, 401) + dt.getSeconds()
    for (let i = 0; i <= iterations; i++) {
      result = shuffle(cloneDeep(numbers))
    }
    return result
  }

  const runSimulation = () => {
    if (simulationCounter >= 100) {
      dispatch({ type: 'stop-simulation', payload: { playerResults: simulationPlayerResults, spinSpeed: defaultSpinSpeed } })
      return
    }
    const spinFn = async () => {
      dispatch({
        type: 'spin',
        payload: { spinSpeed: 5.25 },
      })
      simulationCounter += 1
      let nums = shuffle(cloneDeep(model.wheel?.numbers)!)
      let numbers = await shuffleNumbers(nums)
      let pickedNum = numbers[getRandomInteger(0, 37)]
      simulationPlayerResults.unshift(pickedNum)
      let playerChart = mapPlayerChart(simulationPlayerResults)
      dispatch({
        type: 'update-simulation',
        payload: { result: pickedNum, playerResults: simulationPlayerResults, playerChart: playerChart, communityChart: model.communityChart },
      })
    }

    setTimeout(() => {
      const fn = async () => {
        await spinFn()
        if (simulationCounter > 0 && simulationCounter < 100) {
          runSimulation()
        } else {
          dispatch({ type: 'stop-simulation', payload: { playerResults: simulationPlayerResults, spinSpeed: defaultSpinSpeed } })
        }
      }
      fn()
    }, 50)
  }

  const handleRunSimulation = () => {
    simulationPlayerResults = []
    simulationCounter = 0
    dispatch({
      type: 'start-simulation',
      payload: { spinSpeed: 5.25 },
    })
    setTimeout(() => {
      runSimulation()
    }, 250)
  }

  const mapPlayerChart = (playerResults: RouletteNumber[]) => {
    let redTotal = filter(playerResults, (e) => {
      return e.color === 'red'
    }).length
    let blackTotal = filter(playerResults, (e) => {
      return e.color === 'black'
    }).length
    let zeroTotal = filter(playerResults, (e) => {
      return e.color === 'zero'
    }).length
    let doubleZeroTotal = filter(playerResults, (e) => {
      return e.color === 'doubleZero'
    }).length
    let oddTotal = filter(playerResults, (e) => {
      return e.color !== 'zero' && e.color !== 'doubleZero' && isOdd(parseInt(e.value))
    }).length
    let evenTotal = filter(playerResults, (e) => {
      return e.color !== 'zero' && e.color !== 'doubleZero' && isEven(parseInt(e.value))
    }).length
    let total = playerResults.length

    let playerChart = mapRouletteStatsChart(redTotal, blackTotal, zeroTotal, doubleZeroTotal, oddTotal, evenTotal, total)
    return playerChart
  }

  const handleSpin = async () => {
    simulationCounter = 0
    simulationPlayerResults = []
    if (model.isSimulationRunning) {
      return
    }
    dispatch({
      type: 'spin',
      payload: { spinSpeed: 5.25 },
    })
    let nums = shuffle(cloneDeep(model.wheel?.numbers)!)
    let numbers = await shuffleNumbers(nums)
    let pickedNum = numbers[getRandomInteger(0, 37)]
    let playerResults = model.playerResults ? cloneDeep(model.playerResults) : []
    playerResults.unshift(pickedNum)
    let playerChart = mapPlayerChart(playerResults)

    const updateCommunity = async () => {
      let resp = await axios.post('/api/incrementWheelSpin', pickedNum)
      let data = resp.data as WheelSpinStats
      let communityChart = mapRouletteStatsChart(data.red, data.black, data.zero, data.doubleZero, data.odd, data.even, data.total)
      let m = cloneDeep(model)
      m.communityChart = communityChart
      dispatch({
        type: 'reload-community-stats',
        payload: m,
      })
    }
    let spinTimeout = getRandomInteger(2601, 3999)
    const spin = async () => {
      setTimeout(() => {
        dispatch({
          type: 'spin-finished',
          payload: { spinSpeed: defaultSpinSpeed, result: pickedNum, playerResults: playerResults, playerChart: playerChart, communityChart: model.communityChart },
        })
        updateCommunity()
      }, spinTimeout)
    }
    await spin()
  }

  React.useEffect(() => {
    const communityFn = async () => {
      await loadCommunityStats()
    }
    communityFn()
  }, [])

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={'press the wheel to spin or...'} />
      <CenterStack sx={{ my: 2 }}>
        <PrimaryButton text={model.isSimulationRunning ? 'running...' : 'run simultaion'} isDisabled={false} onClicked={handleRunSimulation} disabled={model.isSimulationRunning} />
      </CenterStack>
      <CenterStack sx={{ minHeight: 280 }}>
        {model.isSpinning ? (
          <ImageSpinner imageUrl={'/images/american-roulette-wheel.png'} speed={model.spinSpeed} width={240} height={240} onClicked={handleSpinClick} clickable={true} />
        ) : (
          <ImageSpinner imageUrl={'/images/american-roulette-wheel.png'} speed={defaultSpinSpeed} width={240} height={240} onClicked={handleSpinClick} clickable={true} />
        )}
      </CenterStack>

      {model.result && (
        <CenterStack sx={{}}>
          <Box
            sx={{
              cursor: 'pointer',
              marginTop: '-100px',
              marginLeft: '2px',
              zIndex: 100,
              position: 'relative',
              height: '100px',
              width: '100px',
              backgroundColor: CasinoWhiteTransparent,
              borderRadius: '50%',
              textAlign: 'center',
              paddingTop: 7,
              fontSize: 60,
              fontWeight: 'bolder',
            }}>
            <Typography sx={{ color: model.result.color === 'black' ? 'black' : translateCasinoColor(model.result.color), marginTop: -5, fontSize: 40, fontWeight: 'bolder' }}>{model.result.value}</Typography>
          </Box>
        </CenterStack>
      )}
      <Box sx={{ my: 1 }}>
        {model.playerResults && !model.isSimulationRunning && (
          <>
            <CenterStack sx={{ my: 1 }}>
              <Typography variant='body1' sx={{}}>{`player results`}</Typography>
            </CenterStack>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {model.playerResults.map((item, index) => (
                <Box key={index}>
                  <CenterStack>
                    <Typography variant='h5' sx={{ color: translateCasinoColor(item.color) }}>
                      {item.value}
                    </Typography>
                  </CenterStack>
                </Box>
              ))}
            </Box>
          </>
        )}
        {model.playerChart && (
          <Box>
            <SimpleBarChart2 title={'Player spins'} barChart={model.playerChart} />
          </Box>
        )}
      </Box>
      {model.communityChart && (
        <Box>
          <SimpleBarChart2 title='Community spins' barChart={model.communityChart} />
        </Box>
      )}
    </Box>
  )
}

export default RouletteLayout
