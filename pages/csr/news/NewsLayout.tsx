import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import RemoteImage from 'components/Atoms/RemoteImage'
import WarmupBox from 'components/Atoms/WarmupBox'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { orderBy } from 'lodash'
import React from 'react'

const NewsLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])

  const loadData = async (id: NewsTypeIds) => {
    const result = (await axiosGet(`/api/news?id=${id}`)) as NewsItem[]
    const sorted = orderBy(result, ['PublishDate'], ['desc'])
    setNewsItems(sorted)
    setIsLoading(false)
    console.log(JSON.stringify(result))
  }
  const handleNewsSourceSelected = async (id: string) => {
    setIsLoading(true)
    await loadData(id as NewsTypeIds)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData('GoogleTopStories')
    }
    fn()
  }, [])
  return (
    <Container>
      <NonSSRWrapper>
        <Box py={2}>
          <CenterStack>
            <Stack display='flex' flexDirection='row' gap={2}>
              <DropDownList options={newsTypes} selectedOption={'GoogleTopStories'} onOptionSelected={handleNewsSourceSelected} label='source' />
            </Stack>
          </CenterStack>
        </Box>
        <Box py={2}>
          {isLoading ? (
            <WarmupBox />
          ) : (
            <Box sx={{ maxHeight: 580, overflowY: 'auto' }}>
              {newsItems.map((item, i) => (
                <Box key={i} pb={2}>
                  <Typography>
                    <Link href={item.Link} target='_blank' color='primary' sx={{ fontWeight: 700 }}>
                      {item.Headline}
                    </Link>
                  </Typography>
                  {item.Description && item.Source && item.Source !== 'HackerNews' && (
                    <Typography variant='body1' color='primary' dangerouslySetInnerHTML={{ __html: item.Description }}></Typography>
                  )}
                  {item.TeaserImageUrl && item.TeaserImageUrl.length > 0 && (
                    <Box pt={1}>
                      <img src={item.TeaserImageUrl} title='' width={200} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </NonSSRWrapper>
    </Container>
  )
}

export default NewsLayout
