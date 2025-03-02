import { Box, Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImage from 'components/Atoms/RemoteImage'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'

const RecipeSmallTeaser = ({ item, imageWidth = 380, imageHeight = 430 }: { item: Recipe; imageWidth?: number; imageHeight?: number }) => {
  const baseUrl = '/ssg/recipes/'

  return (
    <Box px={1}>
      <Box display={'flex'} justifyContent={'center'} maxWidth={imageWidth} minHeight={130}>
        <FadeIn>
          <Box>
            <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} />
          </Box>
        </FadeIn>
      </Box>
      <Box>
        {item.heroImage && (
          <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
            <NLink href={`${baseUrl}${item.sys.id}`} passHref legacyBehavior as={`${baseUrl}${item.sys.id}`}>
              <Link href={`${baseUrl}${item.sys.id}`}>
                <RecipeImage recipe={item} width={imageWidth} height={imageHeight} />
              </Link>
            </NLink>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default RecipeSmallTeaser
