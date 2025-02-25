import { Box, Typography } from '@mui/material'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import CenterStack from '../../Atoms/CenterStack'
import StaticAutoComplete from '../../Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import FeaturedRecipesDisplay from './FeaturedRecipesDisplay'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: DropdownItem[]; baseUrl: string; featured: Recipe[] }) => {
  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }

  return (
    <Box py={2}>
      <CenterStack>
        <StaticAutoComplete
          options={autoComplete}
          placeholder={`search ${autoComplete.length} recipes`}
          onSelected={handleSelected}
          fullWidth
          disableClearable={false}
        />
      </CenterStack>
      <CenterStack sx={{ pt: 2 }}>
        <Typography variant='h4'>{'Featured Recipes'}</Typography>
      </CenterStack>
      <FeaturedRecipesDisplay featured={featured} />
    </Box>
  )
}

export default RecipesLayout
