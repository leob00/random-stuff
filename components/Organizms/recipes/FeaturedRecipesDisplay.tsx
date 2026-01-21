'use client'
import { Box } from '@mui/material'
import RecipeTeaser from './RecipeTeaser'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { useState } from 'react'
import PrevNextPager from 'components/Atoms/Paging/PrevNextPager'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'

const FeaturedRecipesDisplay = ({ featured, imageWidth, imageHeight }: { featured: Recipe[]; imageWidth?: number; imageHeight?: number }) => {
  // const [selectedIndex, setSelectedIndex] = useState(0)

  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(featured, 1)
  const items = getPagedItems(featured)

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }

  return (
    <Box>
      <RecipeTeaser item={items[0]} showSummary={false} showImage imageWidth={imageWidth} imageHeight={imageHeight} />
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={items.length}
        itemsPerPage={1}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
        showHorizontalDivider={false}
      ></Pager>
      {/* <PrevNextPager itemCount={featured.length} handleNextClick={handleNextClick} handlePrevClick={handlePrevClick} selectedIndex={selectedIndex} /> */}
    </Box>
  )
}
export default FeaturedRecipesDisplay
