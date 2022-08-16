import { Box, Button, Stack, Typography } from '@mui/material'
import RemoteImage from 'components/Atoms/RemoteImage'
import RemoteImageFlat from 'components/Atoms/RemoteImageFlat'
import SmallLoader from 'components/Atoms/SmallLoader'
import WarmupBox from 'components/Atoms/WarmupBox'
import { Blue800 } from 'components/themes/mainTheme'
import { shuffle } from 'lodash'
import { GetStaticProps, NextPage } from 'next'
import Header from 'next/head'
import React from 'react'
import WarmUp from './warmup'

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
  const [flippedCoin, setFlippedCoin] = React.useState<Coin | null>(null)
  const [coinStates, setCoinStates] = React.useState<Coin[]>(coins)
  const [isLoading, setIsLoading] = React.useState(false)
  const [defaultState, setDefaultState] = React.useState(true)

  const handleFlipClick = () => {
    setFlippedCoin(null)
    setIsLoading(true)
    setDefaultState(false)
    let shuffled = shuffle(coinStates)[0]
    for (let i = 0; i < 100; i++) {
      shuffled = shuffle(coinStates)[0]
    }

    setTimeout(() => {
      setIsLoading(false)
      setCoinStates(shuffle(coinStates))
      setFlippedCoin(shuffled)
    }, 3000)
  }

  return (
    <>
      <Header>
        <title>Random Stuff - Coin Flip</title>
        <meta property='og:title' content='Random Stuff' key='coinFlipTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='coinFlipDescription' />
      </Header>
      <Box>
        <Box sx={{ minHeight: 140 }}>
          <Stack direction='row' justifyContent='center' sx={{ minHeight: 100 }}>
            {isLoading && <RemoteImageFlat title={coinStates[0].face} url={coinStates[0].imageUrl} height={100} width={100} className='rotate' />}
            {flippedCoin && (
              <>
                <Box>
                  <RemoteImageFlat title={flippedCoin.face} url={flippedCoin.imageUrl} height={100} width={100} />
                </Box>
              </>
            )}
          </Stack>

          <Stack direction='row' justifyContent='center'>
            {flippedCoin && (
              <Box>
                <Typography variant='h5'>{`${flippedCoin.face}!`}</Typography>
              </Box>
            )}
          </Stack>
          {defaultState && (
            <Stack direction='row' justifyContent='center'>
              <Typography variant='body1'>This is your chance to flip a coin if you do not have one. Simply call out your prediction and click the Flip button.</Typography>
            </Stack>
          )}
        </Box>

        <Stack direction='row' justifyContent='center' sx={{ paddingTop: 6 }}>
          <Button variant='outlined' color='primary' onClick={handleFlipClick}>
            Flip
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default CoinFlip
