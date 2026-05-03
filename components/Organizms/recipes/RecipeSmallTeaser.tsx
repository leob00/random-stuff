'use client'
import { Box, Link, useTheme } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import NLink from 'next/link'
import RecipeImage from './RecipeImage'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import HoverEffect from 'components/Molecules/Lists/HoverEffect'

const RecipeSmallTeaser = ({ id, item, imageWidth = 380, imageHeight = 430 }: { id: string; item: Recipe; imageWidth?: number; imageHeight?: number }) => {
  const theme = useTheme()
  const baseUrl = '/general-interest/recipes/'
  const title = item.title.length > 30 ? `${item.title.substring(0, 25)}...` : item.title

  return (
    <Box minHeight={278}>
      <HoverEffect>
        <Box px={1} pb={1} sx={{ border: `outset 1px ${theme.palette.info.main}`, borderRadius: '8px' }} minHeight={275}>
          <Box pt={2}>
            {item.heroImage && (
              <Box display={'flex'}>
                <Link href={`${baseUrl}${item.sys.id}?ret=/general-interest/recipeTags/tag/${id}`} component={NLink}>
                  <RecipeImage recipe={item} width={imageWidth} height={imageHeight} />
                </Link>
              </Box>
            )}
          </Box>
          <Box display={'flex'} justifyContent={'center'} maxWidth={imageWidth} textAlign={'center'}>
            <InternalLink text={title} route={`${baseUrl}${item.sys.id}?ret=/general-interest/recipeTags/tag/${id}`} variant='caption' />
          </Box>
        </Box>
      </HoverEffect>
    </Box>
  )
}

export default RecipeSmallTeaser
