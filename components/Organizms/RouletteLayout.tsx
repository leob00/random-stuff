import { Box, Typography } from '@mui/material'
import axios from 'axios'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { CasinoBlackTransparent, CasinoGrayTransparent, CasinoGreen, CasinoGreenTransparent, CasinoRed, CasinoRedTransparent, CasinoWhiteTransparent } from 'components/themes/mainTheme'
import { getWheelSpinStats, WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { mapRouletteChart, translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { getWheel, RouletteNumber, RouletteNumberColor, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomNumber } from 'lib/util/numberUtil'
import { cloneDeep, shuffle } from 'lodash'
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
const mapCommunityStats = (red: number, black: number, green: number) => {
  let communityChart: BarChart = {
    colors: [CasinoRedTransparent, CasinoBlackTransparent, CasinoGreen],
    labels: ['red', 'black', 'green'],
    numbers: [red, black, green],
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
      const communityChart = mapCommunityStats(cs.red, cs.black, cs.green)
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
    communityChart: mapCommunityStats(spinStats.red, spinStats.black, spinStats.green),
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)
  const handleSpinClick = async () => {
    if (model.isSpinning) {
      return
    }
    await handleSpin()
  }

  const incrementCommunityStats = (pickedNum: RouletteNumber) => {}

  const handleSpin = async () => {
    dispatch({
      type: 'spin',
      payload: { spinSpeed: 0.4 },
    })
    let wheel = cloneDeep(model.wheel!)
    const iterations = getRandomNumber(101, 123)
    for (let i = 0; i <= iterations; i++) {
      wheel.numbers = shuffle(wheel.numbers)
      //console.log(`shuffled itertaion: ${i} -  ${wheel.numbers.length} numbers`)
    }
    let pickedNum = wheel.numbers[0]
    //console.log(`spin result: ${pickedNum.value} - ${pickedNum.color}`)
    let playerResults = model.playerResults ? cloneDeep(model.playerResults) : []
    playerResults.unshift(pickedNum)
    let playerChart = mapRouletteChart(playerResults)

    //console.log(JSON.stringify(resp))
    let spinTimeout = getRandomNumber(2000, 4000)

    const updateCommunity = async () => {
      let resp = await axios.post('/api/incrementWheelSpin', pickedNum)
      let data = resp.data as WheelSpinStats
      let communityChart = mapCommunityStats(data.red, data.black, data.green)
      let m = cloneDeep(model)
      m.communityChart = communityChart
      dispatch({
        type: 'reload-community-stats',
        payload: m,
      })
    }

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
    const fn = async () => {
      await loadCommunityStats()
    }
    //fn()
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
                  <Box>
                    <CenterStack key={index}>
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
                <SimpleBarChart2 title={'Player spin stats'} barChart={model.playerChart} />
              </Box>
            )}
          </>
        )}
      </Box>
      {model.communityChart && (
        <Box>
          <SimpleBarChart2 title='Community Spins' barChart={model.communityChart} />
        </Box>
      )}
    </Box>
  )
}

export default RouletteLayout
