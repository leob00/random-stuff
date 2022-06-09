import React from 'react'
import type { NextPage } from 'next'
import NLink from 'next/link'
import { GetStaticProps } from 'next'
import { Typography, Button, Divider, Box, Link } from '@mui/material'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllBlogs } from 'lib/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'

const cmsRefreshIntervalSeconds = 3600
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
  let model = data as BlogCollection
  return (
    <Box sx={{ my: 2 }}>
      {model.items.map((item) => (
        <Box key={item.title} sx={{ paddingBottom: 4 }}>
          <Typography variant='h6'>{item.title}</Typography>
          <Typography variant='body2' sx={{ paddingTop: 2 }}>
            {item.summary}
          </Typography>
          <Typography variant='body2' sx={{ paddingTop: 2 }}>
            {item.body}
          </Typography>
          <Typography variant='body2' sx={{ paddingTop: 2 }}>
            <NLink href={item.externalUrl} passHref>
              <Link target='_blank'>Read More</Link>
            </NLink>
          </Typography>
        </Box>
      ))}
    </Box>
  )
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
      <Typography variant='h6'>Articles</Typography>
      <Divider />
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={model} />
      </SWRConfig>
    </>
  )
}

export default Blogs
