import BackButton from 'components/Atoms/Buttons/BackButton'
import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import Seo from 'components/Organizms/Seo'
import { CoinFlipStats, getCoinflipStats } from 'lib/backend/api/aws/apiGateway'
import { GetStaticProps, NextPage } from 'next'
import React from 'react'

export const getStaticProps: GetStaticProps = async (context) => {
  const result = await getCoinflipStats()

  return {
    props: {
      coinflipStats: result,
    },
  }
}

const Page: NextPage<{ coinflipStats: CoinFlipStats }> = ({ coinflipStats }) => {
  return (
    <>
      <Seo pageTitle='Coin Flip' />
      <BackButton />
      <CoinFlipLayout coinflipStats={coinflipStats} />
    </>
  )
}

export default Page
