import React from 'react'
import type { GetStaticProps, NextPage } from 'next'
import { BasicArticle } from 'lib/model'
import ArticlesLayout from 'components/Organizms/ArticlesLayout'
import { cloneDeep, shuffle } from 'lodash'
import { RandomStuffData } from 'lib/models/randomStuffModels'
import { buildRandomAnimals } from 'lib/backend/api/randomAnimalsApi'
import jsonData from '../../../public/data/randomStuff.json'
import { isBrowser } from 'lib/util/system'
import { putAnimals } from 'lib/backend/api/apiGateway'
import useSWR, { SWRConfig } from 'swr'
import { Container } from '@mui/material'
import { axiosGet } from 'lib/backend/api/useAxios'
const cmsRefreshIntervalSeconds = 360

const fetcherFn = async (url: string) => {
  let response = await axiosGet(url)
  return response.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!isBrowser()) {
    await buildRandomAnimals('cats')
  }
  let data = cloneDeep(jsonData) as RandomStuffData
  let result = shuffle(data.cats)
  return {
    props: {
      articles: result,
      fallback: {
        '/api/cats': result,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Cached = ({ fallbackData }: { fallbackData: BasicArticle[] }) => {
  const { data, error } = useSWR(['/api/cats'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalSeconds * 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  if (error) {
    return <ArticlesLayout articles={fallbackData} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }
  return <ArticlesLayout articles={data} />
}

const RandomCats: NextPage<{ articles: BasicArticle[]; fallback: BasicArticle[] }> = ({ articles, fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Cached fallbackData={articles} />
    </SWRConfig>
  )
}

export default RandomCats
