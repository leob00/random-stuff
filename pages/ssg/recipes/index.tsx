import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Typography, Button, Divider } from '@mui/material'
import { getDrupalArticle, getRecipes } from 'lib/drupalApi'
import { DrupalNode } from 'next-drupal'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import ArticleTableLayout from 'components/ArticleTableLayout'
import { DrupalArticle } from 'lib/model'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let articles = await getRecipes()
  let random = articles[Math.floor(Math.random() * (articles.length - 1))]
  //console.log('featured: ', JSON.stringify(featured))
  let featured = await getDrupalArticle(random.id)

  return {
    props: {
      articles,
      fallback: {
        '/api/recipes': articles,
      },
      featured,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Articles = ({ fallbackData, featuredArticle }: { fallbackData: DrupalNode[]; featuredArticle: DrupalArticle }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
  })
  if (error) {
    return <ArticleTableLayout articles={fallbackData} baseUrl='/ssg/recipes/' />
  }
  let articles = data as DrupalNode[]
  if (!articles) {
    return <Container>loading...</Container>
  }
  return <ArticleTableLayout articles={articles} baseUrl='/ssg/recipes/' featuredArticle={featuredArticle} />
}

const Recipes: NextPage<{ articles: DrupalNode[]; fallback: any; featured: DrupalArticle }> = ({ articles, fallback, featured }) => {
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
      <Divider />
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={articles} featuredArticle={featured} />
      </SWRConfig>
    </>
  )
}

export default Recipes
