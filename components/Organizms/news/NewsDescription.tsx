import { Box } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const NewsDescription = ({ item }: { item: NewsItem }) => {
  switch (item.Source! as NewsTypeIds) {
    case 'Pluralistic':
    case 'HackerNews': {
      return <></>
    }
    case 'BbcBusiness':
    case 'BbcWorld': {
      return (
        <>
          {item.Description && item.Description.length > 2 && (
            <Box pt={1} width={{ xs: 360, sm: 'unset' }} textAlign={'center'}>
              <HtmlView html={item.Description} />
            </Box>
          )}
        </>
      )
    }
  }
  return (
    <Box pt={1} width={{ xs: 360, sm: 'unset' }}>
      <HtmlView html={item.Description ?? ''} textAlign={item.Source!.includes('Google') ? 'left' : 'center'} />
    </Box>
  )
}

export default NewsDescription
