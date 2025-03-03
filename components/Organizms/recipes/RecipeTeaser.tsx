import { Box, Link, Stack, Typography } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'

const RecipeTeaser = ({
  item,
  clickable = true,
  showSummary = true,
  showImage = true,
  imageWidth = 380,
  imageHeight = 430,
}: {
  item: Recipe
  clickable?: boolean
  showSummary?: boolean
  showImage?: boolean
  imageWidth?: number
  imageHeight?: number
}) => {
  const baseUrl = '/ssg/recipes/'

  return (
    <Box px={1}>
      <Box>
        <CenterStack>
          {clickable ? (
            <FadeIn>
              <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} />
            </FadeIn>
          ) : (
            <FadeIn>
              <Typography textAlign={'center'} variant={'h6'} py={2}>
                {item.title}
              </Typography>
            </FadeIn>
          )}
        </CenterStack>
      </Box>
      <Box>
        {showSummary && item.summary && item.summary.length > 0 && (
          <Box pb={8}>
            <FadeIn>
              <Typography textAlign={'center'}>{item.summary}</Typography>
            </FadeIn>
          </Box>
        )}
        {item.heroImage && showImage && (
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

export default RecipeTeaser
