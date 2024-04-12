import { Box, Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import RemoteImage from 'components/Atoms/RemoteImage'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import React from 'react'
import NLink from 'next/link'

const RecipeTeaser = ({ item }: { item: Recipe }) => {
  const baseUrl = '/ssg/recipes/'
  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <CenterStack>
            <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} large />
          </CenterStack>
        }
      />
      <CardContent>
        {item.summary && item.summary.length > 0 && (
          <Box pb={8}>
            <Typography textAlign={'center'}>{item.summary}</Typography>
          </Box>
        )}
        <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
          {item.heroImage && (
            <Card elevation={4} sx={{ borderRadius: '16px' }}>
              <NLink href={`${baseUrl}${item.sys.id}`} passHref legacyBehavior as={`${baseUrl}${item.sys.id}`}>
                <Link href={`${baseUrl}${item.sys.id}`}>
                  <Box>
                    <RemoteImage url={item.heroImage.url} title={item.title} />
                  </Box>
                </Link>
              </NLink>
            </Card>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default RecipeTeaser
