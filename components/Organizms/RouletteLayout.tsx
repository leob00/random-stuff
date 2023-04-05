import { Box, LinearProgress, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { ApexBarChartData } from 'components/Molecules/Charts/apex/models/chartModes'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import RouletteBarChart from 'components/Molecules/Charts/RouletteBarChart'
import {
  CasinoBlackTransparent,
  CasinoBlueTransparent,
  CasinoDarkGreenTransparent,
  CasinoGreenTransparent,
  CasinoOrangeTransparent,
  CasinoRedTransparent,
  CasinoWhiteTransparent,
  ChartBackground,
  OceanBlue,
  OceanBlueTransparent,
} from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
import { calculatePercent, getRandomInteger, isEven, isOdd } from 'lib/util/numberUtil'
import { cloneDeep, filter, shuffle } from 'lodash'
import React from 'react'
import numeral from 'numeral'

export interface Model {
  spinSpeed?: number
  wheel?: RouletteWheel
  result?: RouletteNumber
  isSpinning?: boolean
  playerResults?: RouletteNumber[]
  playerChart?: WheelSpinStats
  communityChartOld?: BarChart
  communityApexChart?: ApexBarChartData[]
  isSimulationRunning?: boolean
  communityChart?: WheelSpinStats
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
    colors: [
      CasinoRedTransparent,
      CasinoBlackTransparent,
      CasinoOrangeTransparent,
      CasinoBlueTransparent,
      CasinoDarkGreenTransparent,
      CasinoDarkGreenTransparent,
    ],
    labels: ['red', 'black', 'odd', 'even', '0', '00'],
    // numbers: [red, black, odd, even, zero, doubleZero, total],
    numbers: [
      calculatePercent(red, total),
      calculatePercent(black, total),
      calculatePercent(odd, total),
      calculatePercent(even, total),
      calculatePercent(zero, total),
      calculatePercent(doubleZero, total),
    ],
  }
  return communityChart
}

