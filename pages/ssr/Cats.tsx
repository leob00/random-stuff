import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { getRandomCat } from 'lib/repo'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { BasicArticle } from 'lib/model'

export const getServerSideProps: GetServerSideProps = async (context) => {
  var data = (await getRandomCat()) as BasicArticle
  return {
    props: {
      data,
    },
  }
}

const Cats: NextPage<{ data: BasicArticle }> = ({ data }) => {
  return <RandomAnimalLayout data={data} />
}

export default Cats
