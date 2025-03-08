import { Box, Link } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import Clickable from 'components/Atoms/Containers/Clickable'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'

const RecipeSmallTeaser = ({ id, item, imageWidth = 380, imageHeight = 430 }: { id: string; item: Recipe; imageWidth?: number; imageHeight?: number }) => {
  const baseUrl = '/ssg/recipes/'

  return (
    <Box px={1} sx={{ border: `solid 1px ${VeryLightBlueTransparent}`, borderRadius: '8px' }}>
      <Box pt={2}>
        {item.heroImage && (
          <Box display={'flex'}>
            <NLink href={`${baseUrl}${item.sys.id}?ret=/ssg/recipes/tag/${id}`} passHref legacyBehavior>
              <Link>
                <RecipeImage recipe={item} width={imageWidth} height={imageHeight} />
              </Link>
            </NLink>
          </Box>
        )}
      </Box>
      <Box display={'flex'} justifyContent={'center'} maxWidth={imageWidth}>
        <FadeIn>
          <Box textAlign={'center'} minHeight={60}>
            <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}?ret=/ssg/recipes/tag/${id}`} variant='caption' />
          </Box>
        </FadeIn>
      </Box>
    </Box>
  )
}

export default RecipeSmallTeaser
