import { Stack, Box } from '@mui/material'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeTeaser from './RecipeTeaser'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import router from 'next/router'

const RecipeLayout = ({ article, autoComplete }: { article: Recipe; autoComplete?: DropdownItem[] }) => {
  const baseUrl = '/ssg/recipes'
  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }
  return (
    <>
      <PageHeader text={''} backButtonRoute={baseUrl} />

      <Box my={2}>
        {autoComplete && (
          <CenterStack>
            <StaticAutoComplete options={autoComplete} placeholder={`search ${autoComplete.length} recipes`} onSelected={handleSelected} />
          </CenterStack>
        )}
        <RecipeTeaser item={article} />
      </Box>
      <Stack>
        <Box m={'auto'} width={'50%'}>
          {documentToReactComponents(article.richBody.json)}
        </Box>
      </Stack>
    </>
  )
}

export default RecipeLayout
