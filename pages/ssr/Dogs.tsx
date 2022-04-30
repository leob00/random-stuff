import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import DogsLayout from 'components/DogsLayout'
import { getRandomDog } from 'lib/yieldCurveRepo'

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = await getRandomDog()
  return {
    props: {
      data,
    },
  }
}

const Dogs: NextPage<{ data: string }> = ({ data }) => {
  return <DogsLayout data={data} />
}

export default Dogs
