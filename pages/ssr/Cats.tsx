import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import RandomAnimal from 'components/RandomAnimalLayout'
import { getRandomCat, getRandomDog } from 'lib/yieldCurveRepo'
import CatsLayout from 'components/CatsLayout'

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = await getRandomCat()
  return {
    props: {
      data,
    },
  }
}

const Cats: NextPage<{ data: string }> = ({ data }) => {
  return <RandomAnimal data={data} title='Cats' />
}

export default Cats
