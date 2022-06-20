import { Button, Typography, Divider, Box, Container, Paper, Stack } from '@mui/material'
import router from 'next/router'
import Image from 'next/image'
import React from 'react'
import { DrupalArticle } from 'lib/model'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import ReactMarkdown from 'react-markdown'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

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
        {article.heroImage && (
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Box sx={{ borderRadius: '.8rem', backgroundColor: 'whitesmoke', padding: 0.2 }}>
              <Image style={{ borderRadius: '.8rem' }} src={article.heroImage.url} alt={article.title} placeholder='blur' height={article.heroImage.height / 2} width={article.heroImage.width / 2} blurDataURL={article.heroImage.url} />
            </Box>
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
