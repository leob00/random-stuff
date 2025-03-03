import { Box, Link } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const RecipeSmallTeaser = ({ id, item, imageWidth = 380, imageHeight = 430 }: { id: string; item: Recipe; imageWidth?: number; imageHeight?: number }) => {
  const baseUrl = '/ssg/recipes/'

  return (
    <Box px={1}>
      <ScrollableBox maxHeight={imageHeight + 118}>
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
            <Box minHeight={130}>
              <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}?ret=/ssg/recipes/tag/${id}`} />
            </Box>
          </FadeIn>
        </Box>
      </ScrollableBox>
    </Box>
  )
}

export default RecipeSmallTeaser
