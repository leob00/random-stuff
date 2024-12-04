import { Box } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const NewsDescription = ({ item }: { item: NewsItem }) => {
  const alignLeft = true //item.Source!.includes('Google') || item.Source?.includes('TheDaily')
  switch (item.Source! as NewsTypeIds) {
    case 'Pluralistic':
    case 'HackerNews':
    case 'RawStory': {
      return <></>
    }
  }
  return (
    <>
      <Box pt={1} width={{ xs: 360, sm: 'unset' }} textAlign={alignLeft ? 'left' : 'center'}>
        <FadeIn>
          <HtmlView html={item.Description ?? ''} textAlign={alignLeft ? 'left' : 'center'} />
        </FadeIn>
      </Box>
    </>
  )
}

export default NewsDescription
