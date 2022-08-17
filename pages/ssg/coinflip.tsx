import { Box, Button, Container, Typography } from '@mui/material'
import { actionRow } from 'aws-amplify'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import SimpleBarChart from 'components/Molecules/Charts/SimpleBarChart'
import CoinFlipChart from 'components/Molecules/CoinFlipChart'
import { DarkGreen, LightBlue } from 'components/themes/mainTheme'
import { cloneDeep, shuffle } from 'lodash'
import { GetStaticProps, NextPage } from 'next'
import Header from 'next/head'
import React from 'react'
export type headsTails = 'heads' | 'tails'

export interface Coin {
  face: headsTails
  imageUrl: string
}

const getImage = (face: headsTails) => {
  switch (face) {
    case 'heads':
      return '/images/coin-head.png'
    case 'tails':
      return '/images/coin-tails.png'
  }
}

export interface Model {
  defaultState?: boolean
  isLoading?: boolean
  currentCoinState?: Coin
  flippedCoin?: Coin
  allCoins: Coin[]
  runningChart?: BarChart
}

export type ActionTypes = 'toss' | 'flipped'

export interface ActionType {
  type: ActionTypes
  payload: Model
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'toss':
      return { ...state, allCoins: action.payload.allCoins, isLoading: true, flippedCoin: undefined, defaultState: false }
    case 'flipped':
      let chart: BarChart = {
        labels: ['heads', 'tails'],
        numbers: state.runningChart ? state.runningChart.numbers : [0, 0],
        colors: [DarkGreen, LightBlue],
      }
      let currentState = { ...state }
      if (currentState.runningChart) {
        switch (action.payload.flippedCoin?.face) {
          case 'heads':
            currentState.runningChart.numbers[0] = currentState.runningChart.numbers[0] + 1
            break
          case 'tails':
            currentState.runningChart.numbers[1] = currentState.runningChart.numbers[1] + 1
            break
          default:
            break
        }
      }
      return { ...state, allCoins: action.payload.allCoins, isLoading: false, flippedCoin: action.payload.flippedCoin, runningChart: currentState.runningChart }
    default:
      return action.payload
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}

const CoinFlip: NextPage = () => {
  const coins: Coin[] = [
    {
      face: 'heads',
      imageUrl: getImage('heads'),
    },
    {
      face: 'tails',
      imageUrl: getImage('tails'),
    },
  ]

  const initialState: Model = {
    isLoading: false,
    defaultState: true,
    currentCoinState: shuffle(coins)[0],
    allCoins: coins,
    runningChart: {
      labels: ['heads', 'tails'],
      numbers: [0, 0],
      colors: [DarkGreen, LightBlue],
    },
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)

  const handleFlipClick = () => {
    let allCoins = cloneDeep(model.allCoins)
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

    setTimeout(() => {
      dispatch({
        type: 'flipped',
        payload: {
          allCoins: allCoins,
          flippedCoin: shuffled[0],
        },
      })
    }, 3000)
  }
  return (
    <>
      <Header>
        <title>Random Stuff - Coin Flip</title>
        <meta property='og:title' content='Random Stuff' key='coinFlipTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='coinFlipDescription' />
      </Header>
      <Container>
        <CenterStack sx={{ minHeight: 100 }}>
          <Box>
            <Typography variant='body1' sx={{ textAlign: 'center' }}>
              This is your chance to flip a coin if you do not have one.
            </Typography>
            <Typography variant='body2' sx={{ textAlign: 'center', paddingTop: 2 }}>
              Call out your prediction and click the Flip button.
            </Typography>
          </Box>
        </CenterStack>
        <CenterStack sx={{ minHeight: 120 }}>
          <Box>
            {model.defaultState && (
              <Box>
                <RemoteImageFlat title={model.allCoins[0].face} url={model.allCoins[0].imageUrl} height={100} width={100} />
              </Box>
            )}
            {model.isLoading && <RemoteImageFlat title={model.allCoins[0].face} url={model.allCoins[0].imageUrl} height={100} width={100} className='rotate' />}
            {model.flippedCoin && (
              <Box>
                <RemoteImageFlat title={model.flippedCoin.face} url={model.flippedCoin.imageUrl} height={100} width={100} />
              </Box>
            )}
            <CenterStack sx={{ minHeight: 36 }}>
              {model.flippedCoin && (
                <Box>
                  <Typography variant='h4'>{`${model.flippedCoin.face}!`}</Typography>
                </Box>
              )}
            </CenterStack>
          </Box>
        </CenterStack>
        <CenterStack sx={{ paddingTop: 2 }}>
          <Button variant='contained' color='primary' onClick={handleFlipClick} disabled={model.isLoading}>
            Flip
          </Button>
        </CenterStack>
        {model.runningChart && <CoinFlipChart totalFlips={model.runningChart.numbers[0] + model.runningChart.numbers[1]} chart={model.runningChart} />}
      </Container>
    </>
  )
}

export default CoinFlip
