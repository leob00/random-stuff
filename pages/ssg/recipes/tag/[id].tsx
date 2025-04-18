import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { getAllRecipes, getRecipeTagOptions } from 'lib/backend/api/cms/contenfulApi'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import { DropdownItem } from 'lib/models/dropdown'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import { Box } from '@mui/material'
import RecipeSmallTeaser from 'components/Organizms/recipes/RecipeSmallTeaser'
import router from 'next/router'
import { sortArray } from 'lib/util/collections'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'

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

type PageProps = {
  id: string
  tag?: DropdownItem
  data: Recipe[]
  allTags: DropdownItem[]
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
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
      data: sortArray(result, ['title'], ['asc']),
      allTags: sortArray(tags, ['text'], ['asc']),
    },
  }
}

const Page: NextPage<PageProps> = (pageProps) => {
  const handleSelected = (item: DropdownItem) => {
    if (item.value.includes('tag:')) {
      const split = item.value.split(':')
      router.push(`/ssg/recipes/tag/${split[1]}`)
    } else {
      router.push(`/ssg/recipes/${item.value}`)
    }
  }
  return (
    <Box py={2}>
      <Seo pageTitle={`Recipe Category: ${pageProps.id}`} />
      <ResponsiveContainer>
        <PageHeader text={pageProps.tag ? `Recipe Category: ${pageProps.tag.text}` : ''} backButtonRoute='/ssg/recipes' />
        <Box pt={2}>
          <Box py={2}>
            <CenterStack>
              <StaticAutoComplete onSelected={handleSelected} options={pageProps.allTags} placeholder={`search by ${pageProps.allTags.length} categories`} />
            </CenterStack>
          </Box>
          <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
            {pageProps.data.map((item) => (
              <Box key={item.sys.id}>
                <Box pb={2}>
                  <RecipeSmallTeaser id={pageProps.id} item={item} imageHeight={160} imageWidth={140} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </ResponsiveContainer>
    </Box>
  )
}

export default Page
