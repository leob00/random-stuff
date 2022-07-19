import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { getRandomDog } from 'lib/repo'
import { BasicArticle } from 'lib/model'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 3600
  let article = await getRandomDog()
  /* if (!isBrowser()) {
    await downloadRandomDogImage()
  } */
  return {
    props: {
      data: article,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomDogs: NextPage<{ data: BasicArticle }> = ({ data }) => {
  const router = useRouter()
  const refreshData = () => {
    router.push('/ssr/RandomDog')
  }
  return <RandomAnimalLayout data={data} onRefresh={refreshData} />
}

export default RandomDogs
