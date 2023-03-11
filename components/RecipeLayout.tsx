import { Typography, Container, Stack, Box } from '@mui/material'
import router from 'next/router'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import RemoteImage from './Atoms/RemoteImage'
import CenteredHeader from './Atoms/Boxes/CenteredHeader'
import BackButton from './Atoms/Buttons/BackButton'
import HorizontalDivider from './Atoms/Dividers/HorizontalDivider'

const RecipeLayout = ({ article, baseUrl }: { article: Recipe; baseUrl: string }) => {
  return (
    <>
      <BackButton
        onClicked={() => {
          router.push(baseUrl)
        }}
      />
      <>
        <CenteredHeader title={article.title} description={''} />
        <Box sx={{ py: 1 }}>
          <Typography variant='body1' sx={{ paddingBottom: 2, textAlign: 'center' }}>
            {article.summary}
          </Typography>
        </Box>
        {article.heroImage && (
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <RemoteImage url={article.heroImage.url} title={article.title ? article.title : ''} />
          </Stack>
        )}
        <Box>{documentToReactComponents(article.richBody.json)}</Box>
      </>
    </>
  )
}

export default RecipeLayout
