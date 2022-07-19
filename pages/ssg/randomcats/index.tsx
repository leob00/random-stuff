import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import RandomAnimalLayout from 'components/RandomAnimalLayout'
import { useRouter } from 'next/router'
import { getRandomCat } from 'lib/repo'
import { BasicArticle } from 'lib/model'

export const getStaticProps: GetStaticProps = async (context) => {
  const cmsRefreshIntervalSeconds = 3600

  let article = await getRandomCat()
  return {
    props: {
      data: article,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const RandomCats: NextPage<{ data: BasicArticle }> = ({ data }) => {
  const router = useRouter()
  const refreshData = () => {
    router.push('/ssr/RandomCat')
  }

  return <RandomAnimalLayout data={data} onRefresh={refreshData} />
}

export default RandomCats
