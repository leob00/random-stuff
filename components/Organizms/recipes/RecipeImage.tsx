import { Stack } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RemoteImage from 'components/Atoms/RemoteImage'
import { Recipe } from 'lib/models/cms/contentful/recipe'

const RecipeImage = ({ recipe, width, height }: { recipe: Recipe; width: number; height: number }) => {
  return (
    <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
      <RemoteImage url={recipe.heroImage.url} title={recipe.title} width={width} height={height} />
    </Stack>
  )
}

export default RecipeImage
