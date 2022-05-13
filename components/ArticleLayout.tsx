import { Button, Typography, Divider, Box, Container, Paper, Stack } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import router from 'next/router'
import Image from 'next/image'
import React from 'react'
import { DrupalArticle } from 'lib/model'

const ArticleLayout = ({ article, baseUrl }: { article: DrupalArticle; baseUrl: string }) => {
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
      {article.imageUrl && (
        <Stack direction='row' justifyContent='center' my={3}>
          <Image style={{ borderRadius: '.8rem' }} height={400} width={640} src={article.imageUrl} layout='intrinsic' placeholder='empty' />
        </Stack>
      )}

      <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
    </>
  )
}

export default ArticleLayout
