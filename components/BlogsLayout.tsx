import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, Box, Link, Stack, TextField, Typography } from '@mui/material'
import { BlogCollection, BlogItem } from 'lib/models/cms/contentful/blog'
import { getPagedItems, PagedCollection } from 'lib/util/collections'
import NLink from 'next/link'
import React, { useEffect, useState } from 'react'
import Pager from './Atoms/Pager'
import { Option } from 'lib/AutoCompleteOptions'
import { findLast } from 'lodash'
import RemoteImage from './Atoms/RemoteImage'

const BlogsLayout = ({ model }: { model: BlogCollection }) => {
  const itemsPerPage = 1
  const paged = getPagedItems<BlogItem>(model.items, itemsPerPage) as PagedCollection
  let searchItems: Array<Option> = []
  model.items.forEach((a) => {
    searchItems.push({ label: a.title, id: String(a.id) })
  })
  const displayed = paged.pages[0].items as BlogItem[]
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [displayItems, setDisplayItems] = useState<BlogItem[]>(displayed)

  let title = displayed[0].title
  let summary = displayed[0].summary
  let body = displayed[0].body
  let count = model.items.length //HEY LEO!!!
  //HELLO!!!
  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(paged.pages, function (p) {
      return p.index === pageNum
    })
    if (page) {
      let pagedItems = page.items as BlogItem[]
      setDisplayItems(pagedItems)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  const handleSearched = (
    event: React.SyntheticEvent<Element, Event>,
    value: Option | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Option> | undefined,
  ) => {
    let sel = value as Option

    if (!sel) {
      //setCurrentPageIndex(1)
      return
    }
    let id = sel.id!
    let foundPage = findLast(paged.pages, function (p) {
      return (
        findLast(p.items, function (i) {
          return i.id === id
        }) !== undefined
      )
    })
    if (foundPage) {
      setCurrentPageIndex(foundPage.index)
      setDisplayItems(foundPage.items)
    }
  }

  useEffect(() => {
    const displayed = paged.pages[currentPageIndex - 1].items as BlogItem[]
    setDisplayItems(displayed)
  }, [currentPageIndex, count, title, summary, body]) /* eslint-disable-line react-hooks/exhaustive-deps */ /* this is needed for some reason */

  return (
    <>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Box>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.label === value.label}
            size='small'
            onChange={handleSearched}
            disablePortal
            options={searchItems}
            sx={{ width: 360 }}
            renderInput={(params) => <TextField {...params} placeholder='search' />}
          />
        </Box>
      </Stack>
      <Box sx={{ my: 2, minHeight: 360 }}>
        {displayItems.map((item) => (
          <Box key={item.id} sx={{ paddingBottom: 4 }}>
            <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
              <Typography variant='h6' sx={{ paddingBottom: 2, paddingLeft: 1 }}>
                {item.title}
              </Typography>
            </Stack>
            {item.heroImage && (
              <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                <RemoteImage url={item.heroImage.url} title={item.title} />
              </Stack>
            )}
            <Typography variant='body1' sx={{ paddingTop: 2, paddingLeft: 1 }}>
              {item.summary}
            </Typography>
            {item.body && (
              <Typography variant='body2' sx={{ paddingTop: 2, paddingLeft: 1 }}>
                {item.body}
              </Typography>
            )}
            <Typography variant='body2' sx={{ paddingTop: 2, paddingLeft: 1 }}>
              <NLink href={item.externalUrl} passHref>
                <Link target='_blank'>Read More</Link>
              </NLink>
            </Typography>
          </Box>
        ))}
      </Box>

      <Pager
        pageCount={paged.pages.length}
        itemCount={model.items.length}
        itemsPerPage={itemsPerPage}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={currentPageIndex}
        totalItemCount={model.items.length}
      ></Pager>
    </>
  )
}

export default BlogsLayout
