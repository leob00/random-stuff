import { Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, TableContainer, Paper, Stack, Card, CardContent, CardMedia, CardActions, Button, CardHeader } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import { ArticlesModel, DrupalArticle } from 'lib/model'
import Image from 'next/image'

const ArticleTableLayout = ({ articles, baseUrl, featuredArticle }: { articles: ArticlesModel; baseUrl: string; featuredArticle?: DrupalArticle }) => {
  let options: Array<Option> = []
  articles.allArticles.forEach((a) => {
    options.push({ label: a.attributes.title.replace('Recipe:', '').trim(), id: a.id })
  })

  function getWindowDimensions() {
    const hasWindow = typeof window !== 'undefined'
    if (hasWindow) {
      const { innerWidth: width, innerHeight: height } = window
      return {
        width,
        height,
      }
    }
    return {
      width: 500,
      height: 500,
    }
  }
  let dimension = getWindowDimensions()
  console.log(`window width: ${dimension.width} image width: ${featuredArticle?.fileMeta?.width}`)
  let imageWidth = 500
  let imageHeight = 500
  if (featuredArticle && featuredArticle.fileMeta) {
    let w = featuredArticle.fileMeta.width
    let h = featuredArticle.fileMeta.height
    if (dimension.width < w) {
      imageWidth = w / 3
      imageHeight = h / 3
    }
  }

  const handleSelect = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option
    //console.log(sel.id)
    router.push(`${baseUrl}${sel.id}`)
  }

  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: '',
      width: 360,
      align: 'left',
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
    },
  ]

  const handleRowClick = (params: GridRowParams) => {
    console.log(params.row.id)
    router.push(`${baseUrl}${params.row.id}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={options} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder='search' />} />
      </Stack>
      {featuredArticle && (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Typography variant='h6'>Featured Recipe</Typography>
          </Stack>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Typography variant='body2'>
              <NLink href={`${baseUrl}${featuredArticle.id}`} passHref>
                <Button size='small'>{featuredArticle.attributes.title.replace('Recipe:', '').trim()}</Button>
              </NLink>
            </Typography>
          </Stack>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            {featuredArticle.imageUrl && featuredArticle.fileMeta && (
              <>
                <NLink href={`${baseUrl}${featuredArticle.id}`} passHref>
                  <Link>
                    <Image
                      alt={featuredArticle.attributes.title}
                      style={{ borderRadius: '.8rem' }}
                      src={featuredArticle.imageUrl}
                      placeholder='blur'
                      height={featuredArticle.fileMeta.height / 3}
                      width={featuredArticle.fileMeta.height / 3}
                      blurDataURL={featuredArticle.imageUrl}
                      //layout='intrinsic'
                      //objectFit='contain'
                      //layout='fill'
                      //objectFit='cover'
                    />
                  </Link>
                </NLink>
                <Typography variant='body1' sx={{ my: 2 }}>
                  {featuredArticle.attributes.body.summary}
                </Typography>
              </>
            )}
          </Stack>
        </Box>
      )}
      {/*  <TableContainer sx={{ my: 2 }}>
        <DataGrid sx={{ border: 'none' }} autoHeight={true} headerHeight={0} rows={options} columns={columns} pageSize={10} rowsPerPageOptions={[10]} onRowClick={handleRowClick} />
      </TableContainer> */}
    </Box>
  )
}

export default ArticleTableLayout
