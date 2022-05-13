import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Table, TableBody, TableRow, TableCell, Link, Typography, Button, Divider } from '@mui/material'
import { getRecipes } from 'lib/drupalApi'
import { DrupalNode } from 'next-drupal'
import NLink from 'next/link'
import router from 'next/router'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import axios, { AxiosRequestConfig } from 'axios'
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
