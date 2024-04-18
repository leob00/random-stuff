import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import CenterStack from '../../Atoms/CenterStack'
import StaticAutoComplete from '../../Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import RecipeTeaser from './RecipeTeaser'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: DropdownItem[]; baseUrl: string; featured: Recipe[] }) => {
  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }

  return (
    <Box>
      <CenterStack>
        <StaticAutoComplete options={autoComplete} placeholder={`search ${autoComplete.length} recipes`} onSelected={handleSelected} />
      </CenterStack>
      <Box sx={{ my: 2 }}>
        <CenterStack sx={{ pb: 4 }}>
          <Typography variant='h4'>{'Featured Recipes'}</Typography>
        </CenterStack>
        {featured.map((item, ix) => (
          <Box key={item.sys.id} py={2}>
            <RecipeTeaser item={item} showSummary />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RecipesLayout
