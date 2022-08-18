import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import { CoinFlipStats, getCoinflipStats } from 'lib/backend/api/aws/apiGateway'
import { GetStaticProps, NextPage } from 'next'
import Header from 'next/head'
import React from 'react'

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await getCoinflipStats()

  return {
    props: {
      coinflipStats: result,
      apiUrl: process.env.AWS_API_GATEWAY_URL,
    },
  }
}

const CoinFlip: NextPage<{ coinflipStats: CoinFlipStats; apiUrl: string }> = ({ coinflipStats, apiUrl }) => {
  return (
    <>
      <Header>
        <title>Random Stuff - Coin Flip</title>
        <meta property='og:title' content='Random Stuff' key='coinFlipTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='coinFlipDescription' />
      </Header>
      <CoinFlipLayout coinflipStats={coinflipStats} awsApiUrl={apiUrl} />
    </>
  )
}

export default CoinFlip
