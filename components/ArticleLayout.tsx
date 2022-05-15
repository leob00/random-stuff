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
      {
        article.imageUrl && article.fileMeta && (
          <Stack direction='row' justifyContent='center' sx={{ height: article.fileMeta.height / 2, width: article.fileMeta.width / 2, my: 2 }}>
            <Image style={{ borderRadius: '.8rem' }} src={article.imageUrl} layout='intrinsic' objectFit='contain' placeholder='blur' height={article.fileMeta.height} width={article.fileMeta.width} blurDataURL={article.imageUrl} />
          </Stack>
        )
        // article.fileMeta && <Image style={{ borderRadius: '.8rem', marginTop: 2 }} height={article.fileMeta.height} width={article.fileMeta.width} src={article.imageUrl} placeholder='blur' blurDataURL={article.imageUrl} />}
      }
      <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
    </>
  )
}

export default ArticleLayout
