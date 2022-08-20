import { Box, Button, Container, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { DarkMode } from 'components/themes/DarkMode'
import { CasinoGreen } from 'components/themes/mainTheme'
import { CoinFlipStats } from 'lib/backend/api/aws/apiGateway'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
import { getRandomNumber } from 'lib/util/numberUtil'
import { cloneDeep, reverse, shuffle } from 'lodash'
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
      return { ...state, spinSpeed: action.payload.spinSpeed, result: action.payload.result, isSpinning: false, playerResults: action.payload.playerResults }
    default:
      return action.payload
  }
}
const RouletteLayout = ({ coinflipStats }: { coinflipStats: CoinFlipStats }) => {
  const defaultSpinSpeed = 40
  const initialState: Model = {
    spinSpeed: defaultSpinSpeed,
    wheel: getWheel(),
    isSpinning: false,
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
    const spin = async () => {
      setTimeout(() => {
        dispatch({
          type: 'spin-finished',
          payload: { spinSpeed: defaultSpinSpeed, result: pickedNum, playerResults: playerResults },
        })
      }, getRandomNumber(2500, 6000))
    }
    await spin()
  }

  return (
    <Box>
      <CenteredHeader title={'This is your chance to spin the wheel!'} description={'press the wheel to spin'} />
      <CenterStack sx={{ minHeight: 280, backgroundColor: CasinoGreen }}>
        <ImageSpinner imageUrl={'/images/american-roulette-wheel.png'} speed={model.spinSpeed} width={240} height={240} onClicked={handleSpinClick} clickable={true} />
      </CenterStack>
      <Box sx={{ my: 1 }}>
        {model.playerResults && (
          <>
            <CenterStack sx={{ my: 1 }}>
              <Typography variant='body1' sx={{}}>{`player results`}</Typography>
            </CenterStack>
            {model.playerResults.map((item, index) =>
              index === 0 ? (
                <Box>
                  <CenterStack>
                    <Box key={index}>
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
          </>
        )}
      </Box>
    </Box>
  )
}

export default RouletteLayout
