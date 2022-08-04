import { Container } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { SWRConfig, unstable_serialize } from 'swr'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'
import { getAllRecipes, getRecipe } from 'lib/backend/api/contenfulApi'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import RecipeLayout from 'components/RecipeLayout'

const cmsRefreshIntervalSeconds = 3600

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
  return await resp.data
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

const RecipeDetails = ({ fallbackData }: { fallbackData: Recipe }) => {
  //console.log(JSON.stringify(fallbackData))
  const { data, error } = useCmsSwr('/api/recipe', fallbackData.sys.id, (url: string, id: string) => fetcherFn(url, id), fallbackData, cmsRefreshIntervalSeconds)
  if (error) {
    return <RecipeLayout article={fallbackData} baseUrl='/ssg/recipes' />
  }
  let article = data as Recipe
  if (!article) {
    return <Container>loading</Container>
  }
  return <RecipeLayout article={article} baseUrl='/ssg/recipes' />
}

const FoodRecipe: NextPage<{ fallback: any; article: Recipe }> = ({ fallback, article }) => {
  return (
    <Container>
      <SWRConfig value={{ fallback }}>
        <RecipeDetails fallbackData={article} />
      </SWRConfig>
    </Container>
  )
}

export default FoodRecipe
