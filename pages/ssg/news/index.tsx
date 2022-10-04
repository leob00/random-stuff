import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Button } from '@mui/material'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import { getNewsFeed, NewsItem } from 'lib/backend/api/qln/qlnApi'
import NewsFeedLayout from 'components/NewsFeedLayout'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data as NewsItem[]
}

export const getStaticProps: GetStaticProps = async (context) => {
  let model = await getNewsFeed()

  return {
    props: {
      model: model,
      fallback: {
        '/api/news': model,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const CachedNews = ({ fallbackData }: { fallbackData: NewsItem[] }) => {
  const { data, error } = useSWR(['/api/newsfeed'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  if (error) {
    return <NewsFeedLayout articles={fallbackData} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }
  let model = data as NewsItem[]
  return <NewsFeedLayout articles={model} />
}

const Page: NextPage<{ model: NewsItem[]; fallback: NewsItem[] }> = ({ model, fallback }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}>
        &#8592; back
      </Button>

      <SWRConfig value={{ fallback }}>
        <CachedNews fallbackData={model} />
      </SWRConfig>
    </>
  )
}

export default Page
