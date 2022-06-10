import { ArrowBack, ArrowBackIos, ArrowForwardIos, SwipeLeftAltRounded } from '@mui/icons-material'
import { Box, Button, Link, Typography } from '@mui/material'
import { BlogCollection, Item } from 'lib/models/cms/contentful/blog'
import { pageItems } from 'lib/util/collections'
import NLink from 'next/link'
import React, { useState } from 'react'

const BlogsLayout = ({ model }: { model: BlogCollection }) => {
  const paged = pageItems(model.items, 2) as unknown as Item[]
  const displayed = paged[0] as unknown as Item[]
  const [pageIndex, setPageIndex] = useState(0)
  const [displayItems, setDisplayItems] = useState<Item[]>(displayed)
  const [allChunks] = useState<Item[]>(paged)

  const handleNextClick = () => {
    let idx = pageIndex + 1
    setPageIndex(idx)
    let pagedItems = allChunks[idx] as unknown as Item[]
    setDisplayItems(pagedItems)
  }
  const handlePreviousClick = () => {
    let idx = pageIndex - 1
    setPageIndex(idx)
    let pagedItems = allChunks[idx] as unknown as Item[]
    setDisplayItems(pagedItems)
  }

  return (
    <>
      <Box sx={{ my: 2 }}>
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
      <Box sx={{ textAlign: 'center' }}>
        <Button variant='text' disabled={pageIndex == 0} onClick={handlePreviousClick}>
          <ArrowBackIos />
        </Button>
        <Button variant='text' onClick={handleNextClick} disabled={pageIndex == allChunks.length - 1}>
          <ArrowForwardIos />
        </Button>
      </Box>
    </>
  )
}

export default BlogsLayout
