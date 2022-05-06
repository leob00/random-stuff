import { Box, Button, Container, Typography } from '@mui/material'
import { DrupalNode } from 'next-drupal'

import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import router from 'next/router'
import Layout from 'components/Layout'
import { getArticle, getRules } from 'lib/drupalApi'

export const getStaticPaths: GetStaticPaths = async () => {
  let allArticles = await getRules()
  let paths = allArticles.map((article) => `/ssg/rules/${article.id}`)

  return {
    paths: paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  let id = context.params?.id as string
  let article = await getArticle(id)
  return {
    props: {
      article,
    },
  }
}

const MsrbRule: NextPage<{ article: DrupalNode }> = ({ article }) => {
  return (
    <Layout>
      <Container>
        <Typography>
          <Button
            variant='text'
            sx={{ paddingLeft: '0px' }}
            onClick={() => {
              router.push('/ssg/rules')
            }}>
            &laquo; back
          </Button>
        </Typography>
        <Typography variant='h5'>{article.attributes.title}</Typography>
        <hr></hr>
        <Typography variant='body1'>{article.attributes.body.summary}</Typography>
        <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
      </Container>
    </Layout>
  )
}

export default MsrbRule
