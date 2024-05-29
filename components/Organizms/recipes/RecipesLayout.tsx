import { Box, Typography } from '@mui/material'
import React from 'react'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import CenterStack from '../../Atoms/CenterStack'
import StaticAutoComplete from '../../Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import RecipeTeaser from './RecipeTeaser'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: DropdownItem[]; baseUrl: string; featured: Recipe[] }) => {
  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }

  return (
    <Box>
      <CenterStack>
        <StaticAutoComplete options={autoComplete} placeholder={`search ${autoComplete.length} recipes`} onSelected={handleSelected} fullWidth />
      </CenterStack>
      <CenterStack sx={{ pt: 2 }}>
        <Typography variant='h4'>{'Featured Recipes'}</Typography>
      </CenterStack>
      <ScrollableBox maxHeight={800}>
        {featured.map((item, ix) => (
          <Box key={item.sys.id} py={2}>
            <RecipeTeaser item={item} showSummary />
          </Box>
        ))}
      </ScrollableBox>
    </Box>
  )
}

export default RecipesLayout
