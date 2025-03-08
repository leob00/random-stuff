import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import RecipeTeaser from './RecipeTeaser'
import { DropdownItem } from 'lib/models/dropdown'
import BackButton from 'components/Atoms/Buttons/BackButton'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipesSearch from './RecipesSearch'
import { useSearchParams } from 'next/navigation'
import RecipeTagsList from './RecipeTagsList'
import CenterStack from 'components/Atoms/CenterStack'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const baseUrl = '/ssg/recipes/'
  const ret = useSearchParams()?.get('ret')
  const backUrl = ret ? ret : baseUrl

  const tags = article.recipeTagsCollection.items ?? []

  return (
    <>
      <Box>
        <Box py={2}>
          <BackButton route={backUrl} />
        </Box>
        {autoComplete && (
          <CenterStack sx={{ pt: 2 }}>
            <RecipesSearch autoComplete={autoComplete} />
          </CenterStack>
        )}
      </Box>
      <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
        <RecipeTeaser item={article} clickable={false} showSummary={false} />
      </Stack>
      {article.summary && (
        <Box py={2}>
          <FadeIn>
            <Typography textAlign={'center'}>{article.summary}</Typography>
          </FadeIn>
        </Box>
      )}
      <RecipeTagsList tags={tags} />
      <Box px={2}>{documentToReactComponents(article.richBody.json)}</Box>
    </>
  )
}

export default RecipeLayout
