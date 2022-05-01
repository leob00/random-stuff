import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import RandomAnimal from 'components/RandomAnimalLayout'
import { getRandomDog } from 'lib/yieldCurveRepo'
import { BasicArticle } from 'lib/model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = await getRandomDog()
  return {
    props: {
      data,
    },
  }
}

const Dogs: NextPage<{ data: BasicArticle }> = ({ data }) => {
  return <RandomAnimal data={data} />
}

export default Dogs
