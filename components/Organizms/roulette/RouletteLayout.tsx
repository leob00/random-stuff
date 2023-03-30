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
  wheel: RouletteWheel
  result?: RouletteNumber
  isSpinning: boolean
  playerResults: RouletteNumber[]
  playerChart?: WheelSpinStats
  communityChartOld?: BarChart
  communityApexChart?: ApexBarChartData[]
  isSimulationRunning?: boolean
  communityChart?: WheelSpinStats
  simulationCounter: number
  simulationPlayerResults: RouletteNumber[]
}

// export type ActionTypes = 'spin' | 'spin-finished' | 'reload-community-stats' | 'start-simulation' | 'stop-simulation' | 'reset' | 'update-simulation'
// export interface ActionType {
//   type: ActionTypes
//   payload: Model
// }
// let simulationCounter = 0
// let simulationPlayerResults: RouletteNumber[] = []
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

// export function reducer(state: Model, action: ActionType): Model {
//   switch (action.type) {
//     case 'spin':
//       return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: false }
//     case 'spin-finished':
//       return {
//         ...state,
//         spinSpeed: action.payload.spinSpeed,
//         result: action.payload.result,
//         isSpinning: false,
//         playerResults: action.payload.playerResults,
//         playerChart: action.payload.playerChart,
//         communityChart: action.payload.communityChart,
//         communityApexChart: action.payload.communityApexChart,
//       }
//     case 'reload-community-stats':
//       return { ...state, communityChart: action.payload.communityChart, communityApexChart: action.payload.communityApexChart }
//     case 'start-simulation':
//       return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true, isSimulationRunning: true, playerResults: [] }
//     case 'update-simulation':
//       return {
//         ...state,
//         result: action.payload.result,
//         playerResults: action.payload.playerResults,
//         playerChart: action.payload.playerChart,
//         communityChart: action.payload.communityChart,
//         communityApexChart: action.payload.communityApexChart,
//         isSimulationRunning: true,
//       }
//     case 'stop-simulation':
//       return { ...state, spinSpeed: 40, isSpinning: false, isSimulationRunning: false, playerResults: action.payload.playerResults }
//     case 'reset':
//       return { ...state, spinSpeed: 40, isSpinning: false, isSimulationRunning: false, playerResults: [], result: undefined }
//     default:
//       return action.payload
//   }
// }

