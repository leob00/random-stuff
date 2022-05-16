import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Typography, Button } from '@mui/material'
import { getRecipes } from 'lib/drupalApi'
import { DrupalNode } from 'next-drupal'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import ArticleTableLayout from 'components/ArticleTableLayout'

const cmsRefreshInterval = 90000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  var articles = await getRecipes()

  return {
    props: {
      articles,
      fallback: {
        '/api/recipes': articles,
      },
    },
    revalidate: 90, // does not work in amplify
  }
}

const Articles = ({ fallbackData }: { fallbackData: DrupalNode[] }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshInterval,
  })
  if (error) {
    return <ArticleTableLayout articles={fallbackData} baseUrl='/ssg/recipes/' />
  }
  let articles = data as DrupalNode[]
  if (!articles) {
    return <Container>loading...</Container>
  }
  return <ArticleTableLayout articles={articles} baseUrl='/ssg/recipes/' />
}

const Recipes: NextPage<{ articles: DrupalNode[]; fallback: any }> = ({ articles, fallback }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}>
        &#8592; back
      </Button>
      <Typography variant='h6'>Recipes</Typography>
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={articles} />
      </SWRConfig>
    </>
  )
}

export default Recipes
