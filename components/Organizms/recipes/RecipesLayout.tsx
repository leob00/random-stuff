import { Box, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import CenterStack from '../../Atoms/CenterStack'
import FeaturedRecipesDisplay from './FeaturedRecipesDisplay'

const RecipesLayout = ({ featured }: { featured: Recipe[] }) => {
  return (
    <Box py={2}>
      <CenterStack sx={{ pb: 1 }}>
        <Typography variant='h4'>{'Featured'}</Typography>
      </CenterStack>
      <FeaturedRecipesDisplay featured={featured} />
    </Box>
  )
}

export default RecipesLayout
