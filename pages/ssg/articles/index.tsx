import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Typography, Button, Divider, List, ListItem } from '@mui/material'
import { getDrupalArticle, getRecipes } from 'lib/drupalApi'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import ArticleTableLayout from 'components/ArticleTableLayout'
import { ArticlesModel, DrupalArticle } from 'lib/model'
import { getAllBlogs } from 'lib/contenfulApi'
import { BlogCollection, BlogResponse } from 'lib/models/cms/contentful/blog'

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
  })
}

const Recipes: NextPage<{ model: BlogCollection; fallback: any }> = ({ model, fallback }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}>
        &#8592; back
      </Button>
      <Typography variant='h6'>Articles</Typography>
      <Divider />
      <SWRConfig value={{ fallback }}>
        <List>
          {model.items.map((item) => (
            <ListItem key={item.title}>{item.title}</ListItem>
          ))}
        </List>
      </SWRConfig>
    </>
  )
}

export default Recipes
