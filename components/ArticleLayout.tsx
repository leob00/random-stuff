import { Button, Typography, Divider, Box, Container, Paper, Stack } from '@mui/material'
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
      <>
        <Typography variant='h6'>{article.attributes.title}</Typography>
        <Divider></Divider>
        <Typography variant='body1' sx={{ my: 2 }}>
          {article.attributes.body.summary}
        </Typography>
        {article.imageUrl && article.fileMeta && (
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Image style={{ borderRadius: '.8rem' }} src={article.imageUrl} alt={article.attributes.title} placeholder='blur' height={article.fileMeta.height / 2} width={article.fileMeta.width / 2} blurDataURL={article.imageUrl} />
          </Stack>
        )}
        <Box dangerouslySetInnerHTML={{ __html: article.attributes.body.processed }}></Box>
      </>
    </>
  )
}

export default ArticleLayout
