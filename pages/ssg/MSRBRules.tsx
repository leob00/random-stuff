import React from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { Container, Table, TableBody, TableRow, TableCell } from '@mui/material'
import { Data } from 'lib/drupal/model'

export const getStaticProps: GetStaticProps = async (context) => {
  var resp = await fetch('https://dev-devtest00.pantheonsite.io/jsonapi/node/article/')
  //debugger
  let model = await resp.json()

  let rawArticles = model.data as Data[]
  let articles = rawArticles.filter((a) => a.attributes.path.alias.startsWith('/Rule'))
  return {
    props: {
      articles,
    },
  }
}

const MSRBRules: NextPage<{ articles: Data[] }> = ({ articles }) => {
  //console.log(data)
  return (
    <Container>
      <h4>Rules</h4>
      <hr></hr>
      <Table>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.attributes.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Typography>{JSON.stringify(articles)}</Typography> */}
    </Container>
  )
}

export default MSRBRules
