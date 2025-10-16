import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Button, Container } from '@mui/material'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllBlogs } from 'lib/backend/api/cms/contenfulApi'
import { BlogCollection } from 'lib/models/cms/contentful/blog'
import router from 'next/router'
import BlogsLayout from 'components/BlogsLayout'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

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
    revalidateOnFocus: false,
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
        }}
      >
        &#8592; back
      </Button>
      <CenteredTitle title='Articles' />
      <HorizontalDivider />
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={model} />
      </SWRConfig>
    </>
  )
}

export default Blogs
