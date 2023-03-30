import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import RouletteLayout from 'components/Organizms/roulette/RouletteLayout'
import { CoinFlipStats, getCoinflipStats, getWheelSpinStats, WheelSpinStats } from 'lib/backend/api/aws/apiGateway'
import { GetStaticProps, NextPage } from 'next'
import Header from 'next/head'
import React from 'react'

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await getWheelSpinStats()

  return {
    props: {
      spinStats: result,
    },
  }
}

const Roulette: NextPage<{ spinStats: WheelSpinStats }> = ({ spinStats }) => {
  return (
    <>
      <Header>
        <title>Random Stuff - Roulette</title>
        <meta property='og:title' content='Random Stuff' key='rouletteTitle' />
        <meta
          property='og:description'
          content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.'
          key='rouletteDescription'
        />
      </Header>
      <ResponsiveContainer>
        <BackToHomeButton />

        <RouletteLayout spinStats={spinStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Roulette
