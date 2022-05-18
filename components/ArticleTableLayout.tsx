import { Table, TableBody, TableRow, TableCell, Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, TableFooter, TableContainer, Paper, Container, Toolbar } from '@mui/material'
import { DrupalNode } from 'next-drupal'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid'

const ArticleTableLayout = ({ articles, baseUrl }: { articles: DrupalNode[]; baseUrl: string }) => {
  let options: Array<Option> = []
  articles.forEach((a) => {
    options.push({ label: a.attributes.title.replace('Recipe:', '').trim(), id: a.id })
  })

  const handleSelect = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option
    console.log(sel.id)
    router.push(`${baseUrl}${sel.id}`)
  }

  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: '',
      width: 360,
      renderHeader: (params: GridColumnHeaderParams<any, any, any>) => {
        return <></>
      },
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NLink href={`${baseUrl}${params.row.id}`} passHref>
            <Link>{`${params.row.label}`}</Link>
          </NLink>
        )
      },
      // valueGetter: (params: GridValueGetterParams) => {
      //   /* return (
      //     <NLink href={`${baseUrl}${params.row.id}`} passHref>
      //       <Link>{`${params.row.label}`}</Link>
      //     </NLink>
      //   ) */
      //   return `${params.row.label}`
      // },
    },
  ]

  const handleRowClick = (params: GridRowParams) => {
    console.log(params.row.id)
    router.push(`${baseUrl}${params.row.id}`)
  }

  return (
    <Box>
      <Box>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={options} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder='search' />} />
      </Box>
      <TableContainer component={Paper} sx={{ my: 2 }}>
        <DataGrid autoHeight={true} headerHeight={0} rows={options} columns={columns} pageSize={10} rowsPerPageOptions={[10]} onRowClick={handleRowClick} />

        {/* <Table>
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
          <TableFooter>
            <TableRow>
              <TableCell>{`showing ${articles.length} articles`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table> */}
      </TableContainer>
    </Box>
  )
}

export default ArticleTableLayout
