import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Typography, Button, Divider, Box, Container } from '@mui/material'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllBlogs } from 'lib/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import router from 'next/router'
import BlogsLayout from 'components/BlogsLayout'

const cmsRefreshIntervalSeconds = 600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let model = await getAllBlogs()

  return {
    props: {
      model: model,
      fallback: {
        '/api/articles': model,
      },
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Articles = ({ fallbackData }: { fallbackData: BlogCollection }) => {
  const { data, error } = useSWR(['/api/articles'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
  })
  if (error) {
    return <BlogsLayout model={fallbackData} />
  }
  let model = data as BlogCollection
  if (!model) {
    return <Container>loading...</Container>
  }
  return <BlogsLayout model={model} />
}

const Blogs: NextPage<{ model: BlogCollection; fallback: any }> = ({ model, fallback }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}>
        &#8592; back
      </Button>
      <Box width={{ xs: 100, md: 140, lg: 'unset' }}>
        <Typography variant='h6'>Articles</Typography>
      </Box>
      <Divider />
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={model} />
      </SWRConfig>
    </>
  )
}

export default Blogs
