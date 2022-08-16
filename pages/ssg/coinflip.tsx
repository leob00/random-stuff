import { Box, Button, Container, Typography } from '@mui/material'
import { actionRow } from 'aws-amplify'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
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
}

export type ActionTypes = 'toss' | 'flipped'

export interface ActionType {
  type: ActionTypes
  payload: Model
}

export function reducer(state: Model, action: ActionType): Model {
  switch (action.type) {
    case 'toss':
      return { ...state, allCoins: state.allCoins, isLoading: true, flippedCoin: undefined, defaultState: false }
    case 'flipped':
      return { ...state, allCoins: state.allCoins, isLoading: false, flippedCoin: action.payload.flippedCoin }
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
  let coin: Coin = {
    face: 'tails',
    imageUrl: getImage('tails'),
  }
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
  /* const [flippedCoin, setFlippedCoin] = React.useState<Coin | null>(null)
  const [coinStates, setCoinStates] = React.useState<Coin[]>(coins)
  const [isLoading, setIsLoading] = React.useState(false)
  const [defaultState, setDefaultState] = React.useState(true) */

  const initialState: Model = {
    isLoading: false,
    defaultState: true,
    currentCoinState: shuffle(coins)[0],
    allCoins: coins,
  }

  const [model, dispatch] = React.useReducer(reducer, initialState)

  const handleFlipClick = () => {
    dispatch({
      type: 'toss',
      payload: {
        currentCoinState: model.allCoins[0],
        allCoins: model.allCoins,
      },
    })
    //setFlippedCoin(null)
    //setIsLoading(true)
    //setDefaultState(false)
    /* let shuffled = shuffle(model.coinStates)[0] */
    let allCoins = cloneDeep(model.allCoins)
    let shuffled = shuffle(allCoins)
    for (let i = 0; i < 100; i++) {
      shuffled = shuffle(shuffled)
    }

    setTimeout(() => {
      dispatch({
        type: 'flipped',
        payload: {
          allCoins: model.allCoins,
          flippedCoin: shuffled[0],
        },
      })
      /*   setIsLoading(false)
      setCoinStates(shuffle(coinStates))
      setFlippedCoin(shuffled) */
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
          <Button variant='contained' color='primary' onClick={handleFlipClick}>
            Flip
          </Button>
        </CenterStack>
      </Container>
    </>
  )
}

export default CoinFlip
