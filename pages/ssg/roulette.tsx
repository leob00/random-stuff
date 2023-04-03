import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import RouletteLayout from 'components/Organizms/roulette/RouletteLayout'
import Seo from 'components/Organizms/Seo'
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
      <Seo pageTitle={'Roulette'} />
      <ResponsiveContainer>
        <BackToHomeButton />
        <RouletteLayout spinStats={spinStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Roulette
