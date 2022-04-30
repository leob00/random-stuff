import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getRandomCat } from 'lib/yieldCurveRepo'
import RandomAnimalLayout from 'components/RandomAnimalLayout'

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = await getRandomCat()
  return {
    props: {
      data,
    },
  }
}

const Cats: NextPage<{ data: string }> = ({ data }) => {
  return <RandomAnimalLayout data={data} title='Cats' />
}

export default Cats
