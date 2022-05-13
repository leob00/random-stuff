import { Table, TableBody, TableRow, TableCell, Typography, Link, Container } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import React from 'react'
import NLink from 'next/link'

const ArticleTableLayout = ({ articles, baseUrl }: { articles: DrupalNode[]; baseUrl: string }) => {
  return (
    <Container>
      <Table>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <NLink href={`${baseUrl}${article.id}`} passHref>
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
    </Container>
  )
}

export default ArticleTableLayout
