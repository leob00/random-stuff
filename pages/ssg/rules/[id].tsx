import { Box, Button, Container, Typography } from '@mui/material'
import { DrupalNode } from 'next-drupal'

import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import router from 'next/router'
import Layout from 'components/Layout'
import { getArticle, getRules } from 'lib/drupalApi'
import { TrendingUpOutlined } from '@mui/icons-material'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import article from 'pages/api/article'

export const getStaticPaths: GetStaticPaths = async () => {
  let allArticles = await getRules()
  let paths = allArticles.map((article) => `/ssg/rules/${article.id}`)

  return {
    paths: paths,
    fallback: 'blocking',
  }
}
const fetcher = (url: string, id: string) => fetch(`${url}?id=${id}`).then((resp) => resp.json())
//let result = (await resp.json()) as DrupalNode
//return result

export const getStaticProps: GetStaticProps = async (context) => {
  let id = context.params?.id as string
  console.log(`regenerating rule ${id}`)
  const url = `/api/article/?id=${id}`
  let article = await getArticle(id)

  return {
    props: {
      article,
      /* fallback: {
        // unstable_serialize() array style key
        [unstable_serialize(['api', 'article', article.id])]: article,
      }, */
    },

    revalidate: 180,
  }
}

/* function getArticleFromApi(id: string) {
  const { data } = useSWR(['/api/article', id], (url, id) => fetcher(url, id))
  return data as DrupalNode
} */

const Article: React.FunctionComponent<{ article: DrupalNode }> = ({ article }) => {
  /* const { data } = useSWR(['/api/article', id], (url, id) => fetcher(url, id), { fallbackData: fallbackData, refreshInterval: 10000 })
  let article = data as DrupalNode
  if (!article) {
    return <div>loading</div>
  } */

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

const MsrbRule: NextPage<{ article: DrupalNode }> = ({ article }) => {
  const { data, error } = useSWR(['/api/article', article.id], (url, id) => fetcher(url, id), { fallbackData: article, refreshInterval: 30000 })
  if (error) {
    return <div>unable to load article</div>
  }
  let result = data as DrupalNode
  if (!article) {
    return <div>loading</div>
  }
  console.log(`refreshed article: ${result.attributes.title}`)
  return <Article article={result} />
}

export default MsrbRule