const mapRouletteStatsApexChart = (red: number, black: number, zero: number, doubleZero: number, odd: number, even: number, total: number) => {
  let result: ApexBarChartData[] = [
    {
      x: 'red',
      fillColor: CasinoRedTransparent,
      y: Number(calculatePercent(red, total).toFixed(1)),
    },
    {
      x: 'black',
      fillColor: CasinoBlackTransparent,
      y: Number(calculatePercent(black, total).toFixed(1)),
    },
    {
      x: 'odd',
      fillColor: CasinoOrangeTransparent,
      y: Number(calculatePercent(odd, total).toFixed(1)),
    },
    {
      x: 'even',
      fillColor: CasinoBlueTransparent,
      y: Number(calculatePercent(even, total).toFixed(1)),
    },
    {
      x: 'zero',
      fillColor: CasinoGreenTransparent,
      y: Number(calculatePercent(zero, total).toFixed(1)),
    },
    {
      x: 'double zero',
      fillColor: CasinoGreenTransparent,
      y: Number(calculatePercent(doubleZero, total).toFixed(1)),
    },

    // {
    //   x: 'total',
    //   fillColor: CasinoGrayTransparent,
    //   y: Number(calculatePercent(total, total).toFixed(0)),
    // },
  ]
  return result
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'spin':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: false }
    case 'spin-finished':
      return {
        ...state,
        spinSpeed: action.payload.spinSpeed,
        result: action.payload.result,
        isSpinning: false,
        playerResults: action.payload.playerResults,
        playerChart: action.payload.playerChart,
        communityChart: action.payload.communityChart,
        communityApexChart: action.payload.communityApexChart,
      }
    case 'reload-community-stats':
      return { ...state, communityChart: action.payload.communityChart, communityApexChart: action.payload.communityApexChart }
    case 'start-simulation':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: true, playerResults: [] }
    case 'update-simulation':
      return {
        ...state,
        result: action.payload.result,
        playerResults: action.payload.playerResults,
        playerChart: action.payload.playerChart,
        communityChart: action.payload.communityChart,
        communityApexChart: action.payload.communityApexChart,
        isSimulationRunning: true,
      }
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
    let cs = await getRecord<WheelSpinStats>('wheelspin-community')
    if (cs) {
      let m = {
        ...model,
        communityChart: cs,
        communityApexChart: mapRouletteStatsApexChart(cs.red, cs.black, cs.zero, cs.doubleZero, cs.odd, cs.even, cs.total),
      }
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
    communityChart: spinStats,
    communityApexChart: mapRouletteStatsApexChart(
      spinStats.red,
      spinStats.black,
      spinStats.zero,
      spinStats.doubleZero,
      spinStats.odd,
      spinStats.even,
      spinStats.total,
    ),
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
    runSimulation()
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

    const stats: WheelSpinStats = {
      black: blackTotal,
      doubleZero: doubleZeroTotal,
      even: evenTotal,
      odd: oddTotal,
      red: redTotal,
      total: total,
      zero: zeroTotal,
    }

    let playerChart = mapRouletteStatsChart(redTotal, blackTotal, zeroTotal, doubleZeroTotal, oddTotal, evenTotal, total)
    return stats
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
      const spinStats = await getRecord<WheelSpinStats>('wheelspin-community')

      switch (pickedNum.color) {
        case 'black':
          spinStats.black += 1
          break
        case 'red':
          spinStats.red += 1
          break
        case 'zero':
          spinStats.zero += 1
          break
        case 'doubleZero':
          spinStats.doubleZero += 1
          break
      }
      if (pickedNum.color !== 'zero' && pickedNum.color !== 'doubleZero') {
        if (isEven(parseInt(pickedNum.value))) {
          spinStats.even += 1
        }
        if (isOdd(parseInt(pickedNum.value))) {
          spinStats.odd += 1
        }
      }
      spinStats.total = spinStats.red + spinStats.black + spinStats.zero + spinStats.doubleZero
      await putRecord('wheelspin-community', 'random', spinStats)
      let communityChart = mapRouletteStatsChart(
        spinStats.red,
        spinStats.black,
        spinStats.zero,
        spinStats.doubleZero,
        spinStats.odd,
        spinStats.even,
        spinStats.total,
      )
      let m = cloneDeep(model)
      m.communityChart = spinStats
      m.communityApexChart = mapRouletteStatsApexChart(
        spinStats.red,
        spinStats.black,
        spinStats.zero,
        spinStats.doubleZero,
        spinStats.odd,
        spinStats.even,
        spinStats.total,
      )
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
          payload: {
            spinSpeed: defaultSpinSpeed,
            result: pickedNum,
            playerResults: playerResults,
            playerChart: playerChart,
            communityChart: model.communityChart,
            communityApexChart: model.communityApexChart,
          },
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
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={'press the wheel to spin or run simulation of 100 turns.'} />
      <Box sx={{ minHeight: 80 }}>
        <CenterStack sx={{ my: 2 }}>
          <SecondaryButton
            text={model.isSimulationRunning ? 'running...' : 'run simultaion'}
            isDisabled={false}
            onClicked={handleRunSimulation}
            disabled={model.isSpinning}
            width={170}
          />
        </CenterStack>
        <CenterStack>
          <Box sx={{ width: '80%', textAlign: 'center' }}>
            <LinearProgress variant='determinate' value={simulationCounter} />
          </Box>
        </CenterStack>
      </Box>
      <CenterStack sx={{ minHeight: 280 }}>
        <ImageSpinner
          imageUrl={'/images/american-roulette-wheel.png'}
          speed={model.isSpinning ? model.spinSpeed : defaultSpinSpeed}
          width={240}
          height={240}
          onClicked={handleSpinClick}
          clickable={true}
        />
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
              backgroundColor: OceanBlue,
              borderRadius: '50%',
              textAlign: 'center',
              paddingTop: 7,
              fontSize: 60,
              fontWeight: 'bolder',
            }}
          >
            <Typography
              variant='h2'
              sx={{
                color: model.result.color === 'black' ? 'black' : translateCasinoColor(model.result.color),
                marginTop: { xs: -3, sm: -4 },
                //fontSize: 40,
                fontWeight: 'bolder',
              }}
            >
              {model.result.value}
            </Typography>
          </Box>
        </CenterStack>
      )}
      <Box sx={{ my: 1 }}>
        {model.playerChart && (
          <Box>
            <RouletteBarChart data={model.playerChart} title={`Player spins: ${numeral(model.playerChart.total).format('###,###')}`} />
          </Box>
        )}
        {model.playerResults && (
          <>
            <CenterStack sx={{ my: 1 }}>
              <Typography variant='body1' sx={{}}>{`player spins`}</Typography>
            </CenterStack>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <Box display={'flex'} gap={1} flexWrap={'wrap'} alignItems={'center'}>
                {model.playerResults.map((item, index) => (
                  <Box key={index} display={'flex'}>
                    <Box
                      bgcolor={ChartBackground}
                      border={index === 0 ? `1px solid ${CasinoBlueTransparent}` : 'unset'}
                      borderRadius={'50%'}
                      p={2}
                      textAlign='center'
                      width={60}
                    >
                      <Typography variant='h5' sx={{ color: translateCasinoColor(item.color) }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
      {/* {model.communityApexChart && (
        <Box>
          <Box py={1}>
            <CenteredHeader title='Community Spins' />
          </Box>
          <ApexVerticalBarchart data={model.communityApexChart} seriesName={''} yAxisDecorator={'%'} />
        </Box>
      )} */}
      {model.communityChart && (
        <Box>
          <RouletteBarChart data={model.communityChart} title={`Community spins: ${numeral(model.communityChart.total).format('###,###')}`} />
        </Box>
      )}
    </Box>
  )
}

export default RouletteLayout
