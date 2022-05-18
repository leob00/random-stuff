import { Container } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Layout from 'components/Layout'
import { isBrowser } from 'lib/auth'
import { getDrupalArticle, getRecipes } from 'lib/drupalApi'
import { SWRConfig, unstable_serialize } from 'swr'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'
import ArticleLayout from 'components/ArticleLayout'
import { DrupalArticle } from 'lib/model'

const cmsRefreshIntervalSeconds = 3600

export const getStaticPaths: GetStaticPaths = async () => {
  let model = await getRecipes()

  let paths = model.allArticles.map((article) => `/ssg/recipes/${article.id}`)

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
  return await resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let id = context.params?.id as string
  console.log(`regenerating article ${id}`)
  let article = await getDrupalArticle(id)

  return {
    props: {
      fallback: {
        [unstable_serialize(['api', 'article', id])]: article,
      },
      article,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Article = ({ fallbackData }: { fallbackData: DrupalArticle }) => {
  const { data, error } = useCmsSwr('/api/article', fallbackData.id, (url: string, id: string) => fetcherFn(url, id), fallbackData, cmsRefreshIntervalSeconds)
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
