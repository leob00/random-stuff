import { Container } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Layout from 'components/Layout'
import { isBrowser } from 'lib/auth'
import { getArticle, getRecipes } from 'lib/drupalApi'
import { SWRConfig, unstable_serialize } from 'swr'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'
import ArticleLayout from 'components/ArticleLayout'
import { DrupalArticle } from 'lib/model'

const cmsRefreshInterval = 90

export const getStaticPaths: GetStaticPaths = async () => {
  let allArticles = await getRecipes()
  let paths = allArticles.map((article) => `/ssg/recipes/${article.id}`)

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
  console.log(`regenerating article ${id}`)
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

const Article = ({ fallbackData }: { fallbackData: DrupalArticle }) => {
  const { data, error } = useCmsSwr('/api/article', fallbackData.id, (url: string, id: string) => fetcherFn(url, id), fallbackData, cmsRefreshInterval)
  if (error) {
    return <ArticleLayout article={fallbackData} baseUrl='/ssg/recipes' />
  }
  let article = data as DrupalArticle
  if (!article) {
    return <Container>loading</Container>
  }
  if (isBrowser()) {
    console.log(`loaded article: ${article.attributes.title}`)
  }
  return <ArticleLayout article={article} baseUrl='/ssg/recipes' />
}

const Recipe: NextPage<{ fallback: any; article: DrupalArticle }> = ({ fallback, article }) => {
  return (
    <Layout>
      <Container>
        <SWRConfig value={{ fallback }}>
          <Article fallbackData={article} />
        </SWRConfig>
      </Container>
    </Layout>
  )
}

export default Recipe
