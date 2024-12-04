import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import CoinFlipLayout from 'components/Organizms/CoinFlipLayout'
import Seo from 'components/Organizms/Seo'
import { getCoinflipStats } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { CoinFlipStats } from 'lib/backend/api/aws/models/apiGatewayModels'
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
      <ResponsiveContainer>
        <PageHeader text='Coin Flip' />
        <CoinFlipLayout coinflipStats={coinflipStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Page
