import { Container } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import useSWR, { SWRConfig, unstable_serialize, Fetcher } from 'swr'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'
import { getAllRecipes, getRecipe } from 'lib/backend/api/contenfulApi'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import RecipeLayout from 'components/RecipeLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'

const cmsRefreshIntervalSeconds = 86400

export const getStaticPaths: GetStaticPaths = async () => {
  let model = await getAllRecipes()

  let paths = model.items.map((article) => `/ssg/recipes/${article.sys.id}`)

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
  const recipe = resp.data as Recipe
  console.log('fetcherFn - recipe fetched: ', recipe.title)
  return recipe
}

export const getStaticProps: GetStaticProps = async (context) => {
  let id = context.params?.id as string
  //console.log(id)
  let article = await getRecipe(id)

  return {
    props: {
      fallback: {
        [unstable_serialize(['api', 'recipe', id])]: article,
      },
      article,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Cached = ({ fallbackData }: { fallbackData: Recipe }) => {
  //console.log(JSON.stringify(fallbackData))
  const fetcher: Fetcher<Recipe, string> = (id) => fetcherFn('/api/recipe', id)

  const { data, error } = useSWR(fallbackData.sys.id, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalSeconds * 1000,
  })

  if (error) {
    return <RecipeLayout article={fallbackData} baseUrl='/ssg/recipes' />
  }
  let article = data as Recipe
  if (!article) {
    return <Container>loading</Container>
  }
  return <RecipeLayout article={article} baseUrl='/ssg/recipes' />
}

const FoodRecipe: NextPage<{ fallback: Recipe; article: Recipe }> = ({ fallback, article }) => {
  return (
    <>
      <Seo pageTitle={`Recipe: ${article.title}`} />
      <ResponsiveContainer>
        <SWRConfig value={{ fallback }}>
          <Cached fallbackData={article} />
        </SWRConfig>
      </ResponsiveContainer>
    </>
  )
}

export default FoodRecipe
