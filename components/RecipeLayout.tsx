import { Button, Typography, Divider, Box, Container, Paper, Stack } from '@mui/material'
import router from 'next/router'
import Image from 'next/image'
import React from 'react'
import { DrupalArticle } from 'lib/model'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import ReactMarkdown from 'react-markdown'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import RemoteImage from './Atoms/RemoteImage'

const RecipeLayout = ({ article, baseUrl }: { article: Recipe; baseUrl: string }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push(baseUrl)
        }}>
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
            {/* <Image style={{ borderRadius: '.8rem' }} src={article.heroImage.url} alt={article.title} placeholder='blur' height={article.heroImage.height / 2} width={article.heroImage.width / 2} blurDataURL={article.heroImage.url} /> */}
            <RemoteImage url={article.heroImage.url} title={article.title} />
          </Stack>
        )}
        <Container>
          {/* <ReactMarkdown>{article.body}</ReactMarkdown> */}
          {documentToReactComponents(article.richBody.json)}
        </Container>
      </>
    </>
  )
}

export default RecipeLayout
