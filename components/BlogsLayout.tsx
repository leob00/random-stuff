import { ArrowBack, ArrowBackIos, ArrowForwardIos, SwipeLeftAltRounded } from '@mui/icons-material'
import { Box, Button, Link, Paper, TableContainer, Typography } from '@mui/material'
import { BlogCollection, Item } from 'lib/models/cms/contentful/blog'
import { PagedCollection, pageItems } from 'lib/util/collections'
import NLink from 'next/link'
import React, { useEffect, useState } from 'react'
import Pager from './Atoms/Pager'
import { DataGrid, GridColDef, GridColumnHeaderParams, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'

const BlogsLayout = ({ model }: { model: BlogCollection }) => {
  const itemsPerPage = 1
  const paged = pageItems(model.items, itemsPerPage) as PagedCollection
  const displayed = paged.pages[0].items as Item[]
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [displayItems, setDisplayItems] = useState<Item[]>(displayed)

  const handleNextClick = () => {
    let idx = currentPageIndex + 1
    setCurrentPageIndex(idx)
    let pagedItems = paged.pages[idx].items as Item[]
    setDisplayItems(pagedItems)
  }
  const handlePreviousClick = () => {
    let idx = currentPageIndex - 1
    setCurrentPageIndex(idx)
    let pagedItems = paged.pages[idx].items as Item[]
    setDisplayItems(pagedItems)
  }
  let title = displayed[0].title
  let summary = displayed[0].summary
  let body = displayed[0].body
  let count = model.items.length

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let pagedItems = paged.pages[pageNum].items as Item[]
    setDisplayItems(pagedItems)
  }

  useEffect(() => {
    const displayed = paged.pages[currentPageIndex].items as Item[]
    setDisplayItems(displayed)
  }, [count, title, summary, body])

  return (
    <>
      <Box sx={{ my: 2, minHeight: 360 }}>
        {displayItems.map((item) => (
          <Box key={item.id} sx={{ paddingBottom: 4 }}>
            <Typography variant='h6'>{item.title}</Typography>
            <Typography variant='body2' sx={{ paddingTop: 2 }}>
              {item.summary}
            </Typography>
            <Typography variant='body2' sx={{ paddingTop: 2 }}>
              {item.body}
            </Typography>
            <Typography variant='body2' sx={{ paddingTop: 2 }}>
              <NLink href={item.externalUrl} passHref>
                <Link target='_blank'>Read More</Link>
              </NLink>
            </Typography>
          </Box>
        ))}
      </Box>
      <Pager pageCount={paged.pages.length} itemCount={model.items.length} itemsPerPage={itemsPerPage} onPaged={(pageNum: number) => handlePaged(pageNum)}></Pager>
    </>
  )
}

export default BlogsLayout
