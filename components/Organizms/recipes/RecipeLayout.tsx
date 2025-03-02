import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeTeaser from './RecipeTeaser'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import router from 'next/router'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import BackButton from 'components/Atoms/Buttons/BackButton'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RemoteImage from 'components/Atoms/RemoteImage'
import RecipesSearch from './RecipesSearch'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const baseUrl = '/ssg/recipes/'
  const scroller = useScrollTop(0)
  const handleSelected = (item: DropdownItem) => {
    scroller.scroll()
    if (item.value.includes('tag:')) {
    } else {
      router.push(`${baseUrl}${item.value}`)
    }
  }
  return (
    <>
      <Box>
        <Box py={2}>
          <BackButton route={baseUrl} />
        </Box>
        {autoComplete && (
          <Box py={2}>
            <RecipesSearch autoComplete={autoComplete} />
          </Box>
        )}
      </Box>
      <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
        <FadeIn>
          <RemoteImage url={article.heroImage.url} title={article.title} />
        </FadeIn>
      </Stack>
      {article.summary && (
        <Box py={2}>
          <FadeIn>
            <Typography textAlign={'center'}>{article.summary}</Typography>
          </FadeIn>
        </Box>
      )}

      <Box px={2}>{documentToReactComponents(article.richBody.json)}</Box>
    </>
  )
}

export default RecipeLayout
