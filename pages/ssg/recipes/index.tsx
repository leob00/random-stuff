import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Table, TableBody, TableRow, TableCell, Link, Typography, Button, Divider } from '@mui/material'
import { getRecipes } from 'lib/drupalApi'
import { DrupalNode } from 'next-drupal'
import NLink from 'next/link'
import router from 'next/router'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'
import axios, { AxiosRequestConfig } from 'axios'

const cmsRefreshInterval = 90000
const fetcherFn = async (url: string) => {
  let resp = await axios.get(url)
  return resp.data
}

export const getStaticProps: GetStaticProps = async (context) => {
  var articles = await getRecipes()

  return {
    props: {
      articles,
      fallback: {
        '/api/recipes': articles,
      },
    },
  }
}

const Articles = ({ fallbackData }: { fallbackData: DrupalNode[] }) => {
  const { data, error } = useSWR(['/api/recipes'], (url: string) => fetcherFn(url), {
    fallbackData: fallbackData,
    refreshInterval: cmsRefreshInterval,
  })
  if (error) {
    return <Container>unable to load content</Container>
  }
  let articles = data as DrupalNode[]
  if (!articles) {
    return <Container>loading...</Container>
  }
  return (
    <>
      <Table>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <NLink href={`/ssg/recipes/${article.id}`} passHref>
                  <Link>{`${article.attributes.title.replace('Recipe:', '').trim()}`}</Link>
                </NLink>
              </TableCell>
              <TableCell>
                <Typography>{article.attributes.summary}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

const Recipes: NextPage<{ articles: DrupalNode[]; fallback: any }> = ({ articles, fallback }) => {
  return (
    <Container>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}>
        &#8592; back
      </Button>
      <Typography variant='h5'>Recipes</Typography>
      <SWRConfig value={{ fallback }}>
        <Articles fallbackData={articles} />
      </SWRConfig>
    </Container>
  )
}

export default Recipes
