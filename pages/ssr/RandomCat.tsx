import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { useRouter } from 'next/router'
import { getRandomCat, getRandomDog } from 'lib/repo'
import { BasicArticle } from 'lib/model'
export const getServerSideProps: GetServerSideProps = async (context) => {
  let article = await getRandomCat()
  return {
    props: {
      data: article,
    },
  }
}

const RandomCat: NextPage<{ data: BasicArticle }> = ({ data }) => {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }

  return <RandomAnimalLayout data={data} onRefresh={refreshData} />
}

export default RandomCat
