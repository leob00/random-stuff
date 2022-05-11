import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Table, TableBody, TableRow, TableCell, Link, Typography, Button, Divider } from '@mui/material'
import { getRules } from 'lib/drupalApi'
import { DrupalNode } from 'next-drupal'
import NLink from 'next/link'
import router from 'next/router'

export const getStaticProps: GetStaticProps = async (context) => {
  var articles = await getRules()

  return {
    props: {
      articles,
    },
  }
}

const MSRBRules: NextPage<{ articles: DrupalNode[] }> = ({ articles }) => {
  return (
    <Container>
      <Button
        variant='text'
        onClick={() => {
          router.back()
        }}>
        &#8592; back
      </Button>
      <Typography variant='h5'>Rules</Typography>
      <Divider />

      <Table>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <NLink href={`/ssg/rules/${article.id}`} passHref>
                  <Link>{`${article.attributes.title}`}</Link>
                </NLink>
              </TableCell>
              <TableCell>
                <Typography>{article.attributes.summary}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

export default MSRBRules
