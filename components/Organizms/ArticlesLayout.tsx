import { Box, Divider, Stack } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import RemoteImage from 'components/Atoms/RemoteImage'
import { BasicArticle } from 'lib/model'
import { getPagedItems } from 'lib/util/collections'
import { cloneDeep, findLast } from 'lodash'
import React, { useState } from 'react'

const ArticlesLayout = ({ articles }: { articles: BasicArticle[] }) => {
  const shuffled = cloneDeep(articles)
  const itemsPerPage = 1
  const paged = getPagedItems<BasicArticle>(shuffled, itemsPerPage)

  const [currentPageIndex, setCurrentPageIndex] = useState(1)
  const [displayedItems, setDisplayedItems] = useState<BasicArticle[]>(paged.pages[0].items as BasicArticle[])

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
            <BackToHomeButton />
            <CenteredTitle title={articles[0].title} />
            <HorizontalDivider />
          </Box>
          {displayedItems.length > 0 && (
            <Stack direction='row' justifyContent='center' my={2}>
              <RemoteImage url={displayedItems[0].imagePath} title={displayedItems[0].title} onLoaded={handleImageLoaded} />
            </Stack>
          )}
          <Pager
            pageCount={paged.pages.length}
            itemCount={articles.length}
            itemsPerPage={itemsPerPage}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={currentPageIndex}
          ></Pager>
        </>
      )}
    </>
  )
}

export default ArticlesLayout
