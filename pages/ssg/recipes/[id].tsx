import { Container } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import useSWR, { SWRConfig, unstable_serialize, Fetcher } from 'swr'
import { useCmsSwr } from 'hooks/useCmsSwr'
import axios, { AxiosRequestConfig } from 'axios'
import { getAllRecipes, getRecipe } from 'lib/backend/api/contenfulApi'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import RecipeLayout from 'components/Organizms/recipes/RecipeLayout'
import { sortArray } from 'lib/util/collections'
import { DropdownItem } from 'lib/models/dropdown'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

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
  return recipe
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const article = await getRecipe(id)
  const recipeCollection = await getAllRecipes()
  let options: DropdownItem[] = recipeCollection.items.map((item) => {
    return { value: item.sys.id, text: item.title }
  })
  options = sortArray(options, ['text'], ['asc'])

  return {
    props: {
      fallback: {
        [unstable_serialize(['api', 'recipe', id])]: article,
      },
      article,
      options,
    },
    revalidate: cmsRefreshIntervalSeconds,
  }
}

const Cached = ({ fallbackData, options, selectedOption }: { fallbackData: Recipe; options?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const fetcher: Fetcher<Recipe, string> = (id) => fetcherFn('/api/recipe', id)

  const { data, error } = useSWR(fallbackData.sys.id, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshIntervalSeconds * 1000,
  })

  if (error) {
    return <RecipeLayout article={fallbackData} />
  }
  let article = data as Recipe
  if (!article) {
    return <BackdropLoader />
  }
  return <RecipeLayout article={article} autoComplete={options} selectedOption={selectedOption} />
}

const FoodRecipe: NextPage<{ fallback: Recipe; article: Recipe; options?: DropdownItem[] }> = ({ fallback, article, options }) => {
  const selectedOption = options?.find((m) => m.value == article.sys.id)
  return (
    <>
      <Seo pageTitle={`Recipe: ${article.title}`} />
      <ResponsiveContainer>
        <SWRConfig value={{ fallback }}>
          <Cached fallbackData={article} options={options} selectedOption={selectedOption} />
        </SWRConfig>
      </ResponsiveContainer>
    </>
  )
}

export default FoodRecipe
