import { Table, TableBody, TableRow, TableCell, Typography, Link, Container, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import { Router } from '@mui/icons-material'
import router from 'next/router'

const ArticleTableLayout = ({ articles, baseUrl }: { articles: DrupalNode[]; baseUrl: string }) => {
  let options: Array<Option> = [
    // {
    //   label: 'search',
    //   id: '',
    // },
    // { label: 'The Godfather', id: '1' },
    // { label: 'Pulp Fiction', id: '2' },
  ]
  articles.forEach((a) => {
    options.push({ label: a.attributes.title.replace('Recipe:', '').trim(), id: a.id })
  })

  const handleSelect = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option
    console.log(sel.id)
    router.push(`${baseUrl}${sel.id}`)
  }

  return (
    <Box>
      <Box>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={options} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder='search' />} />
      </Box>
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
