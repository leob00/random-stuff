import { Box, LinearProgress, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import RouletteBarChart from 'components/Molecules/Charts/RouletteBarChart'
import { CasinoBlueTransparent, CasinoWhiteTransparent, ChartBackground } from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { getRecord, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomInteger, isEven, isOdd } from 'lib/util/numberUtil'
import { cloneDeep, filter, shuffle } from 'lodash'
import React from 'react'
import numeral from 'numeral'

interface Model {
  spinSpeed?: number
  wheel: RouletteWheel
  result?: RouletteNumber
  isSpinning: boolean
  playerResults: RouletteNumber[]
  playerChart?: WheelSpinStats
  isSimulationRunning?: boolean
  communityChart?: WheelSpinStats
  simulationCounter: number
  simulationJustFinished: boolean
}

const RouletteLayout = ({ spinStats }: { spinStats: WheelSpinStats }) => {
  const defaultSpinSpeed = 40
  const simulationSpinMax = 100
  const defaultModel: Model = {
    simulationCounter: 0,
    wheel: getWheel(),
    playerResults: [],
    communityChart: spinStats,
    isSpinning: false,
    simulationJustFinished: false,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadCommunityStats = async () => {
    let cs = await getRecord<WheelSpinStats>('wheelspin-community')
    if (cs) {
      let m = {
        ...model,
        communityChart: cs,
      }
      setModel(m)
    }
  }

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
      playerResults: [],
      result: undefined,
    })
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
      simulationCounter: simulationSpinMax,
      result: pickedNum,
      playerResults: playerResults,
      playerChart: mapPlayerChart(playerResults),
      communityChart: spinStats,
      simulationJustFinished: false,
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
      result: undefined,
      simulationJustFinished: false,
      playerResults: model.simulationJustFinished ? [] : model.playerResults,
    })
    let playerResults = model.simulationJustFinished ? [] : cloneDeep(model).playerResults
    const pickedNum = getSpinResult()
    playerResults.unshift(pickedNum)

    let spinTimeout = getRandomInteger(2601, 3388)
    const spin = async () => {
      setTimeout(() => {
        finishSpin(pickedNum, playerResults)
      }, spinTimeout)
    }
    await spin()
  }

  React.useEffect(() => {
    if (timeOutRef.current) {
      clearInterval(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      if (!model.isSimulationRunning) {
        return
      }
      let counter = { ...model }.simulationCounter
      if (counter >= simulationSpinMax) {
        setModel({ ...model, isSimulationRunning: false, isSpinning: false, simulationCounter: simulationSpinMax, simulationJustFinished: true })

        console.log(`simulation stopped: player results: ${model.playerResults.length}`)
      } else {
        counter += 1
        const spin = getSpinResult()
        const playerResults = { ...model }.playerResults
        if (playerResults.length === 0) {
          playerResults.push(spin)
        } else {
          playerResults.unshift(spin)
        }
        setModel({ ...model, simulationCounter: counter, result: spin, playerResults: playerResults, playerChart: mapPlayerChart(playerResults) })
      }
      //console.log(counter)
    }, 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.simulationCounter, model.isSimulationRunning])

  React.useEffect(() => {
    const communityFn = async () => {
      await loadCommunityStats()
    }
    communityFn()
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={''} />
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
      {!model.isSpinning && (
        <CenterStack>
          <Box
            onClick={handleSpinClick}
            sx={{
              cursor: 'pointer',
              marginTop: '-460px',
              marginLeft: '2px',
              zIndex: 100,
              position: 'relative',
              height: '60px',
              width: '200px',
              backgroundColor: CasinoWhiteTransparent,
              borderRadius: 8,
              textAlign: 'center',
              //justifyContent: 'center',
              paddingTop: 5.2,
              //fontSize: 40,
              fontWeight: 'bolder',
            }}
          >
            <Typography
              variant='h4'
              color={'primary'}
              sx={{
                // color: model.result.color === 'black' ? 'black' : translateCasinoColor(model.result.color),
                marginTop: { xs: -3, sm: -4 },
                //fontSize: 40,
                fontWeight: 'bolder',
              }}
            >
              Spin
            </Typography>
          </Box>
        </CenterStack>
      )}
      {model.result && (
        <CenterStack>
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
