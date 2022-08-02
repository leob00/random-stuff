import { Box, Button, Typography, Divider, Stack } from '@mui/material'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import Pager from 'components/Atoms/Pager'
import RemoteImage from 'components/Atoms/RemoteImage'
import { BasicArticle } from 'lib/model'
import { pageItems } from 'lib/util/collections'
import { cloneDeep, findLast, shuffle } from 'lodash'
import router from 'next/router'
import React, { useState } from 'react'

const ArticlesLayout = ({ articles }: { articles: BasicArticle[] }) => {
  const shuffled = shuffle(cloneDeep(articles))
  const itemsPerPage = 1
  const paged = pageItems(shuffled, itemsPerPage)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [displayedItems, setDisplayedItems] = useState(paged.pages[0].items)

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(paged.pages, (p) => {
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
            <CenteredTitle title={displayedItems[0].title} />
            <Divider />
          </Box>
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
