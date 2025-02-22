import { Box, Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImage from 'components/Atoms/RemoteImage'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeImage from './RecipeImage'

const RecipeTeaser = ({
  item,
  clickable = true,
  showSummary = true,
  showImage = true,
}: {
  item: Recipe
  clickable?: boolean
  showSummary?: boolean
  showImage?: boolean
}) => {
  const baseUrl = '/ssg/recipes/'
  const showCardContent = showSummary && showImage

  return (
    <Card elevation={0}>
      <CardHeader
        title={
          <CenterStack>
            {clickable ? (
              <FadeIn>
                <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} large />
              </FadeIn>
            ) : (
              <FadeIn>
                <Typography textAlign={'center'} variant={'h4'}>
                  {item.title}
                </Typography>
              </FadeIn>
            )}
          </CenterStack>
        }
      />
      {showCardContent && (
        <CardContent>
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
                  <RecipeImage recipe={item} width={380} height={430} />
                </Link>
              </NLink>
            </Stack>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default RecipeTeaser
