import { Box } from '@mui/material'
import React from 'react'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeTeaser from './RecipeTeaser'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'
import router from 'next/router'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const baseUrl = '/ssg/recipes/'
  const scroller = useScrollTop(0)
  const handleSelected = (item: DropdownItem) => {
    scroller.scroll()
    router.push(`${baseUrl}${item.value}`)
  }
  return (
    <>
      <PageHeader text={''} backButtonRoute={baseUrl} />

      <Box>
        {autoComplete && (
          <CenterStack sx={{ py: 2 }}>
            <StaticAutoComplete
              options={autoComplete}
              selectedItem={selectedOption}
              placeholder={`search ${autoComplete.length} recipes`}
              onSelected={handleSelected}
              disableClearable
            />
          </CenterStack>
        )}
      </Box>
      <ScrollableBox maxHeight={800} scroller={scroller}>
        <RecipeTeaser item={article} clickable={false} />
        <Box px={2}>{documentToReactComponents(article.richBody.json)}</Box>
      </ScrollableBox>
    </>
  )
}

export default RecipeLayout
