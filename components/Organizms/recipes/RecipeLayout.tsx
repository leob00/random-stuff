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
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeImage from './RecipeImage'
import Clickable from 'components/Atoms/Containers/Clickable'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const baseUrl = '/ssg/recipes/'
  const ret = useSearchParams()?.get('ret')
  const backUrl = ret ? ret : baseUrl

  const tags = article.recipeTagsCollection.items ?? []
  const handleImageClicked = (item: Recipe) => {}

  return (
    <>
      <PageHeader text={article.title} backButtonRoute={backUrl} />
      <Box py={1}>
        <BackButton route={backUrl} />
      </Box>

      {article.summary && (
        <Box py={2}>
          <FadeIn>
            <Typography textAlign={'center'}>{article.summary}</Typography>
          </FadeIn>
        </Box>
      )}

      <Box display={'flex'}>
        <Clickable
          onClicked={() => {
            handleImageClicked(article)
          }}
        >
          <RecipeImage recipe={article} width={220} height={220} />
        </Clickable>
      </Box>
      <Box py={2}>
        <RecipeTagsList tags={tags} />
      </Box>
      <Box px={2}>{documentToReactComponents(article.richBody.json)}</Box>
    </>
  )
}

export default RecipeLayout
