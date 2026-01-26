import { Stack } from '@mui/material'
import Clickable from 'components/Atoms/Containers/Clickable'
import RemoteImage from 'components/Atoms/RemoteImage'
import { Recipe } from 'lib/models/cms/contentful/recipe'

const RecipeImage = ({ recipe, width, height, onClicked }: { recipe: Recipe; width: number; height: number; onClicked?: (item: Recipe) => void }) => {
  return (
    <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
      {onClicked ? (
        <Clickable
          onClicked={() => {
            onClicked(recipe)
          }}
        >
          <RemoteImage url={recipe.heroImage.url} title={recipe.title} width={width} height={height} />
        </Clickable>
      ) : (
        <RemoteImage url={recipe.heroImage.url} title={recipe.title} width={width} height={height} />
      )}
    </Stack>
  )
}

export default RecipeImage
