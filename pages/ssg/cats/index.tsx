import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { shuffle } from 'lodash'
import { buildRandomAnimals } from 'lib/backend/api/randomAnimalsApi'
import useSWR, { SWRConfig } from 'swr'
import { Container } from '@mui/material'
import { get } from 'lib/backend/api/fetchFunctions'
import Seo from 'components/Organizms/Seo'
import { BasicArticle } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getItem } from 'app/serverActions/aws/dynamo/dynamo'

const cmsRefreshIntervalSeconds = 360000

const fetcherFn = async (url: string) => {
  let response = await get(url)
  let data = response as BasicArticle[]
  return data
}

export const getStaticProps: GetStaticProps = async (context) => {
  await buildRandomAnimals('cats')
  const resp = await getItem('cats')

  const data = JSON.parse(resp.data) as BasicArticle[]
  return {
    props: {
      articles: shuffle(data),
      fallback: {
        '/api/edgeRandomAnimals?id=cats': data,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Cached = ({ fallbackData }: { fallbackData: BasicArticle[] }) => {
  const { data, error } = useSWR([`/api/edgeRandomAnimals?id=cats`], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalSeconds,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  if (error) {
    return <ArticlesLayout articles={fallbackData} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }
  const apiData = shuffle(data)
  return <ArticlesLayout articles={apiData} />
}

const RandomCats: NextPage<{ articles: BasicArticle[]; fallback: any }> = ({ articles, fallback }) => {
  return (
    <>
      <Seo pageTitle='Cats' />
      <SWRConfig value={{ fallback }}>
        <Cached fallbackData={articles} />
      </SWRConfig>
    </>
  )
}

export default RandomCats
