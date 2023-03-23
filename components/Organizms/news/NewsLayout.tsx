import { Box, Link, Stack } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import WarmupBox from 'components/Atoms/WarmupBox'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { orderBy } from 'lodash'
import React from 'react'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { get } from 'lib/backend/api/fetchFunctions'

const NewsLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  const [showError, setShowError] = React.useState(false)
  const userController = useUserController()

  const loadData = async (id: NewsTypeIds) => {
    try {
      const result = (await get(`/api/news?id=${id}`)) as NewsItem[]
      const sorted = orderBy(result, ['PublishDate'], ['desc'])
      if (userController.authProfile) {
        userController.authProfile.noteTitles.forEach((note) => {
          sorted.forEach((newsItem) => {
            if (newsItem.Headline === note.title) {
              newsItem.Saved = true
            }
          })
        })
      }
      setNewsItems(sorted)
    } catch (err) {
      console.log('error in news api: ', err)
      setShowError(true)
    }
    setIsLoading(false)
  }
  const handleNewsSourceSelected = async (id: string) => {
    setIsLoading(true)
    await loadData(id as NewsTypeIds)
  }
  const handleSaved = async (note: UserNote) => {}

  const RenderDescription = (item: NewsItem) => {
    if (item.Source!.includes('HackerNews')) {
      return <></>
    }
    if (item.Source?.includes('Bbc')) {
      return (
        <Box pt={1} width={{ xs: 280, md: 'unset' }} textAlign={'center'}>
          <HtmlView html={item.Description} />
        </Box>
      )
    }
    return (
      <Box pt={1} width={{ xs: 280, md: 'unset' }}>
        <HtmlView html={item.Description} />
      </Box>
    )
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData('GoogleTopStories')
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
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
              {showError && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
              {newsItems.length > 0 ? (
                newsItems.map((item, i) => (
                  <Box key={i} pb={2}>
                    <Box width={{ xs: 300, md: 'unset' }} textAlign={'center'}>
                      <Link href={item.Link} target='_blank' color='primary' sx={{ fontWeight: 700 }}>
                        {item.Headline}
                      </Link>
                    </Box>
                    {RenderDescription(item)}
                    {item.TeaserImageUrl && item.TeaserImageUrl.length > 0 && (
                      <Box pt={1} maxWidth={350} display={'flex'} sx={{ margin: 'auto' }}>
                        <img src={item.TeaserImageUrl} title='' width={300} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
                      </Box>
                    )}
                    {userController.username && (
                      <Box>
                        <Stack py={2}>
                          {!item.Saved ? (
                            <SaveToNotesButton
                              username={userController.username}
                              note={{
                                title: item.Headline!,
                                body: `${item.Description} <p style='text-align:center;'><a href='${item.Link}' target='_blank'>link<a/></p>`,
                                dateCreated: getUtcNow().format(),
                                dateModified: getUtcNow().format(),
                                expirationDate: getUtcNow().add(3, 'day').format(),
                              }}
                              onSaved={handleSaved}
                            />
                          ) : (
                            <SavedNoteButtonLink />
                          )}
                        </Stack>
                        <HorizontalDivider />
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <NoDataFound message={'Unable to load articles from this source at this time. Please try again later.'} />
              )}
            </Box>
          )}
        </Box>
      </NonSSRWrapper>
    </>
  )
}

export default NewsLayout
