import { Button, Typography, Divider, Container, Stack } from '@mui/material'
import router from 'next/router'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import RemoteImage from './Atoms/RemoteImage'

const RecipeLayout = ({ article, baseUrl }: { article: Recipe; baseUrl: string }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push(baseUrl)
        }}
      >
        &#8592; back
      </Button>
      <>
        <Typography variant='h6'>{article.title}</Typography>
        <Divider></Divider>
        <Container sx={{ my: 2 }}>
          <Typography variant='body1' sx={{ paddingBottom: 2, textAlign: 'center' }}>
            {article.summary}
          </Typography>
        </Container>
        {article.heroImage && (
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <RemoteImage url={article.heroImage.url} title={article.title ? article.title : ''} />
          </Stack>
        )}
        <Container>{documentToReactComponents(article.richBody.json)}</Container>
      </>
    </>
  )
}

export default RecipeLayout
