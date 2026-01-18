'use client'
import { Box } from '@mui/material'
import RecipeTeaser from './RecipeTeaser'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { useState } from 'react'
import PrevNextPager from 'components/Atoms/Paging/PrevNextPager'

const FeaturedRecipesDisplay = ({ featured, imageWidth, imageHeight }: { featured: Recipe[]; imageWidth?: number; imageHeight?: number }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handlePrevClick = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }
  const handleNextClick = () => {
    if (selectedIndex < featured.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }
  return (
    <Box>
      <RecipeTeaser item={featured[selectedIndex]} showSummary={false} showImage imageWidth={imageWidth} imageHeight={imageHeight} />
      <PrevNextPager itemCount={featured.length} handleNextClick={handleNextClick} handlePrevClick={handlePrevClick} selectedIndex={selectedIndex} />
    </Box>
  )
}
export default FeaturedRecipesDisplay
