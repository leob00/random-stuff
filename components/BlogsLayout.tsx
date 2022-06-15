import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Link, Stack, TextField, Typography } from '@mui/material'
import { BlogCollection, Item } from 'lib/models/cms/contentful/blog'
import { PagedCollection, pageItems } from 'lib/util/collections'
import NLink from 'next/link'
import React, { useEffect, useState } from 'react'
import Pager from './Atoms/Pager'
import { Option } from 'lib/AutoCompleteOptions'
import { findLast } from 'lodash'

const BlogsLayout = ({ model }: { model: BlogCollection }) => {
  const itemsPerPage = 1
  const paged = pageItems(model.items, itemsPerPage) as PagedCollection
  let searchItems: Array<Option> = []
  model.items.forEach((a) => {
    searchItems.push({ label: a.title, id: a.id })
  })
  const displayed = paged.pages[0].items as Item[]
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [displayItems, setDisplayItems] = useState<Item[]>(displayed)

  let title = displayed[0].title
  let summary = displayed[0].summary
  let body = displayed[0].body
  let count = model.items.length

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(paged.pages, function (p) {
      return p.index === pageNum
    })
    if (page) {
      let pagedItems = page.items as Item[]
      setDisplayItems(pagedItems)
    }
  }
  const handleSearched = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option

    if (!sel) {
      //setCurrentPageIndex(1)
      return
    }
    let id = sel.id as number
    let foundPage = findLast(paged.pages, function (p) {
      return (
        findLast(p.items, function (i) {
          return i.id === id
        }) !== undefined
      )
    })
    //console.log(JSON.stringify(foundPage))
    if (foundPage) {
      setCurrentPageIndex(foundPage.index)
      setDisplayItems(foundPage.items)
    }
  }

  useEffect(() => {
    const displayed = paged.pages[currentPageIndex - 1].items as Item[]
    setDisplayItems(displayed)
  }, [currentPageIndex, count, title, summary, body])

  return (
    <>
      <Box>
        <Stack direction='row' justifyContent='left' sx={{ my: 2 }}>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.label === value.label}
            size='small'
            onChange={handleSearched}
            disablePortal
            options={searchItems}
            sx={{ width: 360 }}
            renderInput={(params) => <TextField {...params} placeholder='search' />}
          />
        </Stack>
      </Box>
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
      <Pager pageCount={paged.pages.length} itemCount={model.items.length} itemsPerPage={itemsPerPage} onPaged={(pageNum: number) => handlePaged(pageNum)} defaultPageIndex={currentPageIndex}></Pager>
    </>
  )
}

export default BlogsLayout
