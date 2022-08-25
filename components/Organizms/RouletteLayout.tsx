import { Box, Typography } from '@mui/material'
import axios from 'axios'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { CasinoBlackTransparent, CasinoGrayTransparent, CasinoGreen, CasinoGreenTransparent, CasinoRed, CasinoRedTransparent, CasinoWhiteTransparent } from 'components/themes/mainTheme'
import { WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { getWheel, RouletteNumber, RouletteNumberColor, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomInteger } from 'lib/util/numberUtil'
import { cloneDeep, filter, shuffle } from 'lodash'
import React from 'react'

//type headsTails = 'heads' | 'tails'
//const barChartColors = [TransparentGreen, TransparentBlue]
//const barChartLabels = ['heads', 'tails']

export interface Model {
  spinSpeed?: number
  wheel?: RouletteWheel
  result?: RouletteNumber
  isSpinning?: boolean
  playerResults?: RouletteNumber[]
  playerChart?: BarChart
  communityChart?: BarChart
}

export type ActionTypes = 'spin' | 'spin-finished' | 'reload-community-stats'
export interface ActionType {
  type: ActionTypes
  payload: Model
}
const mapRouletteStatsChart = (red: number, black: number, zero: number, doubleZero: number) => {
  let communityChart: BarChart = {
    colors: [CasinoRedTransparent, CasinoBlackTransparent, CasinoGreenTransparent],
    labels: ['red', 'black', '0', '00'],
    numbers: [red, black, zero, doubleZero],
  }
  return communityChart
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'spin':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true }
    case 'spin-finished':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: action.payload.result, isSpinning: false, playerResults: action.payload.playerResults, playerChart: action.payload.playerChart, communityChart: action.payload.communityChart }
    case 'reload-community-stats':
      return { ...state, communityChart: action.payload.communityChart }
    default:
      return action.payload
  }
}

const RouletteLayout = ({ spinStats }: { spinStats: WheelSpinStats }) => {
  const defaultSpinSpeed = 40

  //getStats()
  const loadCommunityStats = async () => {
    let cs = (await (await axios.get('/api/wheelSpin')).data) as WheelSpinStats
    //console.log(JSON.stringify(cs))
    if (cs) {
      const communityChart = mapRouletteStatsChart(cs.red, cs.black, cs.zero, cs.doubleZero)
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
    communityChart: mapRouletteStatsChart(spinStats.red, spinStats.black, spinStats.zero, spinStats.doubleZero),
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
    //console.log(`shuffle itertaions: ${iterations}`)
    for (let i = 0; i <= iterations; i++) {
      result = shuffle(cloneDeep(numbers))
    }
    return result
  }

  const handleSpin = async () => {
    dispatch({
      type: 'spin',
      payload: { spinSpeed: 5.25 },
    })
    //let numbers = )
    let nums = shuffle(cloneDeep(model.wheel?.numbers)!)
    let numbers = await shuffleNumbers(nums)

    let pickedNum = numbers[getRandomInteger(0, 37)]
    //console.log(`spin result: ${pickedNum.value} - ${pickedNum.color}`)
    let playerResults = model.playerResults ? cloneDeep(model.playerResults) : []
    playerResults.unshift(pickedNum)
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
      return e.color === 'zero'
    }).length
    let playerChart = mapRouletteStatsChart(redTotal, blackTotal, zeroTotal, doubleZeroTotal)

    //console.log(JSON.stringify(resp))

    const updateCommunity = async () => {
      let resp = await axios.post('/api/incrementWheelSpin', pickedNum)
      let data = resp.data as WheelSpinStats
      let communityChart = mapRouletteStatsChart(data.red, data.black, data.zero, data.doubleZero)
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
    loadCommunityStats()
  }, [])

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={'press the wheel to spin'} />
      <CenterStack sx={{ minHeight: 280 }}>
        <ImageSpinner imageUrl={'/images/american-roulette-wheel.png'} speed={model.spinSpeed} width={240} height={240} onClicked={handleSpinClick} clickable={true} />
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
        {model.playerResults && (
          <>
            <CenterStack sx={{ my: 1 }}>
              <Typography variant='body1' sx={{}}>{`player results`}</Typography>
            </CenterStack>
            <Box sx={{ maxHeight: 204, minHeight: 150, overflowY: 'auto' }}>
              {model.playerResults.map((item, index) =>
                index === 0 ? (
                  <Box key={index}>
                    <CenterStack>
                      <Box>
                        <CenterStack sx={{ border: 1, borderStyle: 'solid', p: 2, borderRadius: '.8em', minHeight: 60, minWidth: 80 }}>
                          <Typography variant='h4' sx={{ fontWeight: 'bolder', color: translateCasinoColor(item.color) }}>{`${item.value}`}</Typography>
                        </CenterStack>
                      </Box>
                    </CenterStack>
                  </Box>
                ) : (
                  <Box key={index}>
                    <CenterStack>
                      <Typography variant='h5' sx={{ color: translateCasinoColor(item.color) }}>
                        {item.value}
                      </Typography>
                    </CenterStack>
                  </Box>
                ),
              )}
            </Box>
            {model.playerChart && (
              <Box>
                <SimpleBarChart2 title={'Player spins'} barChart={model.playerChart} />
              </Box>
            )}
          </>
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
