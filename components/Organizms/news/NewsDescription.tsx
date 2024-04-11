import { Box } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const NewsDescription = ({ item }: { item: NewsItem }) => {
  const alignLeft = item.Source!.includes('Google') || item.Source?.includes('TheDaily')
  switch (item.Source! as NewsTypeIds) {
    case 'Pluralistic':
    case 'HackerNews':
    case 'RawStory': {
      return <></>
    }
    case 'BbcBusiness':
    case 'BbcWorld': {
      return (
        <>
          {item.Description && item.Description.length > 1 && (
            <Box pt={1} width={{ xs: 360, sm: 'unset' }} textAlign={'center'}>
              <HtmlView html={item.Description} />
            </Box>
          )}
        </>
      )
    }
  }
  return (
    <>
      <Box pt={1} width={{ xs: 360, sm: 'unset' }} textAlign={alignLeft ? 'left' : 'center'}>
        <HtmlView html={item.Description ?? ''} textAlign={alignLeft ? 'left' : 'center'} />
      </Box>
    </>
  )
}

export default NewsDescription
