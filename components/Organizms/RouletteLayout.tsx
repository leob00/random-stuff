import { Box, Button, Container, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ImageSpinner from 'components/Atoms/ImageSpinner'
import { CoinFlipStats } from 'lib/backend/api/aws/apiGateway'
import { getWheel, RouletteNumber, RouletteWheel } from 'lib/backend/roulette/wheel'
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
}

export type ActionTypes = 'spin' | 'spinned'
export interface ActionType {
  type: ActionTypes
  payload: Model
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'spin':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: undefined, isSpinning: true }
    case 'spinned':
      return { ...state, spinSpeed: action.payload.spinSpeed, result: action.payload.result, isSpinning: false }
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
  /* React.useEffect(() => {
    dispatch({
      type: 'spin',
      payload: {
        spinSpeed: 18,
      },
    })
  }, []) */
  const handleSpinClick = async () => {
    //const wheel = getWheel()
    //console.log(JSON.stringify(wheel))

    dispatch({
      type: 'spin',
      payload: { spinSpeed: 0.4 },
    })
    const finish = () => {
      setTimeout(() => {
        let wheel = cloneDeep(model.wheel!)
        const iterations = getRandomNumber(100, 150)
        for (let i = 0; i <= iterations; i++) {
          wheel.numbers = shuffle(wheel.numbers)
        }
        const random = getRandomNumber(0, 38)
        let pickedNum = wheel.numbers[random]
        console.log(`spin result: ${pickedNum.value} - ${pickedNum.color}`)
        dispatch({
          type: 'spinned',
          payload: { spinSpeed: defaultSpinSpeed, result: pickedNum },
        })
      }, 3000)
    }
    finish()

    /* let allCoins = cloneDeep(model.allCoins)
    let shuffled = shuffle(allCoins)
    dispatch({
      type: 'toss',
      payload: {
        currentCoinState: shuffled[0],
        allCoins: shuffled,
      },
    })

    for (let i = 0; i < 100; i++) {
      shuffled = shuffle(shuffled)
    }
    const flipped = shuffled[0]
    let coinStats = cloneDeep(model.coinflipStats) as CoinFlipStats
    if (flipped.face === 'heads') {
      coinStats.heads += 1
    }
    if (flipped.face === 'tails') {
      coinStats.tails += 1
    } */

    const postFn = async () => {
      // let result = (await (await axios.put('/api/incrementCoinFlip', flipped)).data) as CoinFlipStats
      // console.log(JSON.stringify(result))
      /* dispatch({
        type: 'update-community-stats',
        payload: {
          allCoins: allCoins,
          coinflipStats: result,
        },
      }) */
    }

    /* setTimeout(() => {
      dispatch({
        type: 'flipped',
        payload: {
          allCoins: allCoins,
          flippedCoin: flipped,
        },
      })
      postFn()
    }, 3000) */
  }

  return (
    <Container>
      <CenterStack sx={{ minHeight: 100 }}>
        <Box>
          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            This is your chance to spin the wheel if you do not have one at home.
          </Typography>
          <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
            Call out your prediction and click the Spin button.
          </Typography>
        </Box>
      </CenterStack>
      <CenterStack sx={{ minHeight: 120 }}>
        <Box>
          <ImageSpinner imageUrl={'/images/american-roullete-wheel.png'} speed={model.spinSpeed} />
        </Box>
      </CenterStack>
      <CenterStack sx={{ paddingTop: 2 }}>
        <Button variant='contained' color='primary' onClick={handleSpinClick} disabled={model.isSpinning}>
          Spin
        </Button>
      </CenterStack>
      <CenterStack sx={{ minHeight: 50, my: 2 }}>
        {model.result && (
          <Box sx={{ border: 1, borderStyle: 'solid', p: 2, borderRadius: '.8em', minHeight: 110, minWidth: 120 }}>
            <CenterStack>
              <Typography variant='body1' sx={{}}>{`spin result`}</Typography>
            </CenterStack>
            <CenterStack>
              <Typography variant='h3' sx={{ fontWeight: 'bolder', color: model.result.color }}>{`${model.result.value}`}</Typography>
            </CenterStack>
          </Box>
        )}
      </CenterStack>
    </Container>
  )
}

export default RouletteLayout
