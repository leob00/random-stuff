import { Button, Typography, Divider, Box } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import router from 'next/router'
import React from 'react'

const ArticleLayout = ({ article, baseUrl }: { article: DrupalNode; baseUrl: string }) => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push(baseUrl)
        }}>
        &#8592; back
      </Button>
      <Typography variant='h6'>{article.attributes.title}</Typography>
      <Divider></Divider>
      <Typography variant='body1'>{article.attributes.body.summary}</Typography>
      <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
    </>
  )
}

export default ArticleLayout
