import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Typography, Button, Divider } from '@mui/material'
import router from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllRecipes, getRecipe } from 'lib/contenfulApi'
import { cloneDeep, take } from 'lodash'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import RecipesLayout from 'components/RecipesLayout'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  let model = await getAllRecipes()
  let random = model.items[Math.floor(Math.random() * (model.items.length - 1))]
  let featured = await getRecipe(random.sys.id)
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

const CachedRecipes = ({ fallbackData, featured }: { fallbackData: RecipeCollection; featured: Recipe }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
  })
  if (error) {
    return <RecipesLayout recipeCollection={fallbackData} baseUrl='/ssg/recipes/' />
  }
  let model = data as RecipeCollection

  if (!model) {
    return <Container>loading...</Container>
  }
  return <RecipesLayout recipeCollection={model} baseUrl='/ssg/recipes/' featured={featured} />
}

const Recipes: NextPage<{ model: RecipeCollection; fallback: any }> = ({ model, fallback }) => {
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
        <CachedRecipes fallbackData={model} featured={model.featured} />
      </SWRConfig>
    </>
  )
}

export default Recipes
