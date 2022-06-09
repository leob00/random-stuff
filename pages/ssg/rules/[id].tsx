import { Box, Button, Container, Typography } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import router from 'next/router'
import Layout from 'components/Layout'
import { getArticle, getRules } from 'lib/drupalApi'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import { isBrowser } from 'lib/auth'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'

const cmsRefreshInterval = 30000

export const getStaticPaths: GetStaticPaths = async () => {
  let allArticles = await getRules()
  let paths = allArticles.map((article) => `/ssg/rules/${article.id}`)

  return {
    paths: paths,
    fallback: 'blocking',
  }
}

const fetcherFn = async (url: string, id: string) => {
  let config: AxiosRequestConfig = {
    params: {
      id: id,
    },
  }
  let resp = await axios.get(url, config)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let id = context.params?.id as string
  console.log(`regenerating rule ${id}`)
  let article = await getArticle(id)

  return {
    props: {
      fallback: {
        [unstable_serialize(['api', 'article', id])]: article,
      },
      article,
    },
  }
}

const Article = ({ fallbackData }: { fallbackData: DrupalNode }) => {
  /* const { data, error } = useSWR(['/api/article', fallbackData.id], (url: string, id: string) => fetcher(url, id), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshInterval,
  })  */
  const { data, error } = useCmsSwr('/api/article', fallbackData.id, (url: string, id: string) => fetcherFn(url, id), fallbackData, 30)

  if (error) {
    return <Container>unable to load article</Container>
  }
  let article = data as DrupalNode
  if (!article) {
    return <Container>loading</Container>
  }
  if (isBrowser()) {
    console.log(`loaded article: ${article.attributes.title}`)
  }
  return (
    <Container>
      <Typography>
        <Button
          variant='text'
          sx={{ paddingLeft: '0px' }}
          onClick={() => {
            router.push('/ssg/rules')
          }}>
          &#8592; back
        </Button>
      </Typography>
      <Typography variant='h5'>{article.attributes.title}</Typography>
      <hr></hr>
      <Typography variant='body1'>{article.attributes.body.summary}</Typography>
      <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
    </Container>
  )
}

const MSRBRule: NextPage<{ fallback: any; article: DrupalNode }> = ({ fallback, article }) => {
  return (
    <Container>
      <SWRConfig value={{ fallback }}>
        <Article fallbackData={article} />
      </SWRConfig>
    </Container>
  )
}

export default MSRBRule
