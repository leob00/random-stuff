import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container } from '@mui/material'
import useSWR, { SWRConfig } from 'swr'
import axios from 'axios'
import { getAllRecipes } from 'lib/backend/api/contenfulApi'
import { orderBy, shuffle, take } from 'lodash'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import RecipesLayout from 'components/RecipesLayout'
import { Option } from 'lib/AutoCompleteOptions'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'

const cmsRefreshIntervalSeconds = 3600
const cmsRefreshIntervalMs = cmsRefreshIntervalSeconds * 1000

const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data as RecipeCollection
}

export const getStaticProps: GetStaticProps = async (context) => {
  let model = await getAllRecipes()
  const featured = take(shuffle(model.items), 10)

  return {
    props: {
      model: model,
      fallback: {
        '/api/recipes': model,
      },
      featured: featured,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const CachedRecipes = ({ fallbackData, featured }: { fallbackData: RecipeCollection; featured: Recipe[] }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalMs,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  let search: Option[] = []
  if (error) {
    return <RecipesLayout autoComplete={search} baseUrl='/ssg/recipes/' featured={featured} />
  }
  if (!data) {
    return <Container>loading...</Container>
  }
  let model = data as RecipeCollection
  //let ordered = orderBy(model.items, ['title'], ['asc'])
  let options = model.items.map((item) => ({ id: item.sys.id, label: item.title })) as Option[]
  options = orderBy(options, ['label'], ['asc'])
  //const shuffled = shuffle(featured)
  return <RecipesLayout autoComplete={options} baseUrl='/ssg/recipes/' featured={featured} />
}

const Recipes: NextPage<{ model: RecipeCollection; fallback: any; featured: Recipe[] }> = ({ model, fallback, featured }) => {
  return (
    <ResponsiveContainer>
      <BackToHomeButton />
      <SWRConfig value={{ fallback }}>
        <CachedRecipes fallbackData={model} featured={featured} />
      </SWRConfig>
    </ResponsiveContainer>
  )
}

export default Recipes
