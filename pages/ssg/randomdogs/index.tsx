import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { BasicArticle } from 'lib/model'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { shuffle } from 'lodash'
import { buildRandomAnimals } from 'lib/backend/api/randomAnimalsApi'
import { isBrowser } from 'lib/util/system'
import { getAnimals } from 'lib/backend/api/aws/apiGateway'
import useSWR, { SWRConfig } from 'swr'
import { Container } from '@mui/material'
import { axiosGet } from 'lib/backend/api/aws/useAxios'
import Header from 'next/head'

const cmsRefreshIntervalSeconds = 360

const fetcherFn = async (url: string) => {
  let response = await axiosGet(url)
  let data = response as BasicArticle[]
  return data
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!isBrowser()) {
    await buildRandomAnimals('dogs')
  }
  let data = await getAnimals('dogs')

  return {
    props: {
      articles: shuffle(data),
      fallback: {
        '/api/dogs': data,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Cached = ({ fallbackData }: { fallbackData: BasicArticle[] }) => {
  const { data, error } = useSWR(['/api/dogs'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalSeconds * 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
  if (error) {
    console.log('error occured', error)
    return <ArticlesLayout articles={fallbackData} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }
  return <ArticlesLayout articles={data} />
}

const RandomDogs: NextPage<{ articles: BasicArticle[]; fallback: any }> = ({ articles, fallback }) => {
  return (
    <>
      <Header>
        <title>Random Stuff - Dogs</title>
        <meta property='og:title' content='Random Stuff - Dogs' key='dogsTitle' />
      </Header>
      <SWRConfig value={{ fallback }}>
        <Cached fallbackData={articles} />
      </SWRConfig>
    </>
  )
}

export default RandomDogs
