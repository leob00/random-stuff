import { Box, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import CenterStack from '../../Atoms/CenterStack'
import RecipeSmallTeaser from './RecipeSmallTeaser'

const RecipesLayout = ({ featured }: { featured: Recipe[] }) => {
  return (
    <Box py={2}>
      <CenterStack sx={{ pb: 1 }}>
        <Typography variant='h5'>{'Featured'}</Typography>
      </CenterStack>
      <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'left'} py={2}>
        {featured.map((item) => (
          <Box key={item.sys.id}>
            <Box pb={2}>
              <RecipeSmallTeaser id={item.title} item={item} imageHeight={160} imageWidth={140} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RecipesLayout
