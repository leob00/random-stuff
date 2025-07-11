import { Box, Link } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'

const RecipeSmallTeaser = ({ id, item, imageWidth = 380, imageHeight = 430 }: { id: string; item: Recipe; imageWidth?: number; imageHeight?: number }) => {
  const baseUrl = '/ssg/recipes/'
  const title = item.title.length > 30 ? `${item.title.substring(0, 25)}...` : item.title
  return (
    <Box px={1} pb={1} sx={{ border: `solid 1px ${VeryLightBlueTransparent}`, borderRadius: '8px' }} minHeight={275}>
      <Box pt={2}>
        {item.heroImage && (
          <Box display={'flex'}>
            <Link href={`${baseUrl}${item.sys.id}?ret=/ssg/recipes/tag/${id}`} component={NLink}>
              <RecipeImage recipe={item} width={imageWidth} height={imageHeight} />
            </Link>
          </Box>
        )}
      </Box>
      <Box display={'flex'} justifyContent={'center'} maxWidth={imageWidth} textAlign={'center'}>
        <InternalLink text={title} route={`${baseUrl}${item.sys.id}?ret=/ssg/recipes/tag/${id}`} variant='caption' />
      </Box>
    </Box>
  )
}

export default RecipeSmallTeaser
