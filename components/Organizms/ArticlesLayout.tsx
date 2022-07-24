import { Box, Button, Typography, Divider, Stack } from '@mui/material'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import Pager from 'components/Atoms/Pager'
import RemoteImage from 'components/Atoms/RemoteImage'
import { BasicArticle } from 'lib/model'
import { PagedCollection, pageItems } from 'lib/util/collections'
import { findLast } from 'lodash'
import router from 'next/router'
import React, { useState } from 'react'

const ArticlesLayout = ({ articles }: { articles: BasicArticle[] }) => {
  const itemsPerPage = 1
  const paged = pageItems(articles, itemsPerPage) as PagedCollection
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [displayedItems, setDisplayedItems] = useState(paged.pages[0].items)

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(paged.pages, function (p) {
      return p.index === pageNum
    })
    if (page) {
      setDisplayedItems(page.items as BasicArticle[])
    }
  }
  const handleImageLoaded = () => {}

  return (
    <>
      {articles && (
        <>
          <Box>
            <Button
              variant='text'
              onClick={() => {
                router.push('/')
              }}>
              &#8592; back
            </Button>
            <CenteredTitle title={articles[0].title} />
            <Divider />
          </Box>
          {/* {articles.map((item) => (
            <Stack direction='row' justifyContent='center' my={2} key={item.imagePath}>
              <RemoteImage url={item.imagePath} title={item.title} />
            </Stack>
          ))} */}
          <Stack direction='row' justifyContent='center' my={2} key={articles[0].imagePath}>
            <RemoteImage url={displayedItems[0].imagePath} title={displayedItems[0].title} onLoaded={handleImageLoaded} />
          </Stack>
          <Pager pageCount={paged.pages.length} itemCount={articles.length} itemsPerPage={itemsPerPage} onPaged={(pageNum: number) => handlePaged(pageNum)} defaultPageIndex={currentPageIndex}></Pager>
        </>
      )}
    </>
  )
}

export default ArticlesLayout
