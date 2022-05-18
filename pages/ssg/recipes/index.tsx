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
import { ArticlesModel, DrupalArticle } from 'lib/model'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let model = await getRecipes()
  let random = model.allArticles[Math.floor(Math.random() * (model.allArticles.length - 1))]
  //console.log('featured: ', JSON.stringify(featured))
  let featured = await getDrupalArticle(random.id)
  model.featured = featured

  return {
    props: {
      model: model,
      fallback: {
        '/api/recipes': model,
      },
      featured,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Articles = ({ fallbackData, featuredArticle }: { fallbackData: ArticlesModel; featuredArticle: DrupalArticle | undefined }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
  })
  if (error) {
    return <ArticleTableLayout articles={fallbackData} baseUrl='/ssg/recipes/' />
  }
  let model = data as ArticlesModel
  if (!model) {
    return <Container>loading...</Container>
  }
  return <ArticleTableLayout articles={model} baseUrl='/ssg/recipes/' featuredArticle={featuredArticle} />
}

const Recipes: NextPage<{ model: ArticlesModel; fallback: any }> = ({ model, fallback }) => {
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
        <Articles fallbackData={model} featuredArticle={model.featured} />
      </SWRConfig>
    </>
  )
}

export default Recipes
