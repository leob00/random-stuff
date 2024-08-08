import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RouletteLayout from 'components/Organizms/roulette/RouletteLayout'
import Seo from 'components/Organizms/Seo'
import { getWheelSpinStats } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { WheelSpinStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { GetStaticProps, NextPage } from 'next'
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
        <PageHeader text='Roulette' />
        <RouletteLayout spinStats={spinStats} />
      </ResponsiveContainer>
    </>
  )
}

export default Roulette
