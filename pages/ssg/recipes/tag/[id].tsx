import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import useSWR, { SWRConfig, unstable_serialize, Fetcher } from 'swr'
import axios, { AxiosRequestConfig } from 'axios'
import { getAllRecipes, getRecipe, getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import RecipeLayout from 'components/Organizms/recipes/RecipeLayout'
import { sortArray } from 'lib/util/collections'
import { DropdownItem } from 'lib/models/dropdown'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { Box } from '@mui/material'
import RecipeTeaser from 'components/Organizms/recipes/RecipeTeaser'
import { VeryLightBlue, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import RecipeSmallTeaser from 'components/Organizms/recipes/RecipeSmallTeaser'

export const getStaticPaths: GetStaticPaths = async () => {
  const allRecipes = await getAllRecipes()
  const tagged = (await getRecipeTagOptions(allRecipes.items)).map((m) => m.value)
  const cleaned = tagged.map((m) => m.replace('tag:', ''))
  const paths = cleaned.map((m) => `/ssg/recipes/tag/${m}`)

  return {
    paths: paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const recipeCollection = await getAllRecipes()
  const filtered = recipeCollection.items.filter((m) => m.recipeTagsCollection.items.length > 0)
  const tags = await getRecipeTagOptions(filtered)
  const tag = tags.find((m) => m.value == `tag:${id}`)
  const result: Recipe[] = []
  filtered.forEach((m) => {
    if (m.recipeTagsCollection.items.some((t) => t.id === id)) {
      result.push({ ...m })
    }
  })

  return {
    props: {
      id: id,
      tag: tag,
      data: result,
    },
  }
}

const Page: NextPage<{ id: string; tag: DropdownItem; data: Recipe[] }> = ({ id, tag, data }) => {
  return (
    <Box py={2}>
      <Seo pageTitle={`Recipe: ${id}`} />
      <ResponsiveContainer>
        <PageHeader text={tag ? `${tag.text}` : ''} backButtonRoute='/ssg/recipes' />
        <Box pt={2}>
          <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
            {data.map((item) => (
              <Box key={item.sys.id} sx={{ border: `solid 1px ${VeryLightBlueTransparent}`, borderRadius: '8px' }} pb={2}>
                <RecipeSmallTeaser item={item} imageHeight={160} imageWidth={140} />
              </Box>
            ))}
          </Box>
        </Box>
      </ResponsiveContainer>
    </Box>
  )
}

export default Page
