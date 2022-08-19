import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import RouletteLayout from 'components/Organizms/RouletteLayout'
import { CoinFlipStats, getCoinflipStats } from 'lib/backend/api/aws/apiGateway'
import { GetStaticProps, NextPage } from 'next'
import Header from 'next/head'
import React from 'react'

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await getCoinflipStats()

  return {
    props: {
      coinflipStats: result,
    },
  }
}

const Roulette: NextPage<{ coinflipStats: CoinFlipStats }> = ({ coinflipStats }) => {
  return (
    <>
      <Header>
        <title>Random Stuff - Roulette</title>
        <meta property='og:title' content='Random Stuff' key='rouletteTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='rouletteDescription' />
      </Header>
      <RouletteLayout coinflipStats={coinflipStats} />
    </>
  )
}

export default Roulette
