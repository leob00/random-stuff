import { Avatar, Box, Button, Container, Typography } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { textAlign } from '@mui/system'
import axios from 'axios'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart from 'components/Molecules/Charts/SimpleBarChart'
import SimpleBarChart2 from 'components/Molecules/Charts/SimpleBarChart2'
import { DarkMode } from 'components/themes/DarkMode'
import { CasinoGreen } from 'components/themes/mainTheme'
import { CoinFlipStats, WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { mapRouletteChart } from 'lib/backend/charts/barChartMapper'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomNumber } from 'lib/util/numberUtil'
import { cloneDeep, result, reverse, shuffle } from 'lodash'
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

export type ActionTypes = 'spin' | 'spin-finished'
export interface ActionType {
  type: ActionTypes
  payload: Model
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'spin':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true }
    case 'spin-finished':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: action.payload.result, isSpinning: false, playerResults: action.payload.playerResults, playerChart: action.payload.playerChart, communityChart: action.payload.communityChart }
    default:
      return action.payload
  }
}
const RouletteLayout = ({ spinStats }: { spinStats: WheelSpinStats }) => {
  const defaultSpinSpeed = 40
  let communityChart: BarChart = {
    colors: ['red', 'black', 'green'],
    labels: ['red', 'black', 'green'],
    numbers: [spinStats.red, spinStats.black, spinStats.green],
  }
  const initialState: Model = {
    spinSpeed: defaultSpinSpeed,
    wheel: getWheel(),
    isSpinning: false,
    communityChart: communityChart,
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)
  const handleSpinClick = async () => {
    if (model.isSpinning) {
      return
    }
    await handleSpin()
  }

  const handleSpin = async () => {
    dispatch({
      type: 'spin',
      payload: { spinSpeed: 0.4 },
    })
    let wheel = cloneDeep(model.wheel!)
    const iterations = getRandomNumber(100, 150)
    for (let i = 0; i <= iterations; i++) {
      wheel.numbers = shuffle(wheel.numbers)
    }
    const random = getRandomNumber(0, 38)
    let pickedNum = wheel.numbers[random]
    console.log(`spin result: ${pickedNum.value} - ${pickedNum.color}`)
    let playerResults = model.playerResults ? cloneDeep(model.playerResults) : []
    playerResults.unshift(pickedNum)
    let playerChart: BarChart = mapRouletteChart(playerResults)
    let resp = (await (await axios.post('/api/incrementWheelSpin', pickedNum)).data) as WheelSpinStats
    let communityChart: BarChart = {
      colors: ['red', 'black', 'green'],
      labels: ['red', 'black', 'green'],
      numbers: [resp.red, resp.black, resp.green],
    }
    //console.log(JSON.stringify(resp))
    const spin = async () => {
      setTimeout(() => {
        dispatch({
          type: 'spin-finished',
          payload: { spinSpeed: defaultSpinSpeed, result: pickedNum, playerResults: playerResults, playerChart: playerChart, communityChart: communityChart },
        })
      }, getRandomNumber(2000, 4000))
    }
    await spin()
  }

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={'press the wheel to spin'} />

      <CenterStack sx={{ minHeight: 280 }}>
        <ImageSpinner imageUrl={'/images/american-roulette-wheel.png'} speed={model.spinSpeed} width={240} height={240} onClicked={handleSpinClick} clickable={true} />
      </CenterStack>
      {model.result && (
        <CenterStack sx={{}}>
          <Typography
            sx={{
              cursor: 'pointer',
              marginTop: '-100px',
              marginLeft: '2px',
              zIndex: 100,
              position: 'relative',
              height: '100px',
              width: '100px',
              backgroundColor: CasinoGreen,
              borderRadius: '50%',
              textAlign: 'center',
              paddingTop: 7,
              fontSize: 60,
              fontWeight: 'bolder',
            }}>
            <Typography sx={{ color: model.result.color === 'black' ? 'white' : model.result.color, marginTop: -5, fontSize: 40, fontWeight: 'bolder' }}>
              {model.result.value}

              {/* <Avatar sx={{ bgcolor: model.result.color }}>{model.result.value}</Avatar> */}
            </Typography>
          </Typography>
          {/* <Typography
            sx={{
              cursor: 'pointer',
              marginTop: '-240px',
              marginLeft: '2px',
              zIndex: 100,
              position: 'relative',
              height: '100px',
              width: '100px',
              backgroundColor: 'transparent',
              color: model.result.color,
              borderRadius: '50%',
              textAlign: 'center',
              paddingTop: 7,
              fontSize: 60,
              fontWeight: 'bolder',
            }}
            onClick={handleSpinClick}>
            {model.result.value}
          </Typography> */}
        </CenterStack>
      )}
      <Box sx={{ my: 1 }}>
        {model.playerResults && (
          <>
            <CenterStack sx={{ my: 1 }}>
              <Typography variant='body1' sx={{}}>{`player results`}</Typography>
            </CenterStack>
            <Box sx={{ maxHeight: 204, overflowY: 'auto' }}>
              {model.playerResults.map((item, index) =>
                index === 0 ? (
                  <Box key={index}>
                    <CenterStack>
                      <Box>
                        <CenterStack sx={{ border: 1, borderStyle: 'solid', p: 2, borderRadius: '.8em', minHeight: 60, minWidth: 80 }}>
                          <Typography variant='h4' sx={{ fontWeight: 'bolder', color: item.color }}>{`${item.value}`}</Typography>
                        </CenterStack>
                      </Box>
                    </CenterStack>
                  </Box>
                ) : (
                  <Box>
                    <CenterStack key={index}>
                      <Typography variant='h5' sx={{ color: item.color }}>
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