const RouletteLayout = ({ spinStats }: { spinStats: WheelSpinStats }) => {
  const defaultSpinSpeed = 40
  const simulationSpinMax = 100
  const defaultModel: Model = {
    simulationCounter: 0,
    simulationPlayerResults: [],
    wheel: getWheel(),
    playerResults: [],
    communityChart: spinStats,
    isSpinning: false,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)
  const loadCommunityStats = async () => {
    let cs = await getRecord<WheelSpinStats>('wheelspin-community')
    if (cs) {
      let m = {
        ...model,
        communityChart: cs,
        communityApexChart: mapRouletteStatsApexChart(cs.red, cs.black, cs.zero, cs.doubleZero, cs.odd, cs.even, cs.total),
      }
      setModel(m)
      // dispatch({
      //   type: 'reload-community-stats',
      //   payload: m,
      // })
    }
  }

  // const initialState: Model = {
  //   spinSpeed: defaultSpinSpeed,
  //   wheel: getWheel(),
  //   isSpinning: false,
  //   isSimulationRunning: false,
  //   communityChart: spinStats,
  //   communityApexChart: mapRouletteStatsApexChart(
  //     spinStats.red,
  //     spinStats.black,
  //     spinStats.zero,
  //     spinStats.doubleZero,
  //     spinStats.odd,
  //     spinStats.even,
  //     spinStats.total,
  //   ),
  // }

  // const [model, dispatch] = React.useReducer(reducer, initialState)
  const shuffleNumbers = (numbers: RouletteNumber[]) => {
    let result: RouletteNumber[] = []
    let dt = new Date()
    const iterations = getRandomInteger(300, 401) + dt.getSeconds()
    const clone = cloneDeep(numbers)
    for (let i = 0; i <= iterations; i++) {
      result = shuffle(clone)
    }
    return result
  }
  const getSpinResult = () => {
    let nums = shuffle(cloneDeep(model.wheel.numbers))
    let numbers = shuffleNumbers(nums)
    let pickedNum = numbers[getRandomInteger(0, 37)]
    return pickedNum
  }

  const handleSpinClick = async () => {
    if (model.isSpinning) {
      return
    }
    await handleSpin()
  }

  // const spinFn = async () => {
  //   let counter = { ...model }.simulationCounter
  //   if (counter >= 100) {
  //     return 100
  //   }
  //   let nums = shuffle(cloneDeep(model.wheel?.numbers)!)
  //   let numbers = shuffleNumbers(nums)
  //   let pickedNum = numbers[getRandomInteger(0, 37)]
  //   const playerResults = { ...model }.playerResults
  //   counter = counter + 1

  //   //newModel.playerChart = mapPlayerChart(newModel.simulationPlayerResults)
  //   //setModel(newModel)
  //   setModel({
  //     ...model,
  //     spinSpeed: 5.25,
  //     result: pickedNum,
  //     isSimulationRunning: true,
  //     isSpinning: true,
  //     playerChart: mapPlayerChart(playerResults),
  //     simulationCounter: counter,
  //   })
  //   return counter
  // }
  // const runSimulation = () => {
  //   let counter = { ...model }.simulationCounter
  //   if (counter >= 100) {
  //     //dispatch({ type: 'stop-simulation', payload: { playerResults: simulationPlayerResults, spinSpeed: defaultSpinSpeed } })
  //     setModel({ ...model, isSimulationRunning: false, spinSpeed: defaultSpinSpeed, isSpinning: false, simulationCounter: 100 })
  //     return
  //   }

  //   setTimeout(() => {
  //     const fn = async () => {
  //       const counter = await spinFn()
  //       console.log('counter: ', counter)
  //       if (counter > 0 && counter < 100) {
  //         runSimulation()
  //       } else {
  //         //dispatch({ type: 'stop-simulation', payload: { playerResults: simulationPlayerResults, spinSpeed: defaultSpinSpeed } })
  //         setModel({ ...model, isSimulationRunning: false, spinSpeed: defaultSpinSpeed, isSpinning: false, simulationCounter: 100 })
  //       }
  //     }
  //     fn()
  //   }, 50)
  // }

  const handleRunSimulation = () => {
    if (model.isSpinning) {
      return
    }
    setModel({
      ...model,
      isSpinning: true,
      spinSpeed: 5.25,
      isSimulationRunning: true,
      simulationCounter: 0,
      simulationPlayerResults: [],
      playerResults: [],
      result: undefined,
    })

    const spins: RouletteNumber[] = []
    for (let index = 0; index < simulationSpinMax; index++) {
      const spin = getSpinResult()
      spins.unshift(spin)
    }
    setTimeout(() => {
      setModel({
        ...model,
        result: spins[0],
        isSpinning: false,
        spinSpeed: defaultSpinSpeed,
        isSimulationRunning: false,
        simulationCounter: 100,
        simulationPlayerResults: spins,
        playerResults: spins,
        playerChart: mapPlayerChart(spins),
      })
    }, 4000)
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

    //let playerChart = mapRouletteStatsChart(redTotal, blackTotal, zeroTotal, doubleZeroTotal, oddTotal, evenTotal, total)
    return stats
  }
  const finishSpin = async (pickedNum: RouletteNumber, playerResults: RouletteNumber[]) => {
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
    putRecord('wheelspin-community', 'random', spinStats)
    setModel({
      ...model,
      spinSpeed: defaultSpinSpeed,
      isSpinning: false,
      isSimulationRunning: false,
      simulationCounter: 100,
      result: pickedNum,
      playerResults: playerResults,
      playerChart: mapPlayerChart(playerResults),
      communityChart: spinStats,
    })
    return spinStats
  }

  const handleSpin = async () => {
    setModel({
      ...model,
      isSpinning: true,
      isSimulationRunning: false,
      spinSpeed: 5.25,
      simulationCounter: 0,
      simulationPlayerResults: [],
      result: undefined,
    })
    let playerResults = cloneDeep(model).playerResults
    const pickedNum = getSpinResult()
    playerResults.unshift(pickedNum)

    let spinTimeout = getRandomInteger(2601, 3999)
    const spin = async () => {
      setTimeout(() => {
        finishSpin(pickedNum, playerResults)
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
            text={model.isSimulationRunning ? 'running...' : 'run simulation'}
            isDisabled={false}
            onClicked={handleRunSimulation}
            disabled={model.isSpinning}
            width={170}
          />
        </CenterStack>
        <CenterStack>
          <Box sx={{ width: '80%', textAlign: 'center' }}>
            <LinearProgress variant='determinate' value={model.simulationCounter} />
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
              backgroundColor: CasinoWhiteTransparent,
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
        {model.playerResults.length > 0 && (
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
