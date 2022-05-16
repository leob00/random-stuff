import { Table, TableBody, TableRow, TableCell, Typography, Link, Container, Box } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import React from 'react'
import NLink from 'next/link'

const ArticleTableLayout = ({ articles, baseUrl }: { articles: DrupalNode[]; baseUrl: string }) => {
  return (
    <Box>
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
    </Box>
  )
}

export default ArticleTableLayout
