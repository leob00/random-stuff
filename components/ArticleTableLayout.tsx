import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link,
  Box,
  Autocomplete,
  TextField,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
  TableFooter,
  TableContainer,
  Paper,
  Container,
  Toolbar,
  Stack,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
} from '@mui/material'
import { DrupalNode } from 'next-drupal'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridRowParams, GridValueGetterParams } from '@mui/x-data-grid'
import { DrupalArticle } from 'lib/model'
import { Article, Label } from '@mui/icons-material'
import ArticleLayout from './ArticleLayout'
import Image from 'next/image'

const ArticleTableLayout = ({ articles, baseUrl, featuredArticle }: { articles: DrupalNode[]; baseUrl: string; featuredArticle?: DrupalArticle }) => {
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
      <Box sx={{ my: 2 }}>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={options} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder='search' />} />
      </Box>
      {featuredArticle && (
        <>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
              <Card sx={{ maxWidth: 350, padding: 2 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Featured Recipe
                  </Typography>
                  <Typography variant='body2'>
                    <NLink href={`${baseUrl}${featuredArticle.id}`} passHref>
                      <Link> {featuredArticle.attributes.title.replace('Recipe:', '').trim()}</Link>
                    </NLink>
                  </Typography>
                </CardContent>
                <CardMedia>
                  {featuredArticle.imageUrl && featuredArticle.fileMeta && (
                    <NLink href={`${baseUrl}${featuredArticle.id}`} passHref>
                      <Link>
                        <Image style={{ borderRadius: '.8rem' }} src={featuredArticle.imageUrl} placeholder='blur' height={featuredArticle.fileMeta.height / 4} width={featuredArticle.fileMeta.width / 4} blurDataURL={featuredArticle.imageUrl} />
                      </Link>
                    </NLink>
                  )}
                </CardMedia>
              </Card>
            </Stack>
          </Box>
        </>
      )}

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
